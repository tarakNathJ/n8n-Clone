import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext';



const AUTH_KEY = 'auth_token';
const USER_KEY = 'user_info';
const WORKFLOW_ID = "work_flow_id";
const totalWorkflow = "totalWorkflow"

export interface StapeDataType {
    name: String,
    index: String,
    type: String,
    app: String,
    metadata: JSON,

}




export class WorkFlowService {
    static createWorkFlow(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
               const email = localStorage.getItem("email");
                if (!email) {
                    return reject("email not found")
                }
                const responce: any = await axios.post(`${import.meta.env.VITE_WORKFLOW_BACKEND}/CreateWorkFlow`, {
                    name: `${email + new Date()}`,
                    email: email,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                localStorage.setItem(WORKFLOW_ID, `${responce.data.data.id}`);
                
                if (responce.data.success == true) {
                    resolve(responce.data);
                } else {
                    reject(responce.data)
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    static getWorkFlow(): Promise<void> {
        return new Promise(async (resolve, reject) => {


            try {
               
                const email = localStorage.getItem("email");
                
                if (!email) return reject("email not found");

                


                const responce: any = await axios.post(`${import.meta.env.VITE_WORKFLOW_BACKEND}/getAllworkFlow`, {
                    email: email,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                localStorage.setItem(totalWorkflow,JSON.stringify(responce.data.data));

                if (responce.data.success) {
                    resolve(responce.data.data);
                } else {
                    reject(responce.data);
                }


            } catch (error) {
                reject(error);
            }
        })
    }
    static CreateStapes(data: StapeDataType): Promise<void> {

        return new Promise(async (resolve, reject) => {
            try {

                const { user } = useAuth();
                const email :String = user?.email;
                const workFlowId : Number =parseInt(localStorage.getItem(WORKFLOW_ID));

                if (!email || !workFlowId) {
                    return reject("email not found")
                }
                const responce: any = await axios.post(`${import.meta.env.VITE_WORKFLOW_BACKEND}/createSteps`, {
                    name:data.name,
                    email:email,
                    index:data.index,
                    type:data.type,
                    app:data.app,
                    metadata:data.metadata,
                    workflowId:workFlowId
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                if(responce.data.success == true) {
                    resolve(responce.data.data);
                }else{
                    reject("error on create stapes")
                }


            } catch (error) {
                reject(error)
            }

        })

    }
}