import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, ArrowRight, Shield } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="w-full max-w-md space-y-8 fade-in-up relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center 
                group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 
                shadow-lg shadow-primary/5"
              >
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mt-3 tracking-tight">Welcome Back</h1>
              <p className="text-base-content/50 text-sm">Sign in to continue your conversations</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium text-sm">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/30" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-11 h-12 bg-base-200/50 focus:bg-base-100
                    border-base-content/10 focus:border-primary/50"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium text-sm">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/30" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-11 h-12 bg-base-200/50 focus:bg-base-100
                    border-base-content/10 focus:border-primary/50"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full h-12 text-base font-semibold
                shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01]
                active:scale-[0.99] transition-all duration-200" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-base-content/10"></div>
            <span className="text-xs text-base-content/40 uppercase tracking-wider font-medium">or</span>
            <div className="flex-1 h-px bg-base-content/10"></div>
          </div>

          <div className="text-center">
            <p className="text-base-content/50 text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:text-primary/80 
                hover:underline underline-offset-4 transition-all">
                Create account
              </Link>
            </p>
          </div>

          {/* Trust indicator */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-base-content/30 pt-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Secured with end-to-end encryption</span>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex items-center justify-center auth-gradient relative overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-24 h-24 bg-white/10 rounded-3xl float-animation blur-sm" />
          <div className="absolute top-40 right-32 w-16 h-16 bg-white/10 rounded-2xl float-animation-delayed blur-sm" />
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-white/10 rounded-3xl float-animation-slow blur-sm" />
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-white/10 rounded-xl float-animation blur-sm" />
          <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-white/5 rounded-full float-animation-delayed" />
          <div className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-white/5 rounded-2xl float-animation-slow" />
        </div>

        <div className="max-w-md text-center relative z-10 px-8">
          {/* Chat bubble mockup */}
          <div className="mb-10 space-y-4">
            <div className="flex justify-start">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl rounded-bl-md px-5 py-3 
                text-white/90 text-sm max-w-[200px] text-left shadow-lg float-animation">
                Hey! How are you? 👋
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-white/25 backdrop-blur-sm rounded-2xl rounded-br-md px-5 py-3 
                text-white text-sm max-w-[240px] text-left shadow-lg float-animation-delayed">
                I&apos;m great! Just shipped a new feature 🚀
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl rounded-bl-md px-5 py-3 
                text-white/90 text-sm max-w-[180px] text-left shadow-lg float-animation-slow">
                That&apos;s awesome! 🎉
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">Welcome back!</h2>
          <p className="text-white/70 text-base leading-relaxed">
            Sign in to continue your conversations and catch up with your messages.
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
