'use client';

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardChartsProps {
  leaveRequestsData: {
    pending: number;
    approved: number;
    rejected: number;
  };
  evaluationsData: {
    draft: number;
    submitted: number;
    finalized: number;
  };
}

const COLORS = {
  pending: '#fbbf24', // yellow
  approved: '#10b981', // green
  rejected: '#ef4444', // red
  draft: '#6b7280', // gray
  submitted: '#3b82f6', // blue
  finalized: '#8b5cf6', // purple
};

export function DashboardCharts({ leaveRequestsData, evaluationsData }: DashboardChartsProps) {
  const leaveRequestsChartData = [
    { name: 'Pendientes', value: leaveRequestsData.pending, color: COLORS.pending },
    { name: 'Aprobadas', value: leaveRequestsData.approved, color: COLORS.approved },
    { name: 'Rechazadas', value: leaveRequestsData.rejected, color: COLORS.rejected },
  ].filter(item => item.value > 0);

  const evaluationsChartData = [
    { name: 'Borrador', value: evaluationsData.draft, color: COLORS.draft },
    { name: 'Enviadas', value: evaluationsData.submitted, color: COLORS.submitted },
    { name: 'Finalizadas', value: evaluationsData.finalized, color: COLORS.finalized },
  ].filter(item => item.value > 0);

  const barChartData = [
    {
      name: 'Ausentismos',
      Pendientes: leaveRequestsData.pending,
      Aprobadas: leaveRequestsData.approved,
      Rechazadas: leaveRequestsData.rejected,
    },
    {
      name: 'Evaluaciones',
      Borrador: evaluationsData.draft,
      Enviadas: evaluationsData.submitted,
      Finalizadas: evaluationsData.finalized,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div>
        <h3 className="text-sm font-medium mb-2">Distribución General</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pendientes" fill={COLORS.pending} />
            <Bar dataKey="Aprobadas" fill={COLORS.approved} />
            <Bar dataKey="Rechazadas" fill={COLORS.rejected} />
            <Bar dataKey="Borrador" fill={COLORS.draft} />
            <Bar dataKey="Enviadas" fill={COLORS.submitted} />
            <Bar dataKey="Finalizadas" fill={COLORS.finalized} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Solicitudes de Ausencia</h3>
          {leaveRequestsChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={leaveRequestsChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leaveRequestsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay datos
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Evaluaciones</h3>
          {evaluationsChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={evaluationsChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {evaluationsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay datos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

