import { useEffect } from "react";
import { socket } from "../../socket";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

useEffect(() => {
  if (!user?.id) return;

  // user.id comes from /api/users/me
  socket.emit("register", user.id);

  socket.on("hired", (data) => {
    toast.success(data.message);
  });

  return () => {
    socket.off("hired");
  };
}, [user?.id]);
