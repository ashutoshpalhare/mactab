import { Trash2 } from "lucide-react";

export default function TrashApp() {
  return (
    <div className="h-full flex flex-col items-center justify-center opacity-70">
      <Trash2 className="w-16 h-16 mb-3" />
      <div className="text-lg font-semibold">Trash is empty</div>
      <div className="text-sm opacity-70 mt-1">Deleted items will appear here</div>
    </div>
  );
}
