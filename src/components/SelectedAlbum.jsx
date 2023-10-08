import PropTypes from "prop-types";

import SongStarRating from "./SongStarRating";
import { useState, useEffect } from "react";

function SelectedAlbum({
  selectedAlbum,
  selected,
  addedAlbums,
  setAdded,
  setSelected,
  addRatingToSong,
  deleteAlbumFromDatabase,
  reRateSong,
  // eslint-disable-next-line react/prop-types
  setSelectedAlbum,
}) {
  const [songRating, setSongRating] = useState(null);

  const [editKey, setEditKey] = useState(0);

  // Find the album in addedAlbums by its id
  const albumInAddedAlbums = addedAlbums.find(
    (album) => album.id === selectedAlbum.id
  );

  console.log(selectedAlbum);

  async function onDelete() {
    try {
      // Your code to delete the album from the database (replace with your actual database operation)
      await deleteAlbumFromDatabase(selectedAlbum.id);

      // If the database operation succeeds, update local storage and state
      const storedAlbums =
        JSON.parse(localStorage.getItem("addedAlbums")) || {};
      const updatedStoredAlbums = storedAlbums.filter(
        (album) => album.id !== selectedAlbum.id
      );

      localStorage.setItem("addedAlbums", JSON.stringify(updatedStoredAlbums));
      setAdded(updatedStoredAlbums);
      setSelected(false);
    } catch (error) {
      // Handle any errors that occur during database deletion
      console.error("Error deleting album from the database:", error);
      // You might want to show an error message to the user or retry the operation
    }
  }

  useEffect(() => {
    if (selectedAlbum.rating) {
      console.log(selectedAlbum.rating);
    }
  }, [selectedAlbum]);

  return (
    <>
      {selected ? (
        <div className="flex column ai-center autofit">
          <img
            className="selected-image"
            src={selectedAlbum.image}
            alt={`${selectedAlbum.name}'s album cover`}
          />
          <div className="flex row ai-center gap3 jc-center">
            <h1>{selectedAlbum.name}</h1>
            <span className="infobox-box">
              <a
                href={selectedAlbum.external_urls}
                target="_blank"
                rel="noreferrer"
                className="flex row gap-p5"
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="white"
                    d="m229.66 109.66l-48 48a8 8 0 0 1-11.32-11.32L204.69 112H165a88 88 0 0 0-85.23 66a8 8 0 0 1-15.5-4A103.94 103.94 0 0 1 165 96h39.71l-34.37-34.34a8 8 0 0 1 11.32-11.32l48 48a8 8 0 0 1 0 11.32ZM192 208H40V88a8 8 0 0 0-16 0v120a16 16 0 0 0 16 16h152a8 8 0 0 0 0-16Z"
                  />
                </svg>
                <h3 className="no-margin"> Listen on Spotify</h3>
              </a>
            </span>
          </div>

          {albumInAddedAlbums && albumInAddedAlbums.rating ? (
            <h2>You rated this album a {selectedAlbum.rating}</h2>
          ) : (
            <h2>Rate all albums first to see your final rating</h2>
          )}
          <button className="notsowide">
            <h3 className="infobox-box jc-center" onClick={onDelete}>
              Remove this album
            </h3>
          </button>

          <div className="song-container">
            <ul>
              {selectedAlbum.songs.map((song) => (
                <>
                  <li className="song-list flex column ai-center">
                    <SongRating
                      song={song}
                      addedAlbums={addedAlbums}
                      selectedAlbum={selectedAlbum}
                      addRatingToSong={addRatingToSong}
                      key={song.songid}
                      setSongRating={setSongRating}
                      rating={songRating}
                      reRateSong={reRateSong}
                      editKey={editKey}
                      setEditKey={setEditKey}
                      setSelectedAlbum={setSelectedAlbum}
                    />
                  </li>
                </>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="alternate-text">
          <h1>Choose an album to rate.</h1>
        </div>
      )}
    </>
  );
}

export default SelectedAlbum;

function SongRating({
  song,
  addedAlbums,
  selectedAlbum,
  addRatingToSong,
  songKey,
  reRateSong,
  editKey,
  setEditKey,
  // eslint-disable-next-line react/prop-types
  setSelectedAlbum,
}) {
  const [ratingKey, setRatingKey] = useState(songKey);

  const handleRatingChange = () => {
    setRatingKey(ratingKey + "a");
  };

  const handleClick = () => {
    setEditKey(editKey + 1);

    const updatedSelectedAlbum = { ...selectedAlbum }; // Create a shallow copy of the selectedAlbum
    const targetSongIndex = updatedSelectedAlbum.songs.findIndex(
      (songk) => songk.songid === song.songid
    );

    if (targetSongIndex !== -1) {
      // If the song is found in the selectedAlbum's songs array
      updatedSelectedAlbum.songs[targetSongIndex].rating = null;
      setSelectedAlbum(updatedSelectedAlbum); // Update the state with the modified selectedAlbum
    }

    console.log(selectedAlbum);

    const storedAlbums = JSON.parse(localStorage.getItem("addedAlbums")) || {};
    const localStorageTarget = storedAlbums
      .find((album) => album.id === selectedAlbum.id)
      ?.songs.find((songk) => songk.songid === song.songid);
    console.log(localStorageTarget);
    localStorageTarget.rating = null;
    console.log(localStorageTarget);

    // Update the storedAlbums array in local storage
    const updatedStoredAlbums = storedAlbums.map((album) => {
      if (album.id === selectedAlbum.id) {
        const updatedSongs = album.songs.map((song) => {
          // Changed 'songk' to 'song'
          if (song.songid === localStorageTarget.songid) {
            return {
              ...song,
              rating: null,
            };
          }
          return song;
        });

        return {
          ...album,
          songs: updatedSongs,
        };
      }
      return album;
    });

    console.log(updatedStoredAlbums);

    // Save the updated storedAlbums array back to local storage
    localStorage.setItem("addedAlbums", JSON.stringify(updatedStoredAlbums));
    reRateSong(song.songid, song, selectedAlbum);
  };

  return (
    <>
      <h2>{song.name}</h2>
      {song.rating !== null ? (
        <>
          <div className="flex row other">
            <span key={ratingKey}>You rated this song a {song.rating}</span>
            <button className="infobox-box jc-center">
              <span onClick={handleClick}> Edit</span>
            </button>
          </div>
        </>
      ) : (
        <span key={ratingKey}>
          <SongStarRating
            maxRating={10}
            size={36}
            songid={song.songid}
            addedAlbums={addedAlbums}
            selectedAlbum={selectedAlbum}
            addRatingToSong={addRatingToSong}
            handleRatingChange={handleRatingChange}
            key={editKey}
            setSelectedAlbum={setSelectedAlbum}
          />
        </span>
      )}
    </>
  );
}

SongRating.propTypes = {
  song: PropTypes.any,
  key: PropTypes.any,
  addedAlbums: PropTypes.any,
  selectedAlbum: PropTypes.any,
  addRatingToSong: PropTypes.func.isRequired,
  songKey: PropTypes.any,
  reRateSong: PropTypes.func.isRequired,
  editKey: PropTypes.any,
  setEditKey: PropTypes.func.isRequired,
  rating: PropTypes.any,
};

SelectedAlbum.propTypes = {
  selectedAlbum: PropTypes.any,
  setUserRating: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  addRatingToAlbum: PropTypes.func.isRequired,
  addedAlbums: PropTypes.array.isRequired,
  setAdded: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  addRatingToSong: PropTypes.func.isRequired,
  deleteAlbumFromDatabase: PropTypes.func.isRequired,
  reRateSong: PropTypes.func.isRequired,
};
