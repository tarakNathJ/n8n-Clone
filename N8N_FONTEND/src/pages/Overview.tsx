import React from 'react';
import { 
  Users, 
  Activity, 
  Clock, 
  Server,
  TrendingUp,
  Calendar,
  Workflow
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockWorkspaceStats, mockUsers, mockWorkflows } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function Overview() {
  const stats = mockWorkspaceStats;
  const teamMembers = mockUsers;
  const activeWorkflows = mockWorkflows.filter(w => w.status === 'active');

  return (
    <div className="p-6 space-y-6 bg-n8n-canvas min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-n8n-canvas-foreground">Workspace Overview</h1>
        <p className="text-n8n-canvas-foreground/70 mt-1">
          High-level view of your automation workspace
        </p>
      </div>

      {/* Workspace Info Card */}
      <Card className="bg-n8n-sidebar border-n8n-node-border">
        <CardHeader>
          <CardTitle className="text-n8n-sidebar-foreground">Workspace Information</CardTitle>
          <CardDescription className="text-n8n-sidebar-foreground/60">
            General information about your n8n workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-n8n-sidebar-foreground/60">Workspace Name</div>
            <div className="text-lg font-semibold text-n8n-sidebar-foreground">My Automation Hub</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-n8n-sidebar-foreground/60">Plan</div>
            <Badge className="bg-primary text-primary-foreground">Pro Plan</Badge>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-n8n-sidebar-foreground/60">Created</div>
            <div className="text-lg font-semibold text-n8n-sidebar-foreground">Jan 1, 2024</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-n8n-sidebar-foreground">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <CardDescription className="text-n8n-sidebar-foreground/60">
              Users with access to this workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-n8n-header rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-medium text-n8n-sidebar-foreground">{member.name}</div>
                    <div className="text-sm text-n8n-sidebar-foreground/60">{member.email}</div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="border-n8n-node-border text-n8n-sidebar-foreground/70"
                >
                  {member.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Visual Stats */}
        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-n8n-sidebar-foreground">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription className="text-n8n-sidebar-foreground/60">
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-n8n-header rounded-lg text-center">
                <div className="text-2xl font-bold text-n8n-success">
                  {((stats.successfulExecutions / stats.totalExecutions) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-n8n-sidebar-foreground/60">Success Rate</div>
              </div>
              
              <div className="p-4 bg-n8n-header rounded-lg text-center">
                <div className="text-2xl font-bold text-n8n-warning">
                  {stats.executionsToday}
                </div>
                <div className="text-sm text-n8n-sidebar-foreground/60">Runs Today</div>
              </div>
              
              <div className="p-4 bg-n8n-header rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats.activeWorkflows}
                </div>
                <div className="text-sm text-n8n-sidebar-foreground/60">Active Workflows</div>
              </div>
              
              <div className="p-4 bg-n8n-header rounded-lg text-center">
                <div className="text-2xl font-bold text-n8n-sidebar-foreground">
                  {Math.floor(stats.avgExecutionTime / 60)}m
                </div>
                <div className="text-sm text-n8n-sidebar-foreground/60">Avg Runtime</div>
              </div>
            </div>

            {/* Simple chart representation */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-n8n-sidebar-foreground">Execution Trends (7 days)</div>
              <div className="flex items-end gap-1 h-20">
                {[65, 45, 78, 52, 89, 67, 95].map((height, index) => (
                  <div
                    key={index}
                    className="bg-primary rounded-t flex-1 transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-n8n-sidebar-foreground/60">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Workflows */}
      <Card className="bg-n8n-sidebar border-n8n-node-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-n8n-sidebar-foreground">
            <Workflow className="h-5 w-5" />
            Active Workflows
          </CardTitle>
          <CardDescription className="text-n8n-sidebar-foreground/60">
            Currently running automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeWorkflows.map((workflow) => (
              <div 
                key={workflow.id} 
                className="p-4 bg-n8n-header rounded-lg border border-n8n-node-border hover:border-n8n-node-border/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-n8n-node-bg rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-n8n-success" />
                  </div>
                  <Badge className="bg-n8n-success text-white text-xs">
                    Active
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-n8n-sidebar-foreground">{workflow.name}</h3>
                  <p className="text-sm text-n8n-sidebar-foreground/60 line-clamp-2">
                    {workflow.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-n8n-sidebar-foreground/60">
                    <Clock className="h-3 w-3" />
                    <span>{workflow.executions} runs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-n8n-sidebar-foreground text-base">
              <Server className="h-4 w-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-n8n-success rounded-full"></div>
              <span className="text-sm text-n8n-sidebar-foreground">All systems operational</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-n8n-sidebar-foreground text-base">
              <Activity className="h-4 w-4" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-n8n-success rounded-full"></div>
              <span className="text-sm text-n8n-sidebar-foreground">0 jobs in queue</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-n8n-sidebar-foreground text-base">
              <Calendar className="h-4 w-4" />
              Last Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-n8n-success rounded-full"></div>
              <span className="text-sm text-n8n-sidebar-foreground">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}