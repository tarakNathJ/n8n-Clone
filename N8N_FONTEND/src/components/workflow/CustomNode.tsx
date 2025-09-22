import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Settings, Trash2 } from 'lucide-react';
import { mockNodeTypes } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface CustomNodeData {
  name: string;
  type: string;
  selected?: boolean;
}

export default function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const nodeType = mockNodeTypes.find(nt => nt.id === data.type);
  const icon = nodeType?.icon || '⚡';
  const color = nodeType?.color || 'hsl(var(--primary))';

  return (
    <div className={cn(
      'relative bg-workflow-node border-2 rounded-xl transition-all duration-200',
      'flex flex-col items-center gap-2 min-w-[160px] p-4',
      selected 
        ? 'border-workflow-node-active shadow-lg scale-105' 
        : 'border-n8n-node-border hover:border-n8n-node-border/80'
    )}>
      {/* Input handle for non-trigger nodes */}
      {nodeType?.category !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-workflow-connection border-2 border-n8n-node-border"
        />
      )}
      
      {/* Node icon */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      
      {/* Node content */}
      <div className="text-center">
        <div className="font-medium text-n8n-sidebar-foreground text-sm">
          {data.name}
        </div>
        <div className="text-xs text-n8n-sidebar-foreground/60">
          {data.type}
        </div>
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2">
          <div className="w-4 h-4 bg-workflow-node-active rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-workflow-connection border-2 border-n8n-node-border"
      />

      {/* Node actions (visible on hover) */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <button className="p-1 bg-n8n-sidebar rounded text-n8n-sidebar-foreground hover:bg-n8n-header">
            <Settings className="h-3 w-3" />
          </button>
          <button className="p-1 bg-destructive rounded text-destructive-foreground hover:bg-destructive/90">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}