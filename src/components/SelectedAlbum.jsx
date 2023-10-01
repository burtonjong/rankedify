import PropTypes from "prop-types";
import StarRating from "./StarRating";
import SongStarRating from "./SongStarRating";
import { useEffect, useState } from "react";

function SelectedAlbum({
  selectedAlbum,
  setUserRating,
  selected,
  addRatingToAlbum,
  addedAlbums,
  setAdded,
  setSelected,
  addRatingToSong,
}) {
  const [songRating, setSongRating] = useState(null);
  const [finalRating, setFinalRating] = useState(null);

  useEffect(() => {
    const songs = selectedAlbum.songs;
    const nullCheck = songs.every((song) => song.rating !== null);
    if (nullCheck) {
      const totalRating = songs.reduce((acc, song) => {
        return acc + song.rating;
      }, 0);
      const finalRate = (totalRating / songs.length).toFixed(1);
      setFinalRating(finalRate);
    } else {
      return;
    }
  }, [songRating]);

  // Find the album in addedAlbums by its id
  const albumInAddedAlbums = addedAlbums.find(
    (album) => album.id === selectedAlbum.id
  );

  function onDelete() {
    const storedAlbums = JSON.parse(localStorage.getItem("addedAlbums")) || {};

    // Remove the album from the storedAlbums array
    const updatedStoredAlbums = storedAlbums.filter(
      (album) => album.id !== selectedAlbum.id
    );
    console.log(updatedStoredAlbums);
    localStorage.setItem("addedAlbums", JSON.stringify(updatedStoredAlbums));
    setAdded(updatedStoredAlbums);
    setSelected(false);
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
            <h1>You rated this album a {finalRating}</h1>
          ) : (
            <StarRating
              maxRating={10}
              size={38}
              onSetRating={setUserRating}
              id={selectedAlbum.id}
              addRatingToAlbum={addRatingToAlbum}
              addedAlbums={addedAlbums}
            />
          )}
          <h1 onClick={onDelete}>Remove this album</h1>
          <div>
            {selectedAlbum.songs.map((song) => (
              <SongRating
                song={song}
                addedAlbums={addedAlbums}
                selectedAlbum={selectedAlbum}
                addRatingToSong={addRatingToSong}
                key={song.id}
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
}) {
  return (
    <>
      <h1>{song.name}</h1>
      {song.rating ? (
        <span>You rated this song a {song.rating}</span>
      ) : (
        <span>
          <SongStarRating
            maxRating={10}
            songid={song.songid}
            setSongRating={setSongRating}
            addedAlbums={addedAlbums}
            selectedAlbum={selectedAlbum}
            addRatingToSong={addRatingToSong}
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
};
