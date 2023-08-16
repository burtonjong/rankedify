import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyAlbums from "./pages/MyAlbums";
import Login from "./pages/Login";

import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [token, setToken] = useState("");

  const CLIENT_ID = "135ae988dbca4981989bff22410cb627";
  const REDIRECT_URI = "http://localhost:5173/home";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    // getToken()

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  console.log(token);

  return (
    <>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Login
                CLIENT_ID={CLIENT_ID}
                REDIRECT_URI={REDIRECT_URI}
                AUTH_ENDPOINT={AUTH_ENDPOINT}
                RESPONSE_TYPE={RESPONSE_TYPE}
              />
            }
          />
          <Route
            path="/home"
            element={<Home token={token} setToken={setToken} />}
          />
          <Route
            path="/myalbums"
            element={<MyAlbums token={token} setToken={setToken} />}
          />
          <Route
            path="/browse"
            element={
              <Browse
                token={token}
                setToken={setToken}
                query={query}
                setQuery={setQuery}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
