import { X, Phone, Video, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { initiateCall, callStatus } = useCallStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  const handleCall = (type) => {
    if (!isOnline) {
      toast.error(`${selectedUser.fullName} is offline`);
      return;
    }
    if (callStatus !== "idle") {
      toast.error("Already in a call");
      return;
    }
    initiateCall(selectedUser, type);
  };

  return (
    <div className="px-4 py-3 border-b border-base-content/5 bg-base-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full ring-2 ring-base-content/5 relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
              {isOnline && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full 
                  ring-2 ring-base-100 online-indicator" />
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-semibold text-sm tracking-tight">{selectedUser.fullName}</h3>
            <p className="text-xs mt-0.5">
              {isOnline ? (
                <span className="text-green-500 font-medium">Online</span>
              ) : (
                <span className="text-base-content/40">Offline</span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleCall("audio")}
            className={`btn btn-ghost btn-sm btn-circle transition-all duration-200
              ${isOnline
                ? "text-base-content/60 hover:text-green-500 hover:bg-green-500/10"
                : "text-base-content/20 cursor-not-allowed"
              }`}
            disabled={!isOnline}
            title="Voice call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleCall("video")}
            className={`btn btn-ghost btn-sm btn-circle transition-all duration-200
              ${isOnline
                ? "text-base-content/60 hover:text-blue-500 hover:bg-blue-500/10"
                : "text-base-content/20 cursor-not-allowed"
              }`}
            disabled={!isOnline}
            title="Video call"
          >
            <Video className="w-4 h-4" />
          </button>
          <button className="btn btn-ghost btn-sm btn-circle text-base-content/40 
            hover:text-base-content/70 hover:bg-base-content/5">
            <MoreVertical className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-base-content/10 mx-1" />
          <button 
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-sm btn-circle text-base-content/40 
              hover:text-error hover:bg-error/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
