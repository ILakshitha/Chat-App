import {create} from 'zustand';
import {toast} from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';


export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUserSelected: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get('messages/users');
            set({users: res.data});

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');

        }finally {
            set({isUsersLoading: false});
        }
    },
    getMessages: async (userId) =>{
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`messages/${userId}`);
            set({messages: res.data});            // console.log(res.data, 'Messages fetched successfully');

            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch messages');
            
        }finally{
            set({isMessagesLoading: false});
        }
    },
    sendMessage: async(messageData)=>{
        const{selectedUser,messages} = get();
        try {
            const res = await axiosInstance.post(`messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');          
        }
    },

    //after i will optimized this function
    setSelectedUser: (selectedUser) => set({selectedUser}),

    subscribeToMessages: ()=>{
        const{selectedUser} = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        //optimize this one leater
        socket.on("newMessage", (message) => {
            if( message.senderId !== selectedUser._id && message.receiverId !== selectedUser._id) return;
            set((state) => ({
                //check as get()
                messages: [...state.messages, message]
            }));
        })

    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },


}));