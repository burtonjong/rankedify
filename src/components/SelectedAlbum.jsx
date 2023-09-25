import PropTypes from "prop-types";
import StarRating from "./StarRating";

function SelectedAlbum({
  selectedAlbum,
  setUserRating,
  selected,
  addRatingToAlbum,
  addedAlbums,
}) {
  // Find the album in addedAlbums by its id
  const albumInAddedAlbums = addedAlbums.find(
    (album) => album.id === selectedAlbum.id
  );

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
            <h1>You rated this album a {albumInAddedAlbums.rating}</h1>
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
          <h1>Remove this album</h1>
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

SelectedAlbum.propTypes = {
  selectedAlbum: PropTypes.any,
  setUserRating: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  addRatingToAlbum: PropTypes.func.isRequired,
  addedAlbums: PropTypes.array.isRequired,
};
