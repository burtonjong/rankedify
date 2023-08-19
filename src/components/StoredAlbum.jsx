import PropTypes from "prop-types";
import StarRating from "../components/StarRating";

function StoredAlbum({ index, album, setUserRating }) {
  console.log(album.id);
  return (
    <li key={index} className="mylist-info">
      <img className="album-img" src={album.image} />
      <div className="flex column">
        <h2 className="ta-center">{album.name}</h2>
        <h2 className="ta-center">{album.artist}</h2>
        {localStorage.getItem(album.id) ? (
          <h1>You rated this album a {localStorage.getItem(album.id)}</h1>
        ) : (
          <StarRating
            maxRating={10}
            size={24}
            onSetRating={setUserRating}
            id={album.id}
          />
        )}
      </div>
    </li>
  );
}

export default StoredAlbum;

StoredAlbum.propTypes = {
  index: PropTypes.number.isRequired,
  album: PropTypes.object.isRequired,
  setUserRating: PropTypes.func.isRequired,
  addedAlbums: PropTypes.array.isRequired,
};
