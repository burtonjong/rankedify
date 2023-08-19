import PropTypes from "prop-types";
import StarRating from "./StarRating";

function SelectedAlbum({ selectedAlbum, setUserRating }) {
  console.log(selectedAlbum);
  return (
    <h1>
      {selectedAlbum.name}
      {localStorage.getItem(selectedAlbum.id) ? (
        <p>You rated this album a {localStorage.getItem(selectedAlbum.id)}</p>
      ) : (
        <StarRating
          maxRating={10}
          size={24}
          onSetRating={setUserRating}
          id={selectedAlbum.id}
        />
      )}
    </h1>
  );
}

export default SelectedAlbum;

SelectedAlbum.propTypes = {
  selectedAlbum: PropTypes.any,
  setUserRating: PropTypes.func.isRequired,
};
