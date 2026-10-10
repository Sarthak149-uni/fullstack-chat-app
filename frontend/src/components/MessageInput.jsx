import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Paperclip, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [fileAttachment, setFileAttachment] = useState(null); // { file, name, size, type }
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const attachmentInputRef = useRef(null);
  const { sendMessage, sendFile } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileAttachment = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size should be less than 100MB");
      return;
    }

    setFileAttachment({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = () => {
    setFileAttachment(null);
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !fileAttachment) return;
    if (isSending) return;

    setIsSending(true);
    setUploadProgress(0);

    try {
      if (fileAttachment) {
        // Send as multipart file upload
        await sendFile(fileAttachment.file, text.trim(), (progress) => {
          setUploadProgress(progress);
        });
      } else {
        // Send as regular message (text + optional image)
        await sendMessage({
          text: text.trim(),
          image: imagePreview,
        });
      }

      // Clear form
      setText("");
      setImagePreview(null);
      setFileAttachment(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (attachmentInputRef.current) attachmentInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const hasContent = text.trim() || imagePreview || fileAttachment;

  return (
    <div className="p-4 w-full border-t border-base-content/5 bg-base-100">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2 fade-in-up">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-base-content/10 
                shadow-sm"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-error-content
                flex items-center justify-center shadow-md
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                hover:scale-110"
              type="button"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* File attachment preview */}
      {fileAttachment && (
        <div className="mb-3 fade-in-up">
          <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl border border-base-content/5
            max-w-xs group">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-base-content/80">
                {fileAttachment.name}
              </p>
              <p className="text-[10px] text-base-content/40 mt-0.5">
                {formatFileSize(fileAttachment.size)}
              </p>
            </div>
            <button
              onClick={removeFile}
              className="shrink-0 w-6 h-6 rounded-full bg-error/10 text-error
                flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                hover:bg-error/20 hover:scale-110"
              type="button"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Upload progress */}
          {isSending && uploadProgress > 0 && (
            <div className="mt-2 max-w-xs">
              <div className="h-1.5 bg-base-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-base-content/40 mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-xl input-sm sm:input-md 
              bg-base-200/50 border-base-content/5 focus:border-primary/30
              placeholder:text-base-content/30"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Hidden file inputs */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <input
            type="file"
            className="hidden"
            ref={attachmentInputRef}
            onChange={handleFileAttachment}
          />

          {/* File attachment button */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle btn-ghost
                     ${fileAttachment ? "text-primary" : "text-base-content/30 hover:text-base-content/50"}
                     hover:bg-base-content/5 transition-all duration-200`}
            onClick={() => attachmentInputRef.current?.click()}
            title="Attach file (up to 100MB)"
          >
            <Paperclip size={20} />
          </button>

          {/* Image button */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle btn-ghost
                     ${imagePreview ? "text-primary" : "text-base-content/30 hover:text-base-content/50"}
                     hover:bg-base-content/5 transition-all duration-200`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className={`btn btn-circle btn-sm sm:btn-md transition-all duration-200
            ${hasContent
              ? "btn-primary shadow-md shadow-primary/20 hover:shadow-primary/40 hover:scale-105"
              : "btn-ghost text-base-content/20"}`}
          disabled={!hasContent || isSending}
        >
          {isSending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} className={hasContent ? "" : "opacity-50"} />
          )}
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
