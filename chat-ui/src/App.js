import { useState } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  const [token, setToken] = useState(null);

  return token ? (
    <Chat token={token} />
  ) : (
    <Login setToken={setToken} />
  );
}

export default App;