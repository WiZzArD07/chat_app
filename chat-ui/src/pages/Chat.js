import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";


export default function Chat({ token }) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);

  //  decode JWT
  const username = JSON.parse(atob(token.split(".")[1])).username;

  //  simple 1–1 receiver logic (for demo)
  const receiverId = username === "user1" ? "user2" : "user1";

  const API = process.env.REACT_APP_API_URL;

  // ---------------- SOCKET SETUP ----------------
  useEffect(() => {
    const s = io(API, {
      auth: { token }
    });

    setSocket(s);

    // receive real-time message
    s.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    //  rate limit listener
    s.on("rateLimit", (data) => {
      alert(data.message);
    });

    return () => s.disconnect();
  }, [token]);

  // ---------------- LOAD INITIAL MESSAGES ----------------
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(
        `${API}/api/messages/${username}/${receiverId}?page=0`
      );

      setMessages(res.data);
      setPage(0);
    };

    fetchMessages();
  }, [username, receiverId]);

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const msgData = {
      senderId: username,
      receiverId,
      message
    };

    // instant UI update
    setMessages((prev) => [...prev, msgData]);

    socket.emit("sendMessage", {
      receiverId,
      message
    });

    setMessage("");
  };

  // ---------------- PAGINATION (SCROLL UP) ----------------
  const handleScroll = async (e) => {
    if (e.target.scrollTop === 0) {
      const nextPage = page + 1;

      const res = await axios.get(
        `${API}/api/messages/${username}/${receiverId}?page=0`
      );

      // prepend older messages
      setMessages((prev) => [...res.data, ...prev]);
      setPage(nextPage);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat ({username})</h2>

      {/* CHAT BOX */}
      <div
        style={{
          border: "1px solid black",
          height: 300,
          overflowY: "scroll",
          padding: 10
        }}
        onScroll={handleScroll}
      >
        {messages
          .filter(
            (m) =>
              (m.senderId === username && m.receiverId === receiverId) ||
              (m.senderId === receiverId && m.receiverId === username)
          )
          .map((m, i) => (
            <div key={i}>
              <b>{m.senderId === username ? "me" : m.senderId}:</b>{" "}
              {m.message}
            </div>
          ))}
      </div>

      <br />

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}