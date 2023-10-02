import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyAlbums from "./pages/MyAlbums";
import Login from "./pages/Login";

import { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../src/firebase.js";
import Cookies from "js-cookie";

function App() {
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [added, setAdded] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [show, setShow] = useState(false);
  const [profileIsFetched, setProfileIsFetched] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setShow(true);

    // const storedAddedAlbums = localStorage.getItem("addedAlbums");
    // if (storedAddedAlbums) {
    //   setAdded(JSON.parse(storedAddedAlbums));
    // }
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

  useEffect(() => {
    const tokenRefreshInterval = setInterval(() => {
      const refreshToken = Cookies.get("access_token");
      refreshToken(refreshToken);
      console.log("Token refreshed.");
    }, 3500 * 1000); // Convert seconds to milliseconds

    // Optionally, clear the interval when the component unmounts
    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  async function deleteAlbumFromDatabase(albumId) {
    try {
      // 1. Retrieve the current user's data
      const userDocRef = doc(db, "users", profile.id);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();

      // 2. Modify the addedAlbums array to remove the selected album
      const updatedAlbums = userData.addedAlbums.filter(
        (album) => album.id !== albumId
      );

      // 3. Update the user's document in Firestore with the modified addedAlbums array
      await updateDoc(userDocRef, { addedAlbums: updatedAlbums });

      console.log("Album deleted successfully.");
    } catch (error) {
      console.error("Error deleting album from the database:", error);
    }
  }

  async function addRatingToSong(songid, rating, selectedAlbum) {
    try {
      // 1. Query Firestore to retrieve the document containing addedAlbums
      const userDocRef = doc(db, "users", profile.id);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data().addedAlbums;

      const updatedAlbums = userData.map((album) => {
        if (album.id === selectedAlbum.id) {
          const updatedSongs = album.songs.map((song) => {
            if (song.songid === songid) {
              // Update the song's rating
              return {
                ...song,
                rating: rating,
              };
            }
            return song;
          });
          album.songs = updatedSongs;
        }
        return album;
      });

      // Update the Firestore document with the modified addedAlbums array
      await updateDoc(userDocRef, {
        addedAlbums: updatedAlbums,
      });

      // Calculate the album's final rating when all songs are rated
      const albumToUpdate = updatedAlbums.find(
        (album) => album.id === selectedAlbum.id
      );

      const allSongsRated = albumToUpdate.songs.every(
        (song) => song.rating !== null
      );

      if (allSongsRated) {
        const totalRating = albumToUpdate.songs.reduce(
          (acc, song) => acc + song.rating,
          0
        );
        const finalRate = (totalRating / albumToUpdate.songs.length).toFixed(1);

        // Update the album's rating
        albumToUpdate.rating = Number(finalRate);

        // Update the Firestore document with the modified addedAlbums array
        await updateDoc(userDocRef, {
          addedAlbums: updatedAlbums,
        });

        // Update local storage
        const storedAlbums =
          JSON.parse(localStorage.getItem("addedAlbums")) || [];
        const targetAlbum = storedAlbums.find(
          (album) => album.id === selectedAlbum.id
        );
        targetAlbum.rating = finalRate;

        const updatedStoredAlbums = storedAlbums.map((album) =>
          album.id === targetAlbum.id ? targetAlbum : album
        );

        localStorage.setItem(
          "addedAlbums",
          JSON.stringify(updatedStoredAlbums)
        );
        addRatingToAlbum(selectedAlbum.id, Number(finalRate));
        // Call additional functions if needed
        // e.g., addRatingToAlbum(selectedAlbum.id, Number(finalRate));
        // e.g., handleFull();
      }
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  }

  async function reRateSong(id, song, selectedAlbum) {
    console.log(id);
    console.log(song);

    try {
      // 1. Query Firestore to retrieve the document containing addedAlbums
      const userDocRef = doc(db, "users", profile.id);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data().addedAlbums;
      console.log("userData", userData);

      const updatedAlbums = userData.map((album) => {
        if (album.id === selectedAlbum.id) {
          // 3. Update the rating for the matching object
          const updatedSongs = album.songs.map((song) => {
            if (song.songid === id) {
              return {
                ...song,
                rating: null,
              };
            }
            return song;
          });
          album.songs = updatedSongs;
        }
        return album;
      });

      // 4. Update the Firestore document with the modified addedAlbums array
      await updateDoc(userDocRef, {
        addedAlbums: updatedAlbums,
      });
      console.log("mewow");
    } catch (error) {
      console.error("Error adding rating:", error);
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

          album.rating = Number(rating);
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
    const updateAddedInFirestore = async () => {
      if (profileIsFetched) {
        try {
          const userDocRef = doc(db, "users", profile.id);
          if (added.length > 0) {
            await updateDoc(userDocRef, {
              addedAlbums: added,
            });
          }

          console.log("Profile has been fetched");
        } catch (error) {
          console.error("Error updating added albums:", error);
        }
      } else {
        console.log("Profile is still fetching");
      }
    };
    updateAddedInFirestore();
  }, [profileIsFetched, added]);

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
        setProfile(profileData);
        setProfileIsFetched(true);

        // Check if the user document exists in the Firestore database
        const userDocRef = doc(db, "users", profileData.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          console.log("Document data, user exsists:", docSnap.data());
          setAdded(docSnap.data().addedAlbums);
          localStorage.setItem(
            "addedAlbums",
            JSON.stringify(docSnap.data().addedAlbums)
          );
        } else {
          console.log("No such document!");
          await setDoc(doc(db, "users", profileData.id), {
            addedAlbums: added, // if they don't exist
          });
        }
        setLoading(true);
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
    // Create a newAddedAlbum object with basic album information and a null rating
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

    // Fetch songs for the selected album
    async function fetchAlbumSongs() {
      const token = Cookies.get("access_token");
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${selectedAlbum.id}/tracks?market=US`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      // Create an array of songs with null ratings
      const songsWithRatings = data.items.map((song) => ({
        name: song.name,
        rating: null, // Set a null rating for each song
        songid: song.id,
      }));

      // Add the songs array to the newAddedAlbum object
      newAddedAlbum.songs = songsWithRatings;

      // Use the updater function form of setAdded to ensure you're working with the latest state
      const updatedAdded = [...added, newAddedAlbum];
      setAdded(updatedAdded);

      // Store the updatedAdded in local storage
      localStorage.setItem("addedAlbums", JSON.stringify(updatedAdded));

      console.log(updatedAdded);
      console.log(added);
    }

    // Call the fetchAlbumSongs function to fetch songs and add them to the newAddedAlbum
    fetchAlbumSongs();
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
                show={show}
                profile={profile}
                addedAlbums={added}
                userRating={Number(userRating)}
                loading={loading}
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
                setAdded={setAdded}
                loading={loading}
                addRatingToSong={addRatingToSong}
                deleteAlbumFromDatabase={deleteAlbumFromDatabase}
                reRateSong={reRateSong}
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
