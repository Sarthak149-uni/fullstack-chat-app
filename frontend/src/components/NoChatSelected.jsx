import { MessageSquare, Users, Sparkles } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6 fade-in-up">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center
             justify-center shadow-lg shadow-primary/5"
            >
              <MessageSquare className="w-10 h-10 text-primary float-animation" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/20 rounded-lg 
              flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Welcome to Chatty!</h2>
          <p className="text-base-content/50 leading-relaxed">
            Select a conversation from the sidebar to start chatting
          </p>
        </div>

        {/* Tips */}
        <div className="pt-4 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-base-content/40 justify-center">
            <Users className="w-4 h-4" />
            <span>Your contacts are on the left</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-base-content/40 justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span>Green dot means they&apos;re online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
