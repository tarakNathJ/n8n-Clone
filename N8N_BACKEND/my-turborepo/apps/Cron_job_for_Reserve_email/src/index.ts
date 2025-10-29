import cron from "node-cron";

import { fetchALlSendEmailValidator, processExecutionMainFunction } from "./Component/executionFile.js";

type Metadata = {
  EMAIL: String;
  PASSWORD: String;
};

type stapesObject = {
  workflowId: number;
  metadata: Metadata;
  createdAt: Date;
  index: number
};
// Run every 10 minutes, all day long
const task = cron.schedule(
  "* * * * *",
  async () => {
    await executionHandeler();
    console.log("call connect");
  },
  { scheduled: false } as any
);

async function executionHandeler() {
  try {
    task.stop();
    const ArrayOfObject : stapesObject[] |any = await processExecutionMainFunction();
    if (ArrayOfObject instanceof Array){
      const  executefunction  = await fetchALlSendEmailValidator(ArrayOfObject);
      console.log( "this function execution complete ",executefunction)
    }
    

   

    task.start();
    return true
  } catch (error :any) {
    console.error("❌ Error in checkAutoWorker:", error.message);
    task.destroy();
  }
}

console.log("cron job run ");
task.start();
