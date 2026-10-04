import { X, Phone, Video, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

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
          <button className="btn btn-ghost btn-sm btn-circle text-base-content/40 
            hover:text-base-content/70 hover:bg-base-content/5">
            <Phone className="w-4 h-4" />
          </button>
          <button className="btn btn-ghost btn-sm btn-circle text-base-content/40 
            hover:text-base-content/70 hover:bg-base-content/5">
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
