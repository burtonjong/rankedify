import PropTypes from "prop-types";

import SongStarRating from "./SongStarRating";
import { useEffect, useState } from "react";

function SelectedAlbum({
  selectedAlbum,
  selected,
  addedAlbums,
  setAdded,
  setSelected,
  addRatingToSong,
  addRatingToAlbum,
  deleteAlbumFromDatabase,
}) {
  const [songRating, setSongRating] = useState(null);
  const [ratingKey, setRatingKey] = useState(0);

  const handleFull = () => {
    setRatingKey(ratingKey + 1);
  };

  useEffect(() => {
    const songs = selectedAlbum.songs;
    if (songs) {
      const nullCheck = songs.every((song) => song.rating !== null);
      if (nullCheck) {
        const totalRating = songs.reduce((acc, song) => {
          return acc + song.rating;
        }, 0);
        const finalRate = (totalRating / songs.length).toFixed(1);
        const stateAlbum = addedAlbums.find(
          (album) => album.id === selectedAlbum.id
        );
        stateAlbum.rating = finalRate;

        const storedAlbums =
          JSON.parse(localStorage.getItem("addedAlbums")) || {};
        const targetAlbum = storedAlbums.find(
          (album) => album.id === selectedAlbum.id
        );
        targetAlbum.rating = finalRate; // Replace newRating with the new rating value

        // Update the storedAlbums array in local storage
        const updatedStoredAlbums = storedAlbums.map((album) =>
          album.id === targetAlbum.id ? targetAlbum : album
        );

        // Save the updated storedAlbums array back to local storage
        localStorage.setItem(
          "addedAlbums",
          JSON.stringify(updatedStoredAlbums)
        );

        // Log the updated object
        console.log(updatedStoredAlbums);

        addRatingToAlbum(selectedAlbum.id, Number(finalRate));
        handleFull();
      }
    } else {
      return;
    }
  }, [songRating, selectedAlbum]);

  // Find the album in addedAlbums by its id
  const albumInAddedAlbums = addedAlbums.find(
    (album) => album.id === selectedAlbum.id
  );

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

  return (
    <>
      {selected ? (
        <div>
          <img
            className="selected-image"
            src={selectedAlbum.image}
            alt={`${selectedAlbum.name}'s album cover`}
          />
          <h1>{selectedAlbum.name}</h1>
          {albumInAddedAlbums && albumInAddedAlbums.rating ? (
            <h1 key={ratingKey}>
              You rated this album a {selectedAlbum.rating}
            </h1>
          ) : (
            <span>Rate all albums first to see your final rating</span>
          )}
          <h1 onClick={onDelete}>Remove this album</h1>
          <div>
            {selectedAlbum.songs.map((song) => (
              <SongRating
                song={song}
                addedAlbums={addedAlbums}
                selectedAlbum={selectedAlbum}
                addRatingToSong={addRatingToSong}
                key={song.songid}
                setSongRating={setSongRating}
              />
            ))}
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
  setSongRating,
  songKey,
}) {
  const [ratingKey, setRatingKey] = useState(songKey);
  const handleRatingChange = () => {
    setRatingKey(ratingKey + "a");
  };
  return (
    <>
      <h1>{song.name}</h1>
      {song.rating !== null ? (
        <span key={ratingKey}>You rated this song a {song.rating}</span>
      ) : (
        <span key={ratingKey}>
          <SongStarRating
            maxRating={10}
            songid={song.songid}
            setSongRating={setSongRating}
            addedAlbums={addedAlbums}
            selectedAlbum={selectedAlbum}
            addRatingToSong={addRatingToSong}
            handleRatingChange={handleRatingChange}
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
  setSongRating: PropTypes.func.isRequired,
  songKey: PropTypes.any,
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
};
