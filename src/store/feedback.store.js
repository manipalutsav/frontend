import create from 'zustand';
import request from '../utils/request.js';
import { toast } from '../actions/toastActions.js';

const useFeedbackStore = create((set)=>({
    feedback: [],
    isLoading: false,
    error:null,
    createFeedback: async(payload) => {
        set({ isLoading: true, error: null });
        try{
            const response = await request("/feedback", "POST", payload);
            if(response && response.status === 200){
                set({ isLoading: false, feedback: response.data });
                toast(response.message+" ✅");
            }else if(response && response.status === 401){
                toast("Your session has expired, please logout and login again.");
            }else if(response && response.status === 400){
                toast(response.message);   
            }else{
                set({ isLoading: false, error: "Failed to create feedback" });
            }
        }catch(error){
            toast(error.message);
            set({ isLoading: false, error: error.message });
        }
    },
    getFeedbackByEventId: async(event)=>{
        set({ isLoading: true, error: null });
        try{
            const response = await request(`/feedback/getFeedback`, "POST", event);
            if(response && response.status === 200){
                set({ isLoading: false, feedback: response.data });
                return response.data
            }else if(response && response.status === 401){
                toast("Your session has expired, please logout and login again.");
            }else if(response && response.status === 404){
                toast(response.message);
            }else{
                set({ isLoading: false, error: "Failed to fetch feedback" });
            }
        }catch(error){
            toast(error.message);
            set({ isLoading: false, error: error.message });
        }
    }
}))

export default useFeedbackStore