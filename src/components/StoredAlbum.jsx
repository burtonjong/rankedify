import PropTypes from "prop-types";

function StoredAlbum({ album, onSelectAlbum }) {
  return (
    <>
      <li onClick={onSelectAlbum}>
        <img className="list-img" src={album.image} />
        <div className="flex row">
          <h4>{album.name}</h4>
          <h4>{album.artist}</h4>
        </div>
      </li>
    </>
  );
}

export default StoredAlbum;

StoredAlbum.propTypes = {
  album: PropTypes.object.isRequired,
  onSelectAlbum: PropTypes.func.isRequired,
};
