'use client';

import { OrgChartNode } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface OrgChartTreeProps {
  nodes: OrgChartNode[];
  level?: number;
}

export function OrgChartTree({ nodes, level = 0 }: OrgChartTreeProps) {
  if (nodes.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {nodes.map((node) => (
        <OrgChartNodeComponent key={node.id} node={node} level={level} />
      ))}
    </div>
  );
}

interface OrgChartNodeComponentProps {
  node: OrgChartNode;
  level: number;
}

function OrgChartNodeComponent({ node, level }: OrgChartNodeComponentProps) {
  const hasSubordinates = node.subordinates && node.subordinates.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Línea vertical hacia arriba si no es el nivel 0 */}
      {level > 0 && (
        <div className="w-0.5 h-6 bg-border" />
      )}

      {/* Nodo del usuario */}
      <Card className={`min-w-[220px] transition-all hover:shadow-md ${level === 0 ? 'border-primary border-2' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <User className={`h-5 w-5 ${level === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold truncate ${level === 0 ? 'text-base' : 'text-sm'}`}>
                {node.name}
              </div>
              <div className="text-xs text-muted-foreground truncate mt-1">
                {node.email}
              </div>
              {node.employeeId && (
                <Badge variant="outline" className="text-xs mt-2">
                  {node.employeeId}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subordinados */}
      {hasSubordinates && (
        <>
          {/* Línea vertical hacia abajo */}
          <div className="w-0.5 h-6 bg-border" />

          {/* Contenedor de subordinados con líneas horizontales */}
          <div className="relative flex items-start gap-6 pt-6">
            {/* Línea horizontal superior si hay múltiples subordinados */}
            {node.subordinates.length > 1 && (
              <div 
                className="absolute top-0 left-0 right-0 h-0.5 bg-border"
                style={{
                  left: '50%',
                  right: '50%',
                  transform: 'translateX(-50%)',
                  width: `${(node.subordinates.length - 1) * 240}px`,
                }}
              />
            )}

            {node.subordinates.map((subordinate, index) => (
              <div key={subordinate.id} className="flex flex-col items-center relative">
                {/* Línea vertical desde la línea horizontal */}
                {node.subordinates.length > 1 && (
                  <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-border transform -translate-x-1/2" />
                )}
                {node.subordinates.length === 1 && (
                  <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-border transform -translate-x-1/2" />
                )}

                {/* Recursión para subordinados */}
                <OrgChartNodeComponent
                  node={subordinate}
                  level={level + 1}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

