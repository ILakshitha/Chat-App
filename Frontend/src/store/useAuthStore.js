import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" :"/"; // Adjust this to your server URL

export const useAuthStore = create((set, get) => ({
    user: null,
    isLoggedIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ user: res.data });
            get().connectSocket(); // Connect to socket after checking auth
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ user: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) =>{
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ user: res.data });
            toast.success("Account created successfully");
            get().connectSocket(); // Connect to socket after signup
        } catch (error) {
            toast.error(error.response.data.message);
        }finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null });
            toast.success("Logged out successfully");
            get().disconnectSocket(); // Disconnect socket on logout
        } catch (error) {
            toast.error(error.response.message);
        } finally {
            set({ isLoggingOut: false });
        }
    },

    login: async (data) => {
        set({ isLoggedIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ user: res.data });
            toast.success("Logged in successfully");

            get().connectSocket(); // Connect to socket after login
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggedIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ user: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

    connectSocket: () => {

        const {user} = get();
        if (!user || get().socket?.connected) {
            console.log("User not authenticated, not connecting to socket");
            return;
        }

        const socket = io(BASE_URL, {
            query: {
                userId: user._id, // Pass user ID as a query parameter
            },
            transports: ["websocket"],
            withCredentials: true,
        });
        socket.connect();

        set({ socket: socket });     

        socket.on("onlineUsers", (userId)=>{
            set({onlineUsers: userId});

        });
    
    },

    disconnectSocket: () => {
        if(get().socket?.connected) {
            get().socket.disconnect();
            console.log("Socket disconnected");
        }

    }
}
));