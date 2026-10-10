import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    // Remove /api suffix for socket connection
    return import.meta.env.VITE_API_URL.replace(/\/api$/, "");
  }
  return import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
};

const BASE_URL = getBaseUrl();

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Unable to connect to server. Please check your connection."
          : "Something went wrong. Please try again.");
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Unable to connect to server. Please check your connection."
          : "Something went wrong. Please try again.");
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to logout. Please try again.";
      toast.error(message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      const message =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // Subscribe to call events after socket is connected
    // Dynamic import to avoid circular dependency
    import("./useCallStore.js").then(({ useCallStore }) => {
      useCallStore.getState().subscribeToCallEvents();
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      // Unsubscribe from call events before disconnecting
      import("./useCallStore.js").then(({ useCallStore }) => {
        useCallStore.getState().unsubscribeFromCallEvents();
      }).catch(() => {});
      get().socket.disconnect();
    }
  },
}));
