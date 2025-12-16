import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Shield, 
  FileText, 
  Key, 
  Calendar, 
  TrendingUp, 
  Bell, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  usersApi, 
  rolesApi, 
  resourcesApi, 
  permissionsApi,
  leaveRequestsApi,
  evaluationsApi,
  notificationsApi,
  indicatorsApi
} from '@/lib/api-server';
import { DashboardCharts } from './dashboard-charts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // TODO: Obtener userId del session cuando esté disponible
  const userId = 1; // Temporal

  // Fetch all data
  let counts = {
    users: 0,
    roles: 0,
    resources: 0,
    permissions: 0,
    leaveRequests: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
    evaluations: {
      total: 0,
      draft: 0,
      submitted: 0,
      finalized: 0,
    },
    indicators: 0,
    unreadNotifications: 0,
  };

  let recentLeaveRequests: any[] = [];
  let recentEvaluations: any[] = [];

  try {
    const [
      users, 
      roles, 
      resources, 
      permissions,
      leaveRequests,
      evaluations,
      indicators,
      notifications
    ] = await Promise.all([
      usersApi.getAll().catch(() => []),
      rolesApi.getAll().catch(() => []),
      resourcesApi.getAll().catch(() => []),
      permissionsApi.getAll().catch(() => []),
      leaveRequestsApi.getAll().catch(() => []),
      evaluationsApi.getAll().catch(() => []),
      indicatorsApi.getAll(true).catch(() => []), // Solo activos
      notificationsApi.getAll(userId, { unreadOnly: true }).catch(() => []),
    ]);

    counts = {
      users: users.length,
      roles: roles.length,
      resources: resources.length,
      permissions: permissions.length,
      leaveRequests: {
        total: leaveRequests.length,
        pending: leaveRequests.filter((lr: any) => lr.status === 'pending').length,
        approved: leaveRequests.filter((lr: any) => lr.status === 'approved').length,
        rejected: leaveRequests.filter((lr: any) => lr.status === 'rejected').length,
      },
      evaluations: {
        total: evaluations.length,
        draft: evaluations.filter((e: any) => e.status === 'draft').length,
        submitted: evaluations.filter((e: any) => e.status === 'submitted').length,
        finalized: evaluations.filter((e: any) => e.status === 'finalized').length,
      },
      indicators: indicators.length,
      unreadNotifications: notifications.length,
    };

    // Obtener solicitudes recientes (últimas 5)
    recentLeaveRequests = leaveRequests
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Obtener evaluaciones recientes (últimas 5)
    recentEvaluations = evaluations
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }

  const rbacStats = [
    {
      title: 'Usuarios',
      value: counts.users,
      icon: Users,
      href: '/users',
      description: 'Usuarios del sistema',
      color: 'text-blue-600'
    },
    {
      title: 'Roles',
      value: counts.roles,
      icon: Shield,
      href: '/roles',
      description: 'Roles disponibles',
      color: 'text-purple-600'
    },
    {
      title: 'Recursos',
      value: counts.resources,
      icon: FileText,
      href: '/resources',
      description: 'Recursos gestionados',
      color: 'text-green-600'
    },
    {
      title: 'Permisos',
      value: counts.permissions,
      icon: Key,
      href: '/permissions',
      description: 'Permisos definidos',
      color: 'text-orange-600'
    }
  ];

  const hrStats = [
    {
      title: 'Solicitudes Pendientes',
      value: counts.leaveRequests.pending,
      icon: Clock,
      href: '/absences',
      description: 'Requieren aprobación',
      color: 'text-yellow-600',
      badge: counts.leaveRequests.pending > 0 ? 'warning' : undefined
    },
    {
      title: 'Evaluaciones',
      value: counts.evaluations.total,
      icon: TrendingUp,
      href: '/performance',
      description: `${counts.evaluations.finalized} finalizadas`,
      color: 'text-indigo-600'
    },
    {
      title: 'Indicadores Activos',
      value: counts.indicators,
      icon: TrendingUp,
      href: '/performance',
      description: 'Indicadores de performance',
      color: 'text-pink-600'
    },
    {
      title: 'Notificaciones',
      value: counts.unreadNotifications,
      icon: Bell,
      href: '/notifications',
      description: 'No leídas',
      color: 'text-red-600',
      badge: counts.unreadNotifications > 0 ? 'destructive' : undefined
    }
  ];

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case 'approved': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprobada</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rechazada</Badge>;
      case 'draft': return <Badge variant="secondary">Borrador</Badge>;
      case 'submitted': return <Badge variant="default">Enviada</Badge>;
      case 'finalized': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Finalizada</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accesos directos a las funcionalidades principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/users">
                <Users className="h-4 w-4 mr-2" />
                Gestionar Usuarios
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/absences">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Ausentismos
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/performance">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/audit">
                <FileText className="h-4 w-4 mr-2" />
                Auditoría
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RBAC Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Gestión de Permisos (RBAC)</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {rbacStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* HR Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recursos Humanos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {hrStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {stat.badge && (
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Ausentismos</CardTitle>
            <CardDescription>
              Distribución de solicitudes por estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCharts 
              leaveRequestsData={{
                pending: counts.leaveRequests.pending,
                approved: counts.leaveRequests.approved,
                rejected: counts.leaveRequests.rejected,
              }}
              evaluationsData={{
                draft: counts.evaluations.draft,
                submitted: counts.evaluations.submitted,
                finalized: counts.evaluations.finalized,
              }}
            />
          </CardContent>
        </Card>

        {/* Recent Leave Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Solicitudes Recientes</CardTitle>
                <CardDescription>
                  Últimas solicitudes de ausencia
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/absences">Ver todas</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentLeaveRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay solicitudes recientes
              </p>
            ) : (
              <div className="space-y-3">
                {recentLeaveRequests.map((request: any) => (
                  <div key={request.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Usuario ID: {request.userId}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </p>
                    </div>
                    <Link href={`/absences`}>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Evaluations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Evaluaciones Recientes</CardTitle>
              <CardDescription>
                Últimas evaluaciones de performance
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/performance">Ver todas</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentEvaluations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay evaluaciones recientes
            </p>
          ) : (
            <div className="space-y-3">
              {recentEvaluations.map((evaluation: any) => (
                <div key={evaluation.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Usuario ID: {evaluation.userId} - {evaluation.periodType === 'monthly' ? 'Mensual' : evaluation.periodType === 'quarterly' ? 'Trimestral' : 'Anual'}
                      </span>
                      {getStatusBadge(evaluation.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(evaluation.periodStart)} - {formatDate(evaluation.periodEnd)}
                      </p>
                      {evaluation.overallScore && (
                        <span className="text-xs font-semibold">
                          Score: {Number(evaluation.overallScore).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/performance`}>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
