import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, Shield } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-20 bg-base-200/50">
      <div className="max-w-2xl mx-auto p-4 py-8 fade-in-up">
        <div className="bg-base-100 rounded-2xl shadow-xl shadow-base-content/5 border border-base-content/5 overflow-hidden">
          {/* Profile Header */}
          <div className="auth-gradient p-8 pb-16 relative">
            <div className="text-center relative z-10">
              <h1 className="text-2xl font-bold text-white tracking-tight">Profile</h1>
              <p className="mt-1 text-white/70 text-sm">Manage your account details</p>
            </div>
          </div>

          {/* Avatar section - overlapping the header */}
          <div className="flex flex-col items-center -mt-12 px-6 pb-8">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-28 rounded-full object-cover border-4 border-base-100 
                  shadow-xl ring-2 ring-base-content/5"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-1 right-1 
                  bg-primary hover:bg-primary-focus hover:scale-110
                  p-2.5 rounded-full cursor-pointer 
                  transition-all duration-300 shadow-lg shadow-primary/30
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-4 h-4 text-primary-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight">{authUser?.fullName}</h2>
            <p className="text-sm text-base-content/40 mt-0.5">
              {isUpdatingProfile ? "Uploading..." : "Click the camera to update your photo"}
            </p>
          </div>

          {/* Info cards */}
          <div className="px-6 pb-8 space-y-3">
            <div className="bg-base-200/50 rounded-xl p-4 flex items-center gap-4 
              border border-base-content/5 hover:border-base-content/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-base-content/40 font-medium uppercase tracking-wider">Full Name</p>
                <p className="font-medium mt-0.5 truncate">{authUser?.fullName}</p>
              </div>
            </div>

            <div className="bg-base-200/50 rounded-xl p-4 flex items-center gap-4 
              border border-base-content/5 hover:border-base-content/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-base-content/40 font-medium uppercase tracking-wider">Email Address</p>
                <p className="font-medium mt-0.5 truncate">{authUser?.email}</p>
              </div>
            </div>

            <div className="bg-base-200/50 rounded-xl p-4 flex items-center gap-4 
              border border-base-content/5 hover:border-base-content/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-base-content/40 font-medium uppercase tracking-wider">Member Since</p>
                <p className="font-medium mt-0.5">{authUser.createdAt?.split("T")[0]}</p>
              </div>
            </div>

            <div className="bg-base-200/50 rounded-xl p-4 flex items-center gap-4 
              border border-base-content/5 hover:border-base-content/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-base-content/40 font-medium uppercase tracking-wider">Account Status</p>
                <p className="font-medium mt-0.5 text-success">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
