import { FileText, Film, Music, Archive, File, Download } from "lucide-react";

const FILE_ICONS = {
  "application/pdf": { icon: FileText, color: "text-red-400", bg: "bg-red-500/10" },
  "application/zip": { icon: Archive, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  "application/x-rar-compressed": { icon: Archive, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  "application/x-7z-compressed": { icon: Archive, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  video: { icon: Film, color: "text-purple-400", bg: "bg-purple-500/10" },
  audio: { icon: Music, color: "text-green-400", bg: "bg-green-500/10" },
  default: { icon: File, color: "text-blue-400", bg: "bg-blue-500/10" },
};

function getFileIcon(mimeType) {
  if (!mimeType) return FILE_ICONS.default;
  if (FILE_ICONS[mimeType]) return FILE_ICONS[mimeType];
  if (mimeType.startsWith("video/")) return FILE_ICONS.video;
  if (mimeType.startsWith("audio/")) return FILE_ICONS.audio;
  return FILE_ICONS.default;
}

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getFileExtension(name) {
  if (!name) return "";
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toUpperCase() : "";
}

const FilePreview = ({ file, compact = false }) => {
  if (!file?.url) return null;

  const { icon: Icon, color, bg } = getFileIcon(file.type);
  const ext = getFileExtension(file.name);
  const isMedia = file.type?.startsWith("video/") || file.type?.startsWith("audio/");

  return (
    <div className={`rounded-xl overflow-hidden ${compact ? "max-w-[220px]" : "max-w-[280px]"}`}>
      {/* Video/Audio inline player */}
      {file.type?.startsWith("video/") && (
        <video
          src={file.url}
          controls
          className="w-full rounded-t-xl max-h-48 bg-black"
          preload="metadata"
        />
      )}
      {file.type?.startsWith("audio/") && (
        <audio src={file.url} controls className="w-full mt-1" preload="metadata" />
      )}

      {/* File info bar */}
      <div
        className={`flex items-center gap-3 p-3 ${bg} rounded-xl
          ${isMedia ? "rounded-t-none" : ""} cursor-pointer group
          hover:brightness-110 transition-all duration-200`}
        onClick={() => window.open(file.url, "_blank")}
      >
        <div className={`p-2 rounded-lg bg-base-100/50 shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold truncate text-base-content/90">
            {file.name || "File"}
          </p>
          <p className="text-[10px] text-base-content/40 mt-0.5">
            {ext && <span className="font-medium">{ext} · </span>}
            {formatFileSize(file.size)}
          </p>
        </div>
        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Download className="w-4 h-4 text-base-content/50" />
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
