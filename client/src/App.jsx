import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Home from "./pages/Home.jsx";

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("connecting socket...");
    const newSocket = io(process.env.BACKEND_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return <Home socket={socket} />;
};

export default App;
