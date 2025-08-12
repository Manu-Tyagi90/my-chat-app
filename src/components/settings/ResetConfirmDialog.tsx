// src/components/settings/ResetConfirmDialog.tsx
import { Dialog, DialogTitle, DialogContent, Typography, Box, Button } from "@mui/material";

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}>;

export default function ResetConfirmDialog({ open, onClose, onConfirm }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Reset All Settings?</DialogTitle>
      <DialogContent>
        <Typography>
          This will reset all settings to their default values. This action cannot be undone.
        </Typography>
      </DialogContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={onConfirm}
        >
          Reset
        </Button>
      </Box>
    </Dialog>
  );
}