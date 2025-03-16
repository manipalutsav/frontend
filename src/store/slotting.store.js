import create from 'zustand';
import request from '../utils/request.js';
import { toast } from '../actions/toastActions.js';

const useSlottingStore = create((set) => ({
  eventDetails: [],
  isLoading: false,
  error: null,
  
  // Asynchronous action to fetch registered events using the college name as payload
  fetchRegisteredEvents: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await request("/slotting/getRegisteredEvents", "POST", payload);
      // Now we use response.eventDetails since the API returns a top-level eventDetails key
      if (response && response.status === 200) {
        set({ eventDetails: response.eventDetails, isLoading: false });
      } else {
        if (response && response.status === 401) {
          toast("Your session has expired, please logout and login again.");
        }else if(response&&response.status===404){
          toast(response.message);
        }
        set({ isLoading: false, error: "Failed to fetch registered events" });
      }
    } catch (error) {
      toast(error.message);
      set({ isLoading: false, error: error.message });
    }
  },
  slotCollegeById: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await request("/slotting/generateSlots", "POST", payload);
      if (response && response.status === 200) {
        set({ isLoading: false });
        toast(response.message);
      }else if(response&&response.status===309){
        set({ isLoading: false });
        toast(response.message);
      } else {
        if (response && response.status === 401) {
          toast("Your session has expired, please logout and login again.");
        }else if(response&&response.status===404){
          toast(response.message);
        }
        set({ isLoading: false});
        toast(response.message);
      }
    } catch (error) {
      toast(error.message);
      set({ isLoading: false, error: error.message });
    }
  },
}));


export default useSlottingStore;
