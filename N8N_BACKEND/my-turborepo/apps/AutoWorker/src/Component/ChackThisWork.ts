import { prisma } from "@myorg/database";


export async function checkThisWorkUnder24Hours(Stapid:number): Promise<boolean | Number> {
  const latestCreateWork = await prisma.autoWorkerValidate.findFirst({
    where:{
        Stapid:Stapid
    },
    orderBy: {
      curentTime: "desc",
    },
  });

  
  if (!latestCreateWork) {
    return true;
  }

  const now = new Date();
  const diffMs = now.getTime() - latestCreateWork.curentTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60); 

  if (diffHours < 24) {
    
    return false; 
  }

  // ✅ More than 24 hours passed
  return diffHours - 24;
}
