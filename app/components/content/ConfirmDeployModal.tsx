'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Loader2, AlertTriangle } from "lucide-react";

interface ConfirmDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  error: string | null;
  title: string;
}

export default function ConfirmDeployModal({ isOpen, onClose, onConfirm, isLoading, error, title }: ConfirmDeployModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <Card className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        <CardHeader>
          <CardTitle>Update Live Content: {title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">Are you sure you want to deploy this new content to the live server?</p>
          <p className="text-xs text-muted-foreground">This action will overwrite the current live data and cannot be undone.</p>
          
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Proceed'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
