import PropTypes from "prop-types";
import StarRating from "../components/StarRating";

function StoredAlbum({ album, setUserRating, onSelectAlbum }) {
  return (
    <>
      <li className="mylist-info" onClick={onSelectAlbum}>
        <img className="list-img" src={album.image} />
        <div className="flex column">
          <h4 className="ta-center">{album.name}</h4>
          <h4 className="ta-center">{album.artist}</h4>
        </div>
        <div>
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
    </>
  );
}

export default StoredAlbum;

StoredAlbum.propTypes = {
  album: PropTypes.object.isRequired,
  setUserRating: PropTypes.func.isRequired,
  addedAlbums: PropTypes.array.isRequired,
  onSelectAlbum: PropTypes.func.isRequired,
};
