import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      // Connect to the backend
      const newSocket = io(import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:5000", {
        withCredentials: true,
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        newSocket.emit("register", user._id);
      });

      // Show toast alert for new notifications if not on a notification page
      newSocket.on("new_notification", (notification) => {
        toast.success(`New Notification: ${notification.title}`, {
          icon: "🔔"
        });
      });

      return () => {
        newSocket.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
