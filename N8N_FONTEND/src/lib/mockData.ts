// Mock data for the n8n-like app

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  lastRun?: Date;
  nextRun?: Date;
  executions: number;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  description?: string;
}

export interface Execution {
  id: string;
  workflowId: string;
  status: 'success' | 'error' | 'running' | 'waiting';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  mode: 'manual' | 'webhook' | 'trigger';
}

export interface WorkspaceStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  avgExecutionTime: number;
  executionsToday: number;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    avatar: 'JD'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    avatar: 'JS'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    role: 'Viewer',
    avatar: 'MW'
  }
];

export const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Email Newsletter Automation',
    status: 'active',
    lastRun: new Date('2024-01-15T10:30:00'),
    nextRun: new Date('2024-01-16T10:30:00'),
    executions: 47,
    owner: 'John Doe',
    createdAt: new Date('2024-01-01T09:00:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    tags: ['email', 'marketing', 'automation'],
    description: 'Automatically sends weekly newsletters to subscribers'
  },
  {
    id: '2',
    name: 'Customer Support Ticket Handler',
    status: 'active',
    lastRun: new Date('2024-01-15T14:20:00'),
    executions: 123,
    owner: 'Jane Smith',
    createdAt: new Date('2023-12-15T11:00:00'),
    updatedAt: new Date('2024-01-15T14:20:00'),
    tags: ['support', 'tickets', 'automation'],
    description: 'Routes and categorizes incoming support tickets'
  },
  {
    id: '3',
    name: 'Social Media Content Scheduler',
    status: 'inactive',
    lastRun: new Date('2024-01-10T16:00:00'),
    executions: 89,
    owner: 'John Doe',
    createdAt: new Date('2023-11-20T13:30:00'),
    updatedAt: new Date('2024-01-10T16:00:00'),
    tags: ['social', 'content', 'scheduler'],
    description: 'Schedules and publishes content across social platforms'
  },
  {
    id: '4',
    name: 'Data Backup & Sync',
    status: 'active',
    lastRun: new Date('2024-01-15T02:00:00'),
    nextRun: new Date('2024-01-16T02:00:00'),
    executions: 365,
    owner: 'Mike Wilson',
    createdAt: new Date('2023-01-01T00:00:00'),
    updatedAt: new Date('2024-01-15T02:00:00'),
    tags: ['backup', 'sync', 'database'],
    description: 'Daily backup and synchronization of critical data'
  },
  {
    id: '5',
    name: 'Lead Generation Pipeline',
    status: 'active',
    lastRun: new Date('2024-01-15T11:45:00'),
    executions: 67,
    owner: 'Jane Smith',
    createdAt: new Date('2024-01-05T14:00:00'),
    updatedAt: new Date('2024-01-15T11:45:00'),
    tags: ['leads', 'sales', 'crm'],
    description: 'Processes and qualifies incoming leads automatically'
  }
];

export const mockExecutions: Execution[] = [
  {
    id: '1',
    workflowId: '1',
    status: 'success',
    startTime: new Date('2024-01-15T10:30:00'),
    endTime: new Date('2024-01-15T10:32:15'),
    duration: 135,
    mode: 'trigger'
  },
  {
    id: '2',
    workflowId: '2',
    status: 'success',
    startTime: new Date('2024-01-15T14:20:00'),
    endTime: new Date('2024-01-15T14:20:45'),
    duration: 45,
    mode: 'webhook'
  },
  {
    id: '3',
    workflowId: '4',
    status: 'success',
    startTime: new Date('2024-01-15T02:00:00'),
    endTime: new Date('2024-01-15T02:15:30'),
    duration: 930,
    mode: 'trigger'
  },
  {
    id: '4',
    workflowId: '5',
    status: 'error',
    startTime: new Date('2024-01-15T11:45:00'),
    endTime: new Date('2024-01-15T11:45:12'),
    duration: 12,
    mode: 'webhook'
  },
  {
    id: '5',
    workflowId: '1',
    status: 'running',
    startTime: new Date('2024-01-15T15:30:00'),
    mode: 'manual'
  }
];

export const mockWorkspaceStats: WorkspaceStats = {
  totalWorkflows: 5,
  activeWorkflows: 4,
  totalExecutions: 691,
  successfulExecutions: 645,
  failedExecutions: 46,
  avgExecutionTime: 243, // seconds
  executionsToday: 12
};

// Auth mock data
export const mockAuthUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Admin'
};

export const mockCredentials = [
  { email: 'john@example.com', password: 'password123' },
  { email: 'jane@example.com', password: 'password123' },
  { email: 'mike@example.com', password: 'password123' },
];

// Node types for the workflow editor
export interface NodeType {
  id: string;
  name: string;
  icon: string;
  category: 'trigger' | 'action' | 'conditional';
  color: string;
  description: string;
}

export const mockNodeTypes: NodeType[] = [
  {
    id: 'webhook',
    name: 'Webhook',
    icon: '🔗',
    category: 'trigger',
    color: 'hsl(var(--n8n-primary))',
    description: 'Receive HTTP requests'
  },
  {
    id: 'email',
    name: 'Send Email',
    icon: '✉️',
    category: 'action',
    color: 'hsl(var(--n8n-success))',
    description: 'Send emails via SMTP'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '📱',
    category: 'action',
    color: 'hsl(202, 100%, 50%)',
    description: 'Send messages to Telegram'
  },
  {
    id: 'form',
    name: 'Form Trigger',
    icon: '📝',
    category: 'trigger',
    color: 'hsl(var(--n8n-warning))',
    description: 'Trigger on form submissions'
  },
  {
    id: 'ai-agent',
    name: 'AI Agent',
    icon: '🤖',
    category: 'action',
    color: 'hsl(280, 100%, 50%)',
    description: 'AI-powered responses'
  },
  {
    id: 'condition',
    name: 'IF Condition',
    icon: '🔀',
    category: 'conditional',
    color: 'hsl(var(--n8n-warning))',
    description: 'Branch workflow based on conditions'
  }
];