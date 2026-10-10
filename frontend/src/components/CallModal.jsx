import { useEffect, useRef } from "react";
import { useCallStore } from "../store/useCallStore";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useState } from "react";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const CallModal = () => {
  const {
    callStatus,
    callType,
    callUser,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    callDuration,
    toggleMute,
    toggleCamera,
    endCall,
  } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callStatus !== "calling" && callStatus !== "connected") return null;

  const isVideoCall = callType === "video";
  const isConnected = callStatus === "connected";

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-base-300/95 backdrop-blur-xl flex flex-col items-center justify-center call-modal-enter"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {isConnected && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/20 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-base-content/80">
              {formatDuration(callDuration)}
            </span>
          </div>
        )}
        {!isConnected && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/20 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-sm font-medium text-base-content/80">Calling...</span>
          </div>
        )}
      </div>

      {/* Video area */}
      {isVideoCall ? (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Remote video (full screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              !isConnected ? "opacity-0" : "opacity-100"
            } transition-opacity duration-500`}
          />

          {/* Calling overlay when not connected */}
          {!isConnected && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-2xl">
                  <img
                    src={callUser?.profilePic || "/avatar.png"}
                    alt={callUser?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full ring-4 ring-primary/30 animate-ping opacity-30" />
              </div>
              <div className="text-center mt-2">
                <h3 className="text-xl font-bold text-base-content">{callUser?.fullName}</h3>
                <p className="text-sm text-base-content/50 mt-1 calling-dots">Calling</p>
              </div>
            </div>
          )}

          {/* Local video (picture-in-picture) */}
          <div className="absolute bottom-28 right-6 w-40 h-56 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-base-content/10
            hover:scale-105 transition-transform duration-300 cursor-move">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isCameraOff ? "hidden" : ""}`}
            />
            {isCameraOff && (
              <div className="w-full h-full bg-base-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-base-content/10">
                  <img
                    src={callUser?.profilePic || "/avatar.png"}
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Audio call UI */
        <div className="flex flex-col items-center justify-center gap-6 z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-2xl
              audio-pulse">
              <img
                src={callUser?.profilePic || "/avatar.png"}
                alt={callUser?.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {isConnected && (
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-green-500 ring-4 ring-base-300">
                <Mic className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-base-content">{callUser?.fullName}</h3>
            <p className="text-sm text-base-content/50 mt-1">
              {isConnected ? "Voice Call" : (
                <span className="calling-dots">Calling</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-base-100/10 backdrop-blur-xl
          border border-base-content/5 shadow-2xl">
          {/* Mute */}
          <button
            onClick={toggleMute}
            className={`p-3.5 rounded-xl transition-all duration-200 hover:scale-110
              ${isMuted
                ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30"
                : "bg-base-content/10 text-base-content/70 hover:bg-base-content/20"
              }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera toggle (video calls only) */}
          {isVideoCall && (
            <button
              onClick={toggleCamera}
              className={`p-3.5 rounded-xl transition-all duration-200 hover:scale-110
                ${isCameraOff
                  ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30"
                  : "bg-base-content/10 text-base-content/70 hover:bg-base-content/20"
                }`}
              title={isCameraOff ? "Turn on camera" : "Turn off camera"}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* Fullscreen (video calls only) */}
          {isVideoCall && (
            <button
              onClick={toggleFullscreen}
              className="p-3.5 rounded-xl bg-base-content/10 text-base-content/70
                hover:bg-base-content/20 transition-all duration-200 hover:scale-110"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          )}

          {/* End call */}
          <button
            onClick={endCall}
            className="p-3.5 rounded-xl bg-red-500 text-white hover:bg-red-600
              transition-all duration-200 hover:scale-110 shadow-lg shadow-red-500/25
              ml-2"
            title="End call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
