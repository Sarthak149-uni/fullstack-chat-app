import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100/80 border-b border-base-content/5 fixed w-full top-0 z-40 
      backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all group">
              <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center
                group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-300
                shadow-sm shadow-primary/5">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={"/settings"}
              className="btn btn-sm btn-ghost gap-2 rounded-xl hover:bg-base-content/5 
                transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm btn-ghost gap-2 rounded-xl 
                  hover:bg-base-content/5 transition-all duration-200">
                  <div className="size-6 rounded-full overflow-hidden ring-1 ring-base-content/10">
                    <img 
                      src={authUser.profilePic || "/avatar.png"} 
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden sm:inline text-sm">Profile</span>
                </Link>

                <button 
                  className="btn btn-sm btn-ghost gap-2 rounded-xl hover:bg-error/10 
                    hover:text-error transition-all duration-200" 
                  onClick={logout}
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline text-sm">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
