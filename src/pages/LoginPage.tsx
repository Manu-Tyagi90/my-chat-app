import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Avatar,
  Fade,
  CircularProgress,
  InputAdornment
} from "@mui/material";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setLoading(true);
      
      // Simulate loading for better UX
      setTimeout(() => {
        login(username.trim());
        navigate("/chat");
      }, 800);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: 'hidden',
        zIndex: 1000
      }}
    >
      {/* Prevent body scroll */}
      <style>
        {`
          body {
            overflow: hidden !important;
            height: 100vh;
            position: fixed;
            width: 100%;
          }
        `}
      </style>

      <Container 
        maxWidth="xs"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          px: 2
        }}
      >
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              width: '100%',
              maxWidth: 400,
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* App Logo/Brand */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Avatar
                sx={{
                  bgcolor: '#25d366',
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  boxShadow: 3
                }}
              >
                <ChatBubbleIcon sx={{ fontSize: 40, color: 'white' }} />
              </Avatar>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1a1a1a',
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2rem' }
                }}
              >
                ChatConnect
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.95rem',
                  fontWeight: 400
                }}
              >
                Connect with people instantly
              </Typography>
            </Box>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: '#333',
                      fontSize: '1.1rem'
                    }}
                  >
                    Enter your username
                  </Typography>
                  
                  <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="off"
                    autoFocus
                    disabled={loading}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon 
                              sx={{ 
                                color: 'text.secondary', 
                                fontSize: 20 
                              }} 
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#25d366',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#25d366',
                          borderWidth: 2,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                          color: '#25d366',
                        },
                      },
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={!username.trim() || loading}
                  sx={{
                    height: 56,
                    borderRadius: 3,
                    bgcolor: '#25d366',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 3,
                    '&:hover': {
                      bgcolor: '#20b358',
                      boxShadow: 6,
                    },
                    '&:disabled': {
                      bgcolor: 'grey.300',
                    },
                    position: 'relative'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Start Chatting
                      <ArrowForwardIcon sx={{ fontSize: 20 }} />
                    </Box>
                  )}
                </Button>
              </Stack>
            </form>

            {/* Footer */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.8rem'
                }}
              >
                Join rooms • Chat instantly • Stay connected
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}