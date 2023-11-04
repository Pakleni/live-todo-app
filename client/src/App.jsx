import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("connecting socket...");
    const newSocket = io(process.env.BACKEND_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return <h1>hello world</h1>;
};

export default App;
