import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
  ],
};

export const useCallStore = create((set, get) => ({
  // Call state
  callStatus: "idle", // idle | calling | incoming | connected
  callType: null, // "audio" | "video"
  callUser: null, // the user we're in a call with { _id, fullName, profilePic }
  isCaller: false,

  // Media state
  localStream: null,
  remoteStream: null,
  peerConnection: null,

  // UI toggles
  isMuted: false,
  isCameraOff: false,
  callDuration: 0,
  callTimer: null,

  // ─── Initiate a call ──────────────────────────────────────────
  initiateCall: async (user, type) => {
    const { authUser, socket } = useAuthStore.getState();
    if (!socket || get().callStatus !== "idle") return;

    try {
      const constraints = {
        audio: true,
        video: type === "video",
      };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);

      set({
        callStatus: "calling",
        callType: type,
        callUser: user,
        isCaller: true,
        localStream,
        remoteStream: new MediaStream(),
      });

      socket.emit("call:initiate", {
        to: user._id,
        from: authUser._id,
        callerName: authUser.fullName,
        callerPic: authUser.profilePic,
        callType: type,
      });
    } catch (error) {
      console.error("Failed to get media devices:", error);
      get().cleanupCall();
    }
  },

  // ─── Handle incoming call ─────────────────────────────────────
  handleIncomingCall: (data) => {
    if (get().callStatus !== "idle") {
      // Already in a call, send busy
      const { socket } = useAuthStore.getState();
      socket?.emit("call:reject", { to: data.from, from: useAuthStore.getState().authUser._id });
      return;
    }

    set({
      callStatus: "incoming",
      callType: data.callType,
      callUser: {
        _id: data.from,
        fullName: data.callerName,
        profilePic: data.callerPic,
      },
      isCaller: false,
    });
  },

  // ─── Accept incoming call ─────────────────────────────────────
  acceptCall: async () => {
    const { callUser, callType } = get();
    const { authUser, socket } = useAuthStore.getState();
    if (!socket || !callUser) return;

    try {
      const constraints = {
        audio: true,
        video: callType === "video",
      };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);

      set({
        callStatus: "connected",
        localStream,
        remoteStream: new MediaStream(),
      });

      socket.emit("call:accept", {
        to: callUser._id,
        from: authUser._id,
      });

      // Wait for the caller to send the offer
    } catch (error) {
      console.error("Failed to accept call:", error);
      get().rejectCall();
    }
  },

  // ─── Reject incoming call ─────────────────────────────────────
  rejectCall: () => {
    const { callUser } = get();
    const { socket, authUser } = useAuthStore.getState();
    if (socket && callUser) {
      socket.emit("call:reject", {
        to: callUser._id,
        from: authUser._id,
      });
    }
    get().cleanupCall();
  },

  // ─── Create and send WebRTC offer ─────────────────────────────
  createOffer: async () => {
    const { callUser, localStream, remoteStream } = get();
    const { socket } = useAuthStore.getState();
    if (!socket || !callUser || !localStream) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Handle remote tracks
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      set({ remoteStream: remoteStream });
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call:ice-candidate", {
          to: callUser._id,
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        get().endCall();
      }
    };

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call:offer", {
      to: callUser._id,
      offer: pc.localDescription,
    });

    set({ peerConnection: pc });

    // Start call timer
    get().startCallTimer();
  },

  // ─── Handle incoming offer ────────────────────────────────────
  handleOffer: async (data) => {
    const { localStream, remoteStream, callUser } = get();
    const { socket } = useAuthStore.getState();
    if (!socket || !localStream) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Handle remote tracks
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      set({ remoteStream: remoteStream });
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call:ice-candidate", {
          to: data.from,
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        get().endCall();
      }
    };

    // Set remote description and create answer
    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("call:answer", {
      to: data.from,
      answer: pc.localDescription,
    });

    set({ peerConnection: pc, callStatus: "connected" });

    // Start call timer
    get().startCallTimer();
  },

  // ─── Handle incoming answer ───────────────────────────────────
  handleAnswer: async (data) => {
    const { peerConnection } = get();
    if (!peerConnection) return;

    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    set({ callStatus: "connected" });
  },

  // ─── Handle ICE candidate ────────────────────────────────────
  handleIceCandidate: async (data) => {
    const { peerConnection } = get();
    if (!peerConnection) return;

    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  },

  // ─── End call ─────────────────────────────────────────────────
  endCall: () => {
    const { callUser } = get();
    const { socket } = useAuthStore.getState();

    if (socket && callUser) {
      socket.emit("call:end", { to: callUser._id });
    }

    get().cleanupCall();
  },

  // ─── Toggle mute ──────────────────────────────────────────────
  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (!localStream) return;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = isMuted; // toggle
    });
    set({ isMuted: !isMuted });
  },

  // ─── Toggle camera ────────────────────────────────────────────
  toggleCamera: () => {
    const { localStream, isCameraOff } = get();
    if (!localStream) return;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOff; // toggle
    });
    set({ isCameraOff: !isCameraOff });
  },

  // ─── Call timer ───────────────────────────────────────────────
  startCallTimer: () => {
    const timer = setInterval(() => {
      set((state) => ({ callDuration: state.callDuration + 1 }));
    }, 1000);
    set({ callTimer: timer });
  },

  // ─── Cleanup ──────────────────────────────────────────────────
  cleanupCall: () => {
    const { localStream, peerConnection, callTimer } = get();

    // Stop all local tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // Close peer connection
    if (peerConnection) {
      peerConnection.close();
    }

    // Clear timer
    if (callTimer) {
      clearInterval(callTimer);
    }

    set({
      callStatus: "idle",
      callType: null,
      callUser: null,
      isCaller: false,
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      isMuted: false,
      isCameraOff: false,
      callDuration: 0,
      callTimer: null,
    });
  },

  // ─── Subscribe to socket call events ──────────────────────────
  subscribeToCallEvents: () => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;

    socket.on("call:incoming", (data) => {
      get().handleIncomingCall(data);
    });

    socket.on("call:accepted", () => {
      set({ callStatus: "connected" });
      // Now create the offer
      get().createOffer();
    });

    socket.on("call:rejected", () => {
      get().cleanupCall();
    });

    socket.on("call:offer", (data) => {
      get().handleOffer(data);
    });

    socket.on("call:answer", (data) => {
      get().handleAnswer(data);
    });

    socket.on("call:ice-candidate", (data) => {
      get().handleIceCandidate(data);
    });

    socket.on("call:ended", () => {
      get().cleanupCall();
    });

    socket.on("call:unavailable", () => {
      get().cleanupCall();
    });
  },

  unsubscribeFromCallEvents: () => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;

    socket.off("call:incoming");
    socket.off("call:accepted");
    socket.off("call:rejected");
    socket.off("call:offer");
    socket.off("call:answer");
    socket.off("call:ice-candidate");
    socket.off("call:ended");
    socket.off("call:unavailable");
  },
}));
