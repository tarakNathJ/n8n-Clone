import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Play,
  ArrowLeft,
  Share2,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockNodeTypes, mockWorkflows } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import CustomNode from "@/components/workflow/CustomNode";
import NodePalette from "@/components/workflow/NodePalette";
import axios from "axios";

const nodeTypes = {
  custom: CustomNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [telegramData, setTelegramData] = useState({
    CHAT_ID: "",
    TOKEN: "",
  });
  const [emailData, setEmailData] = useState({
    EMAIL: "",
    PASSWORD: "",
    MESSAGE: "",
  });
  const [reseveEmail, setReseveEmail] = useState({
    EMAIL: "",
    PASSWORD: "",
    TIME:"DAY"
  });
  const [HTTP_Method, setHttpMethod] = useState("POST");

  const [workflowName, setWorkflowName] = useState(
    id
      ? mockWorkflows.find((w) => w.id === id)?.name || "Untitled Workflow"
      : "New Workflow"
  );

  const initialNodes: Node[] = [];

  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: { stroke: "hsl(var(--workflow-connection))" },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type || !reactFlowBounds) return;

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeTypeData = mockNodeTypes.find((nt) => nt.id === type);
      const newNode: Node = {
        id: getId(),
        type: "custom",
        position,
        data: {
          name: nodeTypeData?.name || "New Node",
          category: nodeTypeData?.category || "New catagory",
          type: type,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleExecute = () => {
    toast({
      title: "Workflow Executed",
      description: `"${workflowName}" is now running.`,
    });
  };

  // --- ADDED: Delete Node handler
  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setSelectedNode(null);

    toast({
      title: "Node Deleted",
      description: `"${selectedNode.data.name}" was removed from the workflow.`,
      variant: "destructive",
    });
  }, [selectedNode, setNodes, setEdges, setSelectedNode, toast]);

  // --- ADDED: keyboard support (Delete / Backspace)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNode) {
        handleDeleteNode();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedNode, handleDeleteNode]);

  // save data (api request for backend)
  // const handleSave = async () => {
  //   const USER_KEY = "user_info";
  //   const WORKFLOW_ID = "work_flow_id";
  //   const userObj = JSON.parse(localStorage.getItem(USER_KEY));
  //   const workflowId = JSON.parse(localStorage.getItem(WORKFLOW_ID));

  //   const createArray = [];

  //   nodes.map((data, index) => {
  //     if (data.data.name == "WebHook") {
  //       const Obj = {
  //         name: "WEBHOOK",
  //         index: index,
  //         type: data.data.category.toUpperCase(),
  //         app: "WEBHOOK",
  //         metadata: {
  //           HTTP_Method: HTTP_Method,
  //         },
  //       };
  //       createArray.push(Obj);
  //     } else if (data.data.name == "Send Email") {
  //       const Obj = {
  //         name: "GMAIL",
  //         index: index,
  //         type: data.data.category.toUpperCase(),
  //         app: "GMAIL",
  //         metadata: emailData,
  //       };
  //       createArray.push(Obj);
  //     } else if (data.data.name == "Telegram") {
  //       const Obj = {
  //         name: "TELEGRAM",
  //         index: index,
  //         type: data.data.category.toUpperCase(),
  //         app: "TELEGRAM",
  //         metadata: telegramData,
  //       };
  //       createArray.push(Obj);
  //     } else if (data.data.name == "RESEVE_EMAIL") {
  //       const Obj = {
  //         name: "RESEVE_EMAIL",
  //         index: index,
  //         type: data.data.category.toUpperCase(),
  //         app: "RESEVE_EMAIL",
  //         metadata: telegramData,
  //       };
  //       createArray.push(Obj);
  //     }
  //   });

  //   try {

  //     // console.log(nodes , edges);
  //     // const responce: any = await axios.post(
  //     //   `${import.meta.env.VITE_WORKFLOW_BACKEND}/createSteps`,
  //     //   {
  //     //     email: userObj.email,
  //     //     workflowId: workflowId,
  //     //     batchOfdata: createArray,
  //     //   },
  //     //   {
  //     //     headers: {
  //     //       "Content-Type": "application/json",
  //     //     },
  //     //   }
  //     // );

  //     // if (responce.data.success == true) {
  //     //   toast({
  //     //     title: " Workflow Saved ",
  //     //     description: `"${workflowName}" success fully save workflow.`,
  //     //   });
  //     // }
  //     console.log(createArray);
  //   } catch (error) {
  //     toast({
  //       title: " Workflow Saved failed",
  //       description: `"${workflowName}" has been saved failed.`,
  //     });
  //   }
  // };

  const handleSave = async () => {
    const USER_KEY = "user_info";
    const WORKFLOW_ID = "work_flow_id";
    const userObj = JSON.parse(localStorage.getItem(USER_KEY));
    const workflowId = JSON.parse(sessionStorage.getItem(WORKFLOW_ID));

    // --- Step 1: Find the start node (the one with no incoming edges)
    const startNode = nodes.find((n) => !edges.some((e) => e.target === n.id));

    // --- Step 2: Build ordered nodes by following edges
    const orderedNodes = [];
    let current = startNode;

    while (current) {
      orderedNodes.push(current);
      const nextEdge = edges.find((e) => e.source === current.id);
      current = nextEdge ? nodes.find((n) => n.id === nextEdge.target) : null;
    }

    // --- Step 3: Fallback if ordering fails (use normal nodes)
    const finalNodes = orderedNodes.length ? orderedNodes : nodes;

    const createArray = finalNodes.map((data, index) => {
      let Obj = {
        name: data.data.name.toUpperCase(),
        index,
        type: data.data.category.toUpperCase(),
        app: data.data.name.toUpperCase(),
        typeOfWork: "",
        metadata: {},
        status: "",
      };

      if (data.data.name === "WebHook") {
        Obj.metadata = { HTTP_Method };
        Obj.typeOfWork = "NORMAL";
        Obj.status = "ACTIVE";
      } else if (data.data.name === "Send Email") {
        Obj.name = Obj.app = "GMAIL";
        Obj.typeOfWork = "NORMAL";
        Obj.metadata = emailData;
        Obj.status = "ACTIVE";
      } else if (data.data.name === "Telegram") {
        Obj.name = Obj.app = "TELEGRAM";
        Obj.metadata = telegramData;
        Obj.typeOfWork = "NORMAL";
        Obj.status = "ACTIVE";
      } else if (data.data.name === "Reseve Email") {
        Obj.name = Obj.app = "RESEVE_EMAIL";
        Obj.metadata = reseveEmail;
        Obj.typeOfWork = "AUTOMATIC";
        Obj.status = "ACTIVE";
      }

      return Obj;
    });

    console.log("✅ Ordered workflow steps:", workflowId, createArray);

    

    try {
     
      const responce: any = await axios.post(
        `${import.meta.env.VITE_WORKFLOW_BACKEND}/createSteps`,
        {
          email: userObj.email,
          workflowId: workflowId,
          batchOfdata: createArray,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(responce);

      if (responce.data.success == true) {
        toast({
          title: " Workflow Saved ",
          description: `"${workflowName}" success fully save workflow.`,
        });
      }
      console.log(createArray);
    } catch (error) {
      toast({
        title: " Workflow Saved failed",
        description: `"${workflowName}" has been saved failed.`,
      });
    }
  };

  //save telegram Data

  const OnchangeHandelerTelegram = (event) => {
    const { name, value } = event.target;
    setTelegramData({
      ...telegramData,
      [name]: value,
    });
  };
  const TelegramData = async () => {
    console.log(telegramData);
  };

  const ReseveEmails = async () => {
    console.log(reseveEmail);
  };

  // save email data
  const OnchangeHandelerEmail = (event) => {
    const { name, value } = event.target;
    setEmailData({
      ...emailData,
      [name]: value,
    });
  };
  const emailDatas = async () => {
    console.log(emailData);
  };

  // save webhook data
  const webhookData = async () => {
    console.log(HTTP_Method);
  };

  // save reseve email data
  const OnchangeHandelReseveEmail = async (event) => {
    const { name, value } = event.target;
    setReseveEmail({
      ...reseveEmail,
      [name]: value,
    });
  };

  return (
    <div className="flex h-screen bg-n8n-canvas ">
      {/* Left Sidebar - Node Palette */}
      <div className="w-80 bg-n8n-sidebar border-r border-n8n-node-border flex flex-col">
        <div className="p-4 border-b border-n8n-node-border">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/workflows")}
              className="text-n8n-sidebar-foreground hover:bg-n8n-header"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-n8n-sidebar-foreground/60">
              Back to workflows
            </span>
          </div>
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground font-medium"
          />
        </div>

        <div className="flex-1 overflow-auto p-4">
          <NodePalette onNodeDragStart={onNodeDragStart} />
        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="flex items-center justify-between p-4 bg-n8n-header border-b border-n8n-node-border">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-n8n-node-border text-n8n-sidebar-foreground"
            >
              Inactive
            </Badge>
            <Tabs value="editor" className="w-auto">
              <TabsList className="bg-n8n-sidebar border-n8n-node-border">
                <TabsTrigger
                  value="editor"
                  className="text-n8n-sidebar-foreground data-[state=active]:bg-n8n-header"
                >
                  Editor
                </TabsTrigger>
                <TabsTrigger
                  value="executions"
                  className="text-n8n-sidebar-foreground data-[state=active]:bg-n8n-header"
                >
                  Executions
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-n8n-node-border text-n8n-sidebar-foreground hover:bg-n8n-sidebar"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="border-n8n-node-border text-n8n-sidebar-foreground hover:bg-n8n-sidebar"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              size="sm"
              onClick={handleExecute}
              className="bg-primary hover:bg-primary/90"
            >
              <Play className="h-4 w-4 mr-2" />
              Execute workflow
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          className="flex-1 relative overflow-hidden bg-[#070042]  workflow-canvas"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-n8n-canvas"
          >
            <Controls
              className="bg-n8n-sidebar border border-n8n-node-border rounded-lg"
              showInteractive={false}
            />
            <MiniMap
              className="!bg-n8n-sidebar border border-n8n-node-border rounded-lg"
              nodeColor={(node) => {
                const nodeType = mockNodeTypes.find(
                  (nt) => nt.id === node.data.type
                );
                return nodeType?.color || "hsl(var(--primary))";
              }}
            />
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="hsl(var(--n8n-node-border))"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Right Sidebar - Node Inspector */}
      <div className="w-80 bg-n8n-sidebar border-l border-n8n-node-border flex flex-col">
        <div className="p-4 border-b border-n8n-node-border">
          <h3 className="font-semibold text-n8n-sidebar-foreground">
            {selectedNode ? selectedNode.data.name : "No node selected"}
          </h3>
          <p className="text-sm text-n8n-sidebar-foreground/60 mt-1">
            {selectedNode
              ? "Configure node parameters"
              : "Select a node to view configuration"}
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {selectedNode ? (
            <div className="space-y-6">
              <Tabs value="parameters" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-n8n-header border-n8n-node-border">
                  <TabsTrigger
                    value="parameters"
                    className="text-n8n-sidebar-foreground data-[state=active]:bg-n8n-node-bg"
                  >
                    Parameters
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="text-n8n-sidebar-foreground data-[state=active]:bg-n8n-node-bg"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="parameters" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div>
                      {/* <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                        Credential to connect with
                      </label>
                      <select className="w-full p-2 bg-n8n-header border border-n8n-node-border rounded text-n8n-sidebar-foreground">
                        <option>Select Credential</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                        Resource
                      </label>
                      <select className="w-full p-2 bg-n8n-header border border-n8n-node-border rounded text-n8n-sidebar-foreground">
                        <option>Message</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                        Operation
                      </label>
                      <select className="w-full p-2 bg-n8n-header border border-n8n-node-border rounded text-n8n-sidebar-foreground">
                        <option>Send</option>
                      </select>*/}
                    </div>

                    {selectedNode.data.type === "email" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                            email
                          </label>
                          <Input
                            placeholder="info@example.com"
                            onChange={OnchangeHandelerEmail}
                            name="EMAIL"
                            className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                            app Password
                          </label>
                          <Input
                            placeholder="djsv kasj wyet pqwo"
                            name="PASSWORD"
                            onChange={OnchangeHandelerEmail}
                            className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                            message
                          </label>
                          <textarea
                            placeholder="whats app"
                            name="MESSAGE"
                            rows={5}
                            cols={30}
                            onChange={OnchangeHandelerEmail}
                            className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                          ></textarea>
                        </div>

                        <div className="pt-4 border-t  border-n8n-node-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={emailDatas}
                            // onClick={}   // <-- ADDED handler
                            className="w-full border-white text-green-100 bg-[#262e2b]  hover:bg-green-500/20"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            save
                          </Button>
                        </div>
                      </>
                    )}
                    {selectedNode.data.type === "telegram" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                            Token
                          </label>
                          <Input
                            placeholder="telegram token "
                            className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                            name="TOKEN"
                            onChange={OnchangeHandelerTelegram}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                            Chat Id
                          </label>
                          <Input
                            placeholder="  telegram chat  id "
                            onChange={OnchangeHandelerTelegram}
                            name="CHAT_ID"
                            className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                          />
                        </div>
                        <div className="pt-4 border-t  border-n8n-node-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={TelegramData}
                            // onClick={}   // <-- ADDED handler
                            className="w-full border-white text-green-100 bg-[#262e2b]  hover:bg-green-500/20"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            save
                          </Button>
                        </div>
                      </>
                    )}

                    {selectedNode.data.type === "WebHook" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                            HTTP_Method
                          </label>
                          <select
                            onChange={(e) => setHttpMethod(e.target.value)}
                            className="w-full p-2 bg-n8n-header border border-n8n-node-border rounded text-n8n-sidebar-foreground"
                          >
                            <option>POST</option>
                          </select>
                        </div>
                        <div className="pt-4 border-t  border-n8n-node-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={webhookData}
                            // onClick={}   // <-- ADDED handler
                            className="w-full border-white text-green-100 bg-[#262e2b]  hover:bg-green-500/20"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            save
                          </Button>
                        </div>
                      </>
                    )}
                    {selectedNode.data.type === "RESEVE_EMAIL" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                            email
                          </label>
                          <Input
                            placeholder="telegram token "
                            className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                            name="EMAIL"
                            onChange={OnchangeHandelReseveEmail}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                            app password
                          </label>
                          <Input
                            placeholder="  telegram chat  id "
                            onChange={OnchangeHandelReseveEmail}
                            name="PASSWORD"
                            className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                          />
                        </div>
                        <div className="pt-4 border-t  border-n8n-node-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={ReseveEmails}
                            // onClick={}   // <-- ADDED handler
                            className="w-full border-white text-green-100 bg-[#262e2b]  hover:bg-green-500/20"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            save
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* <Card className="bg-n8n-header border-n8n-node-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-n8n-sidebar-foreground">Options</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-n8n-sidebar-foreground/60">No properties</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full border-n8n-node-border hover:bg-n8n-sidebar"
                      >
                        Add option
                      </Button>
                    </CardContent>
                  </Card> */}
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                        Node Name
                      </label>
                      <Input
                        value={selectedNode.data.name}
                        className="bg-n8n-header border-n8n-node-border text-n8n-sidebar-foreground"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-n8n-sidebar-foreground mb-2">
                        Notes
                      </label>
                      <textarea
                        className="w-full p-2 bg-n8n-header border border-n8n-node-border rounded text-n8n-sidebar-foreground resize-none"
                        rows={3}
                        placeholder="Add notes about this node..."
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="pt-4 border-t border-n8n-node-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteNode} // <-- ADDED handler
                  className="w-full border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Node
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-n8n-header rounded-full flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-n8n-sidebar-foreground/60" />
              </div>
              <p className="text-n8n-sidebar-foreground/60">
                Select a node to configure its parameters and settings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkflowEditorWithProvider() {
  return (
    <ReactFlowProvider>
      <WorkflowEditor />
    </ReactFlowProvider>
  );
}
