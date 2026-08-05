import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { SocketContext } from "../../context/SocketContext";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useContext(SocketContext);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const res = await API.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      };

      socket.on("new_notification", handleNewNotification);

      return () => {
        socket.off("new_notification", handleNewNotification);
      };
    }
  }, [socket]);

  return { notifications, setNotifications, loading, fetchNotifications };
};

export default useNotifications;