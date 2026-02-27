"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Campaign } from "@/types/campaigns"

interface CampaignStatusDialogProps {
  open: boolean
  action: "pause" | "resume" | null
  campaign: Campaign | null
  onCancel: () => void
  onConfirm: () => void
}

export function CampaignStatusDialog({
  open,
  action,
  campaign,
  onCancel,
  onConfirm,
}: CampaignStatusDialogProps) {
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
            {isPause ? "Pause campaign?" : "Resume campaign?"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-3 text-sm text-muted-foreground">
          {campaign && action && (
            <p>
              {isPause
                ? `This will pause "${campaign.name}" and stop serving its ads until you resume it.`
                : `This will resume "${campaign.name}" and start serving its ads again.`}
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
              isPause ? "bg-primary" : "bg-emerald-500 hover:bg-emerald-700 text-white"
            }`}
            onClick={onConfirm}
            disabled={!action}
          >
            {isPause ? "Pause" : "Play"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

