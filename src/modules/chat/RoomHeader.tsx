import { Typography, Box } from "@mui/material";

type Props = {
  selectedRoom: string;
};

export default function RoomHeader({ selectedRoom }: Props) {
  return (
    <Box sx={{ mb: 1, mt: 1 }}>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color="primary"
      >
        Room: {selectedRoom}
      </Typography>
    </Box>
  );
}