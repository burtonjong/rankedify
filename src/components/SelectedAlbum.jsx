import PropTypes from "prop-types";
import StarRating from "./StarRating";
import SongStarRating from "./SongStarRating";
import { useState } from "react";

function SelectedAlbum({
  selectedAlbum,
  setUserRating,
  selected,
  addRatingToAlbum,
  addedAlbums,
  setAdded,
  setSelected,
}) {
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

  console.log(selectedAlbum.songs);

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
            <h1>You rated this album a {selectedAlbum.rating}</h1>
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
              <SongRating song={song} key={song.id} />
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

function SongRating(song, key) {
  const [songRating, setSongRating] = useState(null);

  const item = song.song;
  console.log(item);

  return (
    <>
      <h1>{item.name}</h1>
      <span>
        <SongStarRating maxRating={10} id={key} setSongRating={setSongRating} />
      </span>
    </>
  );
}

SelectedAlbum.propTypes = {
  selectedAlbum: PropTypes.any,
  setUserRating: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  addRatingToAlbum: PropTypes.func.isRequired,
  addedAlbums: PropTypes.array.isRequired,
  setAdded: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
};
