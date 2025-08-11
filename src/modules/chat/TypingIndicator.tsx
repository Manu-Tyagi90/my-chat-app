import { Typography, Box } from "@mui/material";

type Props = {
  typingUser: string | null;
};

export default function TypingIndicator({ typingUser }: Props) {
  if (!typingUser) return null;

  return (
    <Box sx={{ mb: 1, px: 1 }}>
      <Typography
        variant="caption"
        sx={{
          fontStyle: "italic",
          color: "text.secondary",
          letterSpacing: 0.3,
        }}
      >
        {typingUser} is typing...
      </Typography>
    </Box>
  );
}