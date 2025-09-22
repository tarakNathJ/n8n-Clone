import React from 'react';
import { mockNodeTypes } from '@/lib/mockData';

interface NodePaletteProps {
  onNodeDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export default function NodePalette({ onNodeDragStart }: NodePaletteProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-n8n-sidebar-foreground mb-3">Triggers</h3>
        <div className="space-y-2">
          {mockNodeTypes
            .filter(node => node.category === 'trigger')
            .map((nodeType) => (
              <div
                key={nodeType.id}
                className="p-3 rounded-lg bg-n8n-header border border-n8n-node-border hover:border-n8n-node-border/80 cursor-grab active:cursor-grabbing transition-colors"
                draggable
                onDragStart={(event) => onNodeDragStart(event, nodeType.id)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: nodeType.color }}
                  >
                    {nodeType.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-n8n-sidebar-foreground text-sm">
                      {nodeType.name}
                    </div>
                    <div className="text-xs text-n8n-sidebar-foreground/60">
                      {nodeType.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-n8n-sidebar-foreground mb-3">Actions</h3>
        <div className="space-y-2">
          {mockNodeTypes
            .filter(node => node.category === 'action')
            .map((nodeType) => (
              <div
                key={nodeType.id}
                className="p-3 rounded-lg bg-n8n-header border border-n8n-node-border hover:border-n8n-node-border/80 cursor-grab active:cursor-grabbing transition-colors"
                draggable
                onDragStart={(event) => onNodeDragStart(event, nodeType.id)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: nodeType.color }}
                  >
                    {nodeType.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-n8n-sidebar-foreground text-sm">
                      {nodeType.name}
                    </div>
                    <div className="text-xs text-n8n-sidebar-foreground/60">
                      {nodeType.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}