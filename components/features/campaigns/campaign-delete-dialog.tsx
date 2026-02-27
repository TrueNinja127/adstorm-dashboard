"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CampaignDeleteDialogProps {
  open: boolean
  campaignName: string | null
  onCancel: () => void
  onConfirm: () => void
}

export function CampaignDeleteDialog({
  open,
  campaignName,
  onCancel,
  onConfirm,
}: CampaignDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel()
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-destructive">
            Delete campaign?
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-3 text-sm text-muted-foreground">
          {campaignName && (
            <p>
              {`This will permanently remove "${campaignName}" from your campaigns. This action cannot be undone.`}
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
            variant="destructive"
            size="sm"
            className="min-w-[88px] btn-gelatine"
            onClick={onConfirm}
            disabled={!campaignName}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

