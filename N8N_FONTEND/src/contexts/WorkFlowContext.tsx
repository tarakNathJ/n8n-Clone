import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StapeDataType, WorkFlowService } from '@/lib/workFlows'


interface WorkflowContextTypeinterface {

    isLoading: boolean;
    createWorkFlow: () => Promise<any>;
    getWorkFlow: () => Promise<any>;
    CreateStapes: (data: StapeDataType) =>Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextTypeinterface | undefined>(undefined);

interface workflowProviderProps {
    children: ReactNode;
}

export function WorkflowProvider({ children }: workflowProviderProps) {

    const [isLoading, setIsLoading] = useState(true);

    const createWorkFlow = async () => {

        setIsLoading(true);
        let data:any = {};
        try {
            const user = await WorkFlowService.createWorkFlow();
            data = user;
        } finally {
            setIsLoading(false);
            return data;
        }
    }


    const getWorkFlow = async () => {

        console.log("request are comming");

        setIsLoading(true);
        let result :any = {} ;
        try {
            const user = await WorkFlowService.getWorkFlow();
           
            result =  user
        } finally {
            setIsLoading(false);
            return result;
        }
    }

    const CreateStapes = async (data:StapeDataType) => {

        setIsLoading(true);
        try {
            const user = await WorkFlowService.CreateStapes(data);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <WorkflowContext.Provider value={{ isLoading ,createWorkFlow , getWorkFlow ,CreateStapes }} >
            {children}
        </WorkflowContext.Provider>

    )

}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error(' must be used within an workflow provider');
  }
  return context;
}