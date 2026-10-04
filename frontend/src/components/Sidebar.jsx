import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOnline && matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-content/5 flex flex-col transition-all duration-200 bg-base-100">
      <div className="border-b border-base-content/5 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <span className="font-semibold hidden lg:block tracking-tight">Contacts</span>
          <span className="hidden lg:inline-flex ml-auto text-xs font-medium text-base-content/40 
            bg-base-content/5 px-2 py-0.5 rounded-full">
            {users.length}
          </span>
        </div>

        {/* Search bar */}
        <div className="mt-3 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm w-full pl-9 h-9 bg-base-200/50 
                border-base-content/5 focus:border-primary/30 text-sm"
            />
          </div>
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-sm text-base-content/60">Online only</span>
          </label>
          <span className="text-xs text-base-content/30 ml-auto">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2 flex-1">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-content/5 transition-all duration-200
              ${selectedUser?._id === user._id 
                ? "bg-primary/5 border-r-2 border-r-primary" 
                : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-11 object-cover rounded-full ring-2 ring-base-content/5"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-base-100 online-indicator"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate text-sm">{user.fullName}</div>
              <div className="text-xs text-base-content/40 mt-0.5">
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-500 font-medium">Online</span>
                ) : (
                  "Offline"
                )}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/30 py-8 text-sm">
            {searchQuery ? "No matching contacts" : "No online users"}
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
