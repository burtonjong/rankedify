import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyAlbums from "./pages/MyAlbums";
import Login from "./pages/Login";

import { useState, useEffect, useCallback } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [added, setAdded] = useState([]);

  const CLIENT_ID = "135ae988dbca4981989bff22410cb627";
  const REDIRECT_URI = "http://localhost:5173/home";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const CLIENT_SECRET = "4195754e67d84c5592aa09d799685dd9";
  const SCOPE = "user-read-recently-played user-library-read user-top-read";

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
    const storedAddedAlbums = localStorage.getItem("addedAlbums");
    if (storedAddedAlbums) {
      setAdded(JSON.parse(storedAddedAlbums));
    }
  }, []);

  console.log(token);

  async function fetchProfile(accessToken) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return await result.json();
  }

  async function refreshToken(refreshToken) {
    const tokenEndpoint = "https://accounts.spotify.com/api/token";

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`, // Base64-encoded "clientId:clientSecret"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });

    const data = await response.json();
    // console.log(data);
    if (response.ok) {
      return data.access_token; // Return the new access token
    } else {
      throw new Error(data.error_description || "Failed to refresh token");
    }
  }

  const fetchUserProfile = useCallback(
    async (accessToken) => {
      try {
        const profileData = await fetchProfile(accessToken);
        setProfile(profileData);
      } catch (error) {
        if (error.message === "Access token expired") {
          // Handle token refresh and retry the request
          try {
            const newToken = await refreshToken(token); // Pass the current token
            fetchUserProfile(newToken);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
          }
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    }
  }, [fetchUserProfile, token]);

  function handleAdd(selectedAlbum) {
    const newAddedAlbum = {
      name: selectedAlbum.name,
      image: selectedAlbum.images[0].url,
      artist: selectedAlbum.artists[0].name,
    };

    // Use the updater function form of setAdded to ensure you're working with the latest state
    const updatedAdded = [...added, newAddedAlbum];
    setAdded(updatedAdded);
    console.log(added);

    localStorage.setItem("addedAlbums", JSON.stringify(updatedAdded));

    console.log(updatedAdded);
  }

  useEffect(() => {
    localStorage.setItem("lastQuery", query);
  }, [query]);

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
                SCOPE={SCOPE}
              />
            }
          />
          <Route
            path="/home"
            element={
              <Home
                CLIENT_ID={CLIENT_ID}
                CLIENT_SECRET={CLIENT_SECRET}
                token={token}
                setToken={setToken}
                profile={profile}
              />
            }
          />
          <Route
            path="/myalbums"
            element={
              <MyAlbums
                token={token}
                setToken={setToken}
                profile={profile}
                addedAlbums={added}
              />
            }
          />
          <Route
            path="/browse"
            element={
              <Browse
                token={token}
                setToken={setToken}
                query={query}
                setQuery={setQuery}
                profile={profile}
                albums={albums}
                setAlbums={setAlbums}
                handleAdd={handleAdd}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
