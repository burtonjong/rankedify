import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyAlbums from "./pages/MyAlbums";
import Login from "./pages/Login";

import { useState, useEffect, useCallback } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../src/firebase.js";
import Cookies from "js-cookie";

function App() {
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [added, setAdded] = useState([]);
  const [userRating, setUserRating] = useState(1);
  const [show, setShow] = useState(false);

  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const CLIENT_SECRET = "4195754e67d84c5592aa09d799685dd9";
  const SCOPE = "user-read-recently-played user-library-read user-top-read";

  useEffect(() => {
    const hash = window.location.hash;
    let token = "";

    // getToken()

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      // window.localStorage.setItem("token", token);
      Cookies.set("access_token", token, {
        secure: true,
        httpOnly: false,
      });
    }
    const one = Cookies.get("access_token");
    console.log(one);
    setShow(true);
    const storedAddedAlbums = localStorage.getItem("addedAlbums");
    if (storedAddedAlbums) {
      setAdded(JSON.parse(storedAddedAlbums));
    }
  }, []);

  // console.log(token);

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

  async function addRatingToAlbum(albumId, rating) {
    try {
      // 1. Query Firestore to retrieve the document containing addedAlbums
      const userDocRef = doc(db, "users", profile.id);
      const userDocSnapshot = await getDoc(userDocRef);

      const userData = userDocSnapshot.data().addedAlbums;
      console.log("userData", userData);

      const updatedAlbums = userData.map((album) => {
        if (album.id === albumId) {
          // 3. Update the rating for the matching object

          album.rating = rating;
          console.log(album.rating);
        }
        return album;
      });

      // 4. Update the Firestore document with the modified addedAlbums array
      await updateDoc(userDocRef, {
        addedAlbums: updatedAlbums,
      });
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  }

  useEffect(() => {
    const token = Cookies.get("access_token");
    const updateAddedInFirestore = async () => {
      if (added && token) {
        try {
          const userDocRef = doc(db, "users", profile.id);

          await updateDoc(userDocRef, {
            addedAlbums: added,
          });
          console.log(profile);
        } catch (error) {
          console.error("Error updating added albums:", error);
        }
      } else {
        console.log("It did not work");
      }
    };
    updateAddedInFirestore();
  }, [added]);

  useEffect(() => {
    const token = Cookies.get("access_token");

    async function fetchProfile(token) {
      const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      return await result.json();
    }

    async function fetchUserProfile(accessToken) {
      try {
        const profileData = await fetchProfile(accessToken);
        console.log(profileData);
        setProfile(profileData);

        // Check if the user document exists in the Firestore database
        const userDocRef = doc(db, "users", profileData.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
          await setDoc(doc(db, "users", profileData.id), {
            addedAlbums: added, // if they don't exist
          });
        }
        console.log("Doc", userDocRef);
      } catch (error) {
        if (error.message === "Access token expired") {
          // Handle token refresh and retry the request
          try {
            const newToken = await refreshToken(token); // Pass the current token
            console.log("error fetching profile, retrying with new token");
            fetchUserProfile(newToken);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
          }
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    }
    if (show) {
      fetchUserProfile(token);
    }
  }, [show]);

  function handleAdd(selectedAlbum) {
    const newAddedAlbum = {
      name: selectedAlbum.name,
      image: selectedAlbum.images[0].url,
      artist: selectedAlbum.artists[0].name,
      id: selectedAlbum.id,
      release_date: selectedAlbum.release_date,
      total_tracks: selectedAlbum.total_tracks,
      external_urls: selectedAlbum.external_urls.spotify,
      clicked: true,
      rating: userRating,
    };

    // Use the updater function form of setAdded to ensure you're working with the latest state
    const updatedAdded = [...added, newAddedAlbum];
    setAdded(updatedAdded);

    localStorage.setItem("addedAlbums", JSON.stringify(updatedAdded));

    console.log(updatedAdded);
    console.log(added);
  }

  useEffect(() => {
    localStorage.setItem("lastQuery", query);
  }, [query]);

  // useEffect(() => {
  //   const savedRating = localStorage.getItem("userRating");
  //   console.log("savedRating", savedRating);
  //   if (savedRating) {
  //     setUserRating(parseInt(savedRating, 10));
  //   }
  // }, []);

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
                show={show}
                profile={profile}
                addedAlbums={added}
                userRating={Number(userRating)}
                setUserRating={setUserRating}
              />
            }
          />
          <Route
            path="/myalbums"
            element={
              <MyAlbums
                show={show}
                profile={profile}
                addedAlbums={added}
                setUserRating={setUserRating}
                userRating={userRating}
                addRatingToAlbum={addRatingToAlbum}
              />
            }
          />
          <Route
            path="/browse"
            element={
              <Browse
                show={show}
                query={query}
                setQuery={setQuery}
                profile={profile}
                albums={albums}
                setAlbums={setAlbums}
                handleAdd={handleAdd}
                addedAlbums={added}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
