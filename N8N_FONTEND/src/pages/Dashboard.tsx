import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight,
  Workflow,
  Calendar,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  mockWorkspaceStats,
  mockWorkflows,
  mockExecutions,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/contexts/WorkFlowContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
interface responce {
  data: any;
  message: String;
  success: Boolean;
}

export default function Dashboard() {
  const countWorkflow = "countWorkflow";
  const totalStaps = "totalStaps";
  const totalStapsRun = "totalStapsRun";
  const totalTriggers = "totalTriggers";
  const navigate = useNavigate();
  const totalWorkflow = "totalWorkflow";
  const stats = mockWorkspaceStats;
  const recentWorkflows = mockWorkflows.slice(0, 3);
  const recentExecutions = mockExecutions.slice(0, 5);
  const [curentWorkFlow, setWorkFlow] = useState({});
  const { getWorkFlow, createWorkFlow } = useWorkflow();
  const { toast } = useToast();
  useEffect(() => {
    (async () => {
      try {
        const data = await getWorkFlow();
        const datas = await localStorage.getItem(totalWorkflow);
        console.log("size of data ,", JSON.parse(datas).length);
        setWorkFlow(JSON.parse(datas));
        console.log("total work flow  ", curentWorkFlow, "data ", data);

        toast({
          title: "Success",
          description: "successfully",
        });
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {};
  }, []);

  useEffect(() => {}, []);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-n8n-success text-white";
      case "error":
        return "bg-n8n-error text-white";
      case "running":
        return "bg-n8n-warning text-white";
      case "waiting":
        return "bg-n8n-sidebar text-n8n-sidebar-foreground";
      case "active":
        return "bg-n8n-success text-white";
      case "inactive":
        return "bg-n8n-sidebar text-n8n-sidebar-foreground";
      default:
        return "bg-n8n-sidebar text-n8n-sidebar-foreground";
    }
  };

  const createNewWorkflow = async () => {
    try {
      const request: responce = await createWorkFlow();
      console.log("this is your work flow", request);
      if (request?.success == true) {
        console.log("data are come");
        navigate("/workflows/editor");
      }
    } catch (error) {
      toast({
        title: "error  workflow creating time ",
        description: error,
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-n8n-canvas min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-n8n-canvas-foreground">
            Overview
          </h1>
          <p className="text-n8n-canvas-foreground/70 mt-1">
            All the workflows, credentials and executions you have access to
          </p>
        </div>
        
          <Button onClick={createNewWorkflow} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
       
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-n8n-sidebar-foreground">
              workflows
            </CardTitle>
            <Activity className="h-4 w-4 text-n8n-sidebar-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-n8n-sidebar-foreground">
              {sessionStorage.getItem(countWorkflow) || 0}
            </div>
            <p className="text-xs text-n8n-sidebar-foreground/60">
              active workflow
            </p>
          </CardContent>
        </Card>

        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-n8n-sidebar-foreground">
              total trigger
            </CardTitle>
            <XCircle className="h-4 w-4 text-n8n-sidebar-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-n8n-sidebar-foreground">
              {sessionStorage.getItem(totalTriggers) || 0}
            </div>
            <p className="text-xs text-n8n-sidebar-foreground/60">
              active trigger
            </p>
          </CardContent>
        </Card>

        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-n8n-sidebar-foreground">
              Workflow Execution Utilization
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-n8n-sidebar-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-n8n-sidebar-foreground">
              {sessionStorage.getItem(totalStapsRun) || 0}
              
            </div>
            <p className="text-xs text-n8n-sidebar-foreground/60">
              how many time execute this your workflow
            </p>
          </CardContent>
        </Card>

        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-n8n-sidebar-foreground">
              total nodes
            </CardTitle>
            <Clock className="h-4 w-4 text-n8n-sidebar-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-n8n-sidebar-foreground">
              {sessionStorage.getItem(totalStaps) || 0}
            </div>
            <p className="text-xs text-n8n-sidebar-foreground/60">
              all active nodes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workflows */}
        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-n8n-sidebar-foreground">
                Recent Workflows
              </CardTitle>
              <Link to="/workflows">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-n8n-sidebar-foreground/60"
                >
                  View all
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {JSON.parse(sessionStorage.getItem(totalWorkflow))?.map(
              (workflow, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-n8n-header"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-n8n-node-bg rounded-lg flex items-center justify-center">
                      <Workflow className="h-5 w-5 text-n8n-sidebar-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-n8n-sidebar-foreground">
                        {workflow.name}
                      </div>
                      <div className="text-sm text-n8n-sidebar-foreground/60">
                        Last updated {formatDate(workflow.updatedAt)}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={cn("text-xs", getStatusColor(workflow.status))}
                  >
                    {workflow.status}
                  </Badge>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Recent Executions */}
        <Card className="bg-n8n-sidebar border-n8n-node-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-n8n-sidebar-foreground">
                Recent Activity
              </CardTitle>
              <Link to="/executions">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-n8n-sidebar-foreground/60"
                >
                  View all
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentExecutions.map((execution) => {
              const workflow = mockWorkflows.find(
                (w) => w.id === execution.workflowId
              );
              return (
                <div
                  key={execution.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-n8n-header"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        execution.status === "success"
                          ? "bg-n8n-success"
                          : execution.status === "error"
                          ? "bg-n8n-error"
                          : execution.status === "running"
                          ? "bg-n8n-warning animate-pulse"
                          : "bg-n8n-sidebar"
                      )}
                    />
                    <div>
                      <div className="font-medium text-n8n-sidebar-foreground">
                        {workflow?.name || "Unknown Workflow"}
                      </div>
                      <div className="text-sm text-n8n-sidebar-foreground/60">
                        {formatDate(execution.startTime)} • {execution.mode}
                        {execution.duration &&
                          ` • ${formatDuration(execution.duration)}`}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={cn("text-xs", getStatusColor(execution.status))}
                  >
                    {execution.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {/* <Card className="bg-n8n-sidebar border-n8n-node-border">
        <CardHeader>
          <CardTitle className="text-n8n-sidebar-foreground">Quick Actions</CardTitle>
          <CardDescription className="text-n8n-sidebar-foreground/60">
            Get started with common tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/workflows/new">
            <Button variant="outline" className="w-full h-20 flex-col gap-2 border-n8n-node-border hover:bg-n8n-header">
              <Plus className="h-6 w-6" />
              <span>Create Workflow</span>
            </Button>
          </Link>
          
          <Link to="/templates">
            <Button variant="outline" className="w-full h-20 flex-col gap-2 border-n8n-node-border hover:bg-n8n-header">
              <Calendar className="h-6 w-6" />
              <span>Browse Templates</span>
            </Button>
          </Link>
          
          <Link to="/users">
            <Button variant="outline" className="w-full h-20 flex-col gap-2 border-n8n-node-border hover:bg-n8n-header">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
          </Link>
        </CardContent>
      </Card> */}
    </div>
  );
}
