import { useEffect, useState } from "react";
import API from "../../api/axios";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

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

  return { notifications, loading, fetchNotifications };
};

export default useNotifications;