import { Paper, Typography, Stack, Chip, Avatar } from "@mui/material";

type Props = {
  onlineUsers: string[];
};

export default function OnlineUsers({ onlineUsers }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 2,
        borderRadius: 2,
        bgcolor: "grey.50"
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
        Online Users:
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {onlineUsers.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No users online
          </Typography>
        )}
        {onlineUsers.map((user) => (
          <Chip
            key={user}
            label={user}
            avatar={
              <Avatar
                sx={{
                  bgcolor: "green.500",
                  width: 20,
                  height: 20
                }}
              >
                {/* Green dot */}
              </Avatar>
            }
            size="small"
            variant="outlined"
          />
        ))}
      </Stack>
    </Paper>
  );
}