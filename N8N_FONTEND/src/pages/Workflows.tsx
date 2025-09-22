import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Play,
  Pause,
  Copy,
  Trash2,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockWorkflows } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Workflows() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const { toast } = useToast();

  const filteredWorkflows = mockWorkflows
    .filter(workflow => {
      const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-n8n-success text-white';
      case 'inactive': return 'bg-n8n-sidebar text-n8n-sidebar-foreground border border-n8n-node-border';
      default: return 'bg-n8n-sidebar text-n8n-sidebar-foreground';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleWorkflowAction = (action: string, workflowId: string, workflowName: string) => {
    toast({
      title: 'Action Performed',
      description: `${action} workflow "${workflowName}"`,
    });
  };

  return (
    <div className="p-6 space-y-6 bg-n8n-canvas min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-n8n-canvas-foreground">Workflows</h1>
          <p className="text-n8n-canvas-foreground/70 mt-1">
            Manage and monitor your automation workflows
          </p>
        </div>
        <Link to="/workflows/editor">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create  Workflow
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="bg-n8n-sidebar border-n8n-node-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n8n-sidebar-foreground/60 h-4 w-4" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <div className="grid gap-4">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="bg-n8n-sidebar border-n8n-node-border hover:border-n8n-node-border/80 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Link 
                      to={`/workflows/editor/${workflow.id}`}
                      className="text-xl font-semibold text-n8n-sidebar-foreground hover:text-primary transition-colors"
                    >
                      {workflow.name}
                    </Link>
                    <Badge className={cn('text-xs', getStatusColor(workflow.status))}>
                      {workflow.status}
                    </Badge>
                  </div>
                  
                  {workflow.description && (
                    <p className="text-n8n-sidebar-foreground/70">{workflow.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-n8n-sidebar-foreground/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {formatDate(workflow.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{workflow.owner}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      <span>{workflow.executions} executions</span>
                    </div>
                    {workflow.lastRun && (
                      <div className="flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        <span>Last run {formatDate(workflow.lastRun)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {workflow.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-n8n-node-border text-n8n-sidebar-foreground/70">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'border-n8n-node-border',
                      workflow.status === 'active' 
                        ? 'hover:bg-n8n-error/10 hover:border-n8n-error text-n8n-error'
                        : 'hover:bg-n8n-success/10 hover:border-n8n-success text-n8n-success'
                    )}
                    onClick={() => handleWorkflowAction(
                      workflow.status === 'active' ? 'Paused' : 'Activated',
                      workflow.id,
                      workflow.name
                    )}
                  >
                    {workflow.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-n8n-node-border">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleWorkflowAction('Duplicated', workflow.id, workflow.name)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleWorkflowAction('Deleted', workflow.id, workflow.name)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-n8n-header rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-n8n-sidebar-foreground/60" />
            </div>
            <CardTitle className="text-n8n-sidebar-foreground mb-2">No workflows found</CardTitle>
            <CardDescription className="text-n8n-sidebar-foreground/60">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first workflow to get started'
              }
            </CardDescription>
            {!searchTerm && statusFilter === 'all' && (
              <Link to="/workflows/editor" className="mt-4 inline-block">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}