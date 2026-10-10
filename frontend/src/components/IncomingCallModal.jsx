import { useCallStore } from "../store/useCallStore";
import { Phone, PhoneOff, Video } from "lucide-react";

const IncomingCallModal = () => {
  const { callStatus, callType, callUser, acceptCall, rejectCall } = useCallStore();

  if (callStatus !== "incoming") return null;

  const isVideoCall = callType === "video";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm incoming-call-overlay">
      <div className="bg-base-100 rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4
        border border-base-content/5 incoming-call-card">
        {/* Decorative rings */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
              <img
                src={callUser?.profilePic || "/avatar.png"}
                alt={callUser?.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full ring-2 ring-primary/20 animate-ping opacity-30" />
            <div className="absolute -inset-2 rounded-full ring-1 ring-primary/10 animate-ping opacity-20"
              style={{ animationDelay: "0.5s" }} />

            {/* Call type badge */}
            <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary shadow-lg
              ring-4 ring-base-100">
              {isVideoCall ? (
                <Video className="w-3.5 h-3.5 text-primary-content" />
              ) : (
                <Phone className="w-3.5 h-3.5 text-primary-content" />
              )}
            </div>
          </div>
        </div>

        {/* Caller info */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-base-content">{callUser?.fullName}</h3>
          <p className="text-sm text-base-content/50 mt-1">
            Incoming {isVideoCall ? "video" : "voice"} call...
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6">
          {/* Reject */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={rejectCall}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600
                transition-all duration-200 hover:scale-110 shadow-lg shadow-red-500/25
                active:scale-95"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <span className="text-xs text-base-content/40 font-medium">Decline</span>
          </div>

          {/* Accept */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={acceptCall}
              className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600
                transition-all duration-200 hover:scale-110 shadow-lg shadow-green-500/25
                active:scale-95 ring-animation"
            >
              <Phone className="w-6 h-6" />
            </button>
            <span className="text-xs text-base-content/40 font-medium">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
