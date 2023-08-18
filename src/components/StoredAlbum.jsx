import PropTypes from "prop-types";

function StoredAlbum({ index, album }) {
  return (
    <li key={index} className="album-list">
      <div className="album-desc">
        <img className="album-img" src={album.image} />
        <h2 className="ta-center">{album.name}</h2>
        <h2 className="ta-center">{album.artist}</h2>
      </div>
    </li>
  );
}

export default StoredAlbum;

StoredAlbum.propTypes = {
  index: PropTypes.number.isRequired,
  album: PropTypes.object.isRequired,
};
