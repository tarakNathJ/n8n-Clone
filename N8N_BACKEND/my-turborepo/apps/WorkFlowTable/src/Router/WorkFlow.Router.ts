import express from "express";
import {
  createWorkFlow,
  getAllWorkFlow,
  createStaps,
  HookCall,
} from "../Controller/WorkFlow.Controller.js";

const Router = express.Router();

Router.post("/CreateWorkFlow", createWorkFlow);
// Router.post("/getAllWorkFlow", getAllWorkFlow);
Router.post("/createSteps", createStaps);
Router.post("/hooks/:userId/:workFlowID", HookCall);
Router.post("/getAllWorkFlow", getAllWorkFlow);


export default Router;
