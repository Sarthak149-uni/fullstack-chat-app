import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, ArrowRight, Shield, Check } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { width: "0%", color: "bg-base-content/10", text: "" };
    if (pwd.length < 4) return { width: "25%", color: "bg-error", text: "Weak" };
    if (pwd.length < 6) return { width: "50%", color: "bg-warning", text: "Fair" };
    if (pwd.length < 8) return { width: "75%", color: "bg-info", text: "Good" };
    return { width: "100%", color: "bg-success", text: "Strong" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="w-full max-w-md space-y-8 fade-in-up relative z-10">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center 
                group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110
                shadow-lg shadow-primary/5"
              >
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mt-3 tracking-tight">Create Account</h1>
              <p className="text-base-content/50 text-sm">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium text-sm">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/30" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-11 h-12 bg-base-200/50 focus:bg-base-100
                    border-base-content/10 focus:border-primary/50"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

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

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2.5 space-y-1">
                  <div className="h-1.5 w-full bg-base-content/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <p className="text-xs text-base-content/40 text-right">
                    {passwordStrength.text}
                  </p>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full h-12 text-base font-semibold mt-2
                shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01]
                active:scale-[0.99] transition-all duration-200" 
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
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
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:text-primary/80 
                hover:underline underline-offset-4 transition-all">
                Sign in
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

      {/* right side */}
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
          {/* Feature list */}
          <div className="mb-10 space-y-4 text-left">
            {[
              { text: "Real-time messaging", emoji: "💬" },
              { text: "Share photos & files", emoji: "📸" },
              { text: "Know when friends are online", emoji: "🟢" },
              { text: "Beautiful themes to choose from", emoji: "🎨" },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3.5
                  shadow-lg hover:bg-white/15 transition-colors"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-lg">{feature.emoji}</span>
                <span className="text-white/90 text-sm font-medium">{feature.text}</span>
                <Check className="w-4 h-4 text-white/60 ml-auto" />
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">Join our community</h2>
          <p className="text-white/70 text-base leading-relaxed">
            Connect with friends, share moments, and stay in touch with your loved ones.
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
