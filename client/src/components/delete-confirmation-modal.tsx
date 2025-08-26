import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { Student } from "@shared/schema";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  student,
  onConfirm,
  isDeleting,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          
          <h3 className="text-xl font-semibold text-slate-900 text-center mb-2">
            Delete Student
          </h3>
          <p className="text-slate-600 text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="font-medium">{student?.name}</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
              className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl"
            >
              {isDeleting ? "Deleting..." : "Delete Student"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
