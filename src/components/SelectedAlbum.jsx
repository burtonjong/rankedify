import PropTypes from "prop-types";
import StarRating from "./StarRating";

function SelectedAlbum({ selectedAlbum, setUserRating, selected }) {
  console.log(selectedAlbum);

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
          {localStorage.getItem(selectedAlbum.id) ? (
            <h1>
              You rated this album a {localStorage.getItem(selectedAlbum.id)}
            </h1>
          ) : (
            <StarRating
              maxRating={10}
              size={38}
              onSetRating={setUserRating}
              id={selectedAlbum.id}
            />
          )}
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
};
