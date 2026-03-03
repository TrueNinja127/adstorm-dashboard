"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CampaignBulkStatusDialogProps {
  open: boolean
  action: "pause" | "resume" | null
  selectedCount: number
  onCancel: () => void
  onConfirm: () => void
}

export function CampaignBulkStatusDialog({
  open,
  action,
  selectedCount,
  onCancel,
  onConfirm,
}: CampaignBulkStatusDialogProps) {
  const isPause = action === "pause"

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel()
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            {isPause ? "Pause selected campaigns?" : "Play selected campaigns?"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-3 text-sm text-muted-foreground">
          {selectedCount > 0 && action && (
            <p>
              {isPause
                ? `This will pause ${selectedCount} selected campaign(s) and stop serving their ads until you resume them.`
                : `This will play ${selectedCount} selected campaign(s) and start serving their ads.`}
            </p>
          )}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-w-[88px]"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className={`min-w-[88px] btn-gelatine ${
              isPause
                ? "bg-primary"
                : "bg-emerald-500 hover:bg-emerald-700 text-white"
            }`}
            onClick={onConfirm}
            disabled={!action || selectedCount === 0}
          >
            {isPause ? "Pause" : "Play"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
