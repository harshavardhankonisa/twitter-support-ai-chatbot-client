import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Backdrop,
  Box,
  CircularProgress,
  CssBaseline,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import SearchIcon from "@mui/icons-material/Search";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import Markdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";

const apiBaseURL = "https://twitter-customer-support.azurewebsites.net/"

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [history, setHistory] = useState<
    {
      text: any;
      sender: string;
    }[]
  >([]);

  const [sessionId, setSessionId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleChatSubmit = async (message: any) => {
    setLoading(true);
    const newMessage = { text: message, sender: "user" };
    setHistory((prevHistory) => [...prevHistory, newMessage]);

    try {
      const response = await axios.post(`${apiBaseURL}/ai`, {
        session_id: sessionId,
        prompt: message,
      });

      const botResponse = { text: response.data.message, sender: "bot" };
      setHistory((prevHistory) => [...prevHistory, botResponse]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiBaseURL}/fetch-history`, {
        session_id: id,
      });

      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = async () => {
    setLoading(true);
    try {
      await axios.post(`${apiBaseURL}/clear-history`, {
        session_id: sessionId,
      });

      setHistory([]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSession = async () => {
    setLoading(true);
    let storedSessionId = localStorage.getItem("sessionId");
    if (!storedSessionId || storedSessionId.length < 1) {
      storedSessionId = uuidv4(); // Generate new UUID if not present
      localStorage.setItem("sessionId", storedSessionId!); // Store in localStorage
    } else {
      fetchChatHistory(storedSessionId);
    }
    try {
      const response = await axios.get(`${apiBaseURL}/`);
      if (response.data.status === "ready") {
        setSessionId(storedSessionId);
      }
    } catch (error) {
      console.error("Error initializing session:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize session on component mount
  React.useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        height="100vh"
        width="100vw"
        sx={{
          paddingX: "2%",
          [theme.breakpoints.up("sm")]: {
            paddingX: "10%",
          },
          [theme.breakpoints.up("md")]: {
            paddingX: "15%",
          },
          [theme.breakpoints.up("lg")]: {
            paddingX: "20%",
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          sx={{
            height: "10%",
            justifyContent: 'center',
            flexDirection: 'column',
            [theme.breakpoints.up("md")]: {
              justifyContent: 'space-between',  
              flexDirection: 'row',
            },
          }}
        >
          <Box>
            <Typography
              component="h1"
              variant="body1"
              color={theme.palette.primary.main}
            >
              Twitter Customer Support AI Chatbot
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <FormControlLabel
              control={<Switch onChange={handleThemeChange} />}
              label="Theme Mode"
            />
            <Box>
              <IconButton onClick={clearChatHistory}>
                <DeleteForeverIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box
            ref={chatContainerRef}
            sx={{
              overflowY: "scroll",
              overflowX: "hidden",
              height: "80vh",
              paddingY: "10px",
              paddingRight: "20px"
            }}
          >
            {history.map((message: any, index) => (
              <Box key={index} sx={{paddingTop: index%2===0 ? "30px" : "0"}}>
                {message.sender === "user" && (
                  <Typography component="span" fontWeight="bold" color='secondary'>
                    You:{" "}{message.text}
                  </Typography>
                )}
                {message.sender === "bot" && (
                  <Markdown>{message.text}</Markdown>
                )}
              </Box>
            ))}
          </Box>
          {/* <Grid container></Grid> */}
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "10px",
            }}
            onSubmit={(e: any) => {
              e.preventDefault();
              if (loading) return;
              const message = e.target.elements.message.value;
              handleChatSubmit(message);
              e.target.reset();
            }}
          >
            <TextField
              name="message"
              sx={{ flex: 1 }}
              label="Enter Chat"
              disabled={loading}
            />
            <IconButton
              sx={{ p: "10px" }}
              type="submit"
              aria-label="send"
              disabled={loading}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </Box>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
