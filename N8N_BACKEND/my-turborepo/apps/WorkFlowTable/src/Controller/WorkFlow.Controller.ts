// import { prisma } from "@myorg/database";

import type { Request, Response } from "express";
import { config } from "dotenv";
import { prisma } from "@myorg/database";
config();

export const createWorkFlow = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "full fill  all required filed",
      });
    }
    const findUserAreExitOrNot = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!findUserAreExitOrNot) {
      return res.status(400).json({
        success: false,
        message: "this User are not exit ",
      });
    }

    const findWorkflowAreExistOrNot = await prisma.workFlow.findUnique({
      where: { name: name },
    });

    if (findWorkflowAreExistOrNot) {
      return res.status(400).json({
        success: false,
        message: "this name all ready exit ",
      });
    }

    const CreateWorkFlow = await prisma.workFlow.create({
      data: {
        name: name,
        createAt: new Date(),
        userId: findUserAreExitOrNot.id,
      },
    });

    if (!CreateWorkFlow) {
      return res.status(400).json({
        success: false,
        message: "server are very  busy",
      });
    }

    return res.status(200).json({
      success: true,
      message: "success fully create wark flow",
      data: {
        name: CreateWorkFlow.name,
        id: CreateWorkFlow.id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      meassage: "samthing error on create workflow controller",
    });
  }
};

export const getAllWorkFlow = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "full fill  all required filed",
      });
    }

    // Step 1: Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Step 2: Find all workflows for that user, including first step (index = 0 or 1)
    const workflows = await prisma.workFlow.findMany({
      where: { userId: user.id },
      select: {
        name: true, // only workflow name
        createAt: true,

        Staps: {
          where: { index: 0 }, // only first step
          take: 1,
          select: {
            name: true,
            metadata: true, // only metadata from first step
          },
        },
      },
    });

    if (!workflows.length) {
      return res.status(404).json({
        success: false,
        message: "No workflows found for this user",
      });
    }

    // step 3 : fine  all workflow and  stapes and all stapes run and

    const users = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        workFlows: {
          include: {
            Staps: true,
            stapsRuns: true,
          },
        },
      },
    });

    if (!users) {
      throw new Error("User not found");
    }

    // Count Workflows
    const totalWorkflows = users.workFlows.length;

    // Count total Staps across all workflows
    const totalStaps = users.workFlows.reduce(
      (sum, wf) => sum + wf.Staps.length,
      0
    );

    // Count total executed StapsRun
    const totalStapsRun = users.workFlows.reduce(
      (sum, wf) => sum + wf.stapsRuns.length,
      0
    );

    // Count how many Staps are triggers
    const totalTriggers = users.workFlows.reduce(
      (sum, wf) => sum + wf.Staps.filter((s) => s.type === "TRIGGER").length,
      0
    );

    return res.status(200).json({
      success: true,
      meassage: "success fully fetch all data",
      data: workflows,
      totalWorkflows,
      totalStaps,
      totalStapsRun,
      totalTriggers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      meassage: "samthing error on get workflow controller",
    });
  }
};

export const createStaps = async (req: Request, res: Response) => {
  try {
    const { email, workflowId, batchOfdata } = req.body;
    if (!email || !workflowId) {
      return res.status(400).json({
        success: false,
        message: "full fill  all required filed",
      });
    }

    console.log("stage 1 ...................")
    if (batchOfdata.length == 0) {
      return res.status(400).json({
        success: false,
        message: "invalid data",
      });
    }
    console.log("stage 1 ...................")

    const findUserAreExitOrNot = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!findUserAreExitOrNot) {
      return res.status(400).json({
        success: false,
        message: "this User are not exit ",
      });
    }

    const findWorkFlowAreExitOrNot = await prisma.workFlow.findUnique({
      where: {
        id: workflowId,
      },
    });

    if (!findWorkFlowAreExitOrNot) {
      return res.status(400).json({
        success: false,
        message: "this work flow are not exit ",
        findUserAreExitOrNot,
      });
    }

    const chakstapsAreExistOrNot = await prisma.staps.findFirst({
      where: {
        workflowId: findWorkFlowAreExitOrNot.id,
        userId: findUserAreExitOrNot.id,
      },
      select: { id: true },
    });
    if (chakstapsAreExistOrNot) {
      return res.status(400).json({
        success: false,
        message: "workflow all ready exist",
      });
    }

    batchOfdata.map((_stapes: any) => {
      if (_stapes.app == "WEBHOOK") {
        _stapes.metadata.URL = `${process.env.WEB_HOOK_URL}/${findUserAreExitOrNot.id}/${findWorkFlowAreExitOrNot.id}`;
      }

      _stapes.userId = findUserAreExitOrNot.id;
      _stapes.createdAt = new Date();
      _stapes.workflowId = findWorkFlowAreExitOrNot.id;
    });

    console.log(batchOfdata);
    const StoreData = await prisma.staps.createMany({
      data: batchOfdata,
    });

    // const storeData = await prisma.staps.createMany({
    //   data: batchOfdata.map((_stapes: any, idx: number) => ({
    //     name: _stapes.name,
    //     userId: findUserAreExitOrNot.id,
    //     index: parseInt(_stapes.index ?? idx),
    //     type: _stapes.type,
    //     app: _stapes.app,
    //     typeOfWork:_stapes.typeOfWork,
    //     metadata: {
    //       ..._stapes.metadata,
    //       ...(_stapes.app === "WEBHOOK" && {
    //         URL: `${process.env.WEB_HOOK_URL}/${findUserAreExitOrNot.id}/${findWorkFlowAreExitOrNot.id}`,
    //       }),
    //     },
    //     status:_stapes.status,
    //     createdAt: new Date(),
    //     workflowId: findWorkFlowAreExitOrNot.id,
    //   })),
    //   skipDuplicates: false,
    // });

    return res.status(200).json({
      success: true,
      message: "your staps are create",
      data: StoreData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      meassage: "getAllWorkFlow",
    });
  }
};

export const HookCall = async (req: Request, res: Response) => {
  try {
    const { userId, workFlowID } = req.params;

    console.log(userId, workFlowID);
    const body = req.body;

    const findWorkFlow = await prisma.workFlow.findUnique({
      where: {
        id: Number(workFlowID),
      },
    });

    if (!findWorkFlow) {
      return res.status(400).json({
        success: false,
        message: "work flow are messing",
      });
    }

    if (!userId || !workFlowID) {
      return res.status(400).json({
        success: false,
        message: "messing Data",
      });
    }

    // console.log(ts)
    const storeData = await prisma.stapsRun.create({
      data: {
        WorkFlowId: findWorkFlow.id,
        metaData: body,
        Workstatus: "CREATE",
        createdAt: new Date(),
      },
    });

    const addRecord = await prisma.outBoxStapsRun.create({
      data: {
        StapsRunId: storeData.id,

        createdAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "webHook  Data reseve",
      storeData,
      addRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      meassage: " server side error on   HookCall  controller",
    });
  }
};

export const curentExecutingWork = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "full fill  all required filed",
      });
    }

    // Step 1: Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const getAllCurentWork = await prisma.staps.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        name: true,
        type: true,
        typeOfWork: true,
        createdAt: true,
      },
    });

    if (!getAllCurentWork.length) {
      return res.status(404).json({
        success: false,
        message: "No staps  found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "that's your all data",
      getAllCurentWork,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      meassage: " server side error on  curent Executing Work",
    });
  }
};

/**const recentRuns = await prisma.stapsRun.findMany({
  where: {
    workFlow: {
      userId: 1,
    },
  },
  orderBy: { createdAt: "desc" },
  take: 5,
  select: {
    id: true,
    metaData: true,
    Workstatus: true,
    createdAt: true,
    workFlow: {
      select: { id: true, name: true },
    },
  },
});
 */
