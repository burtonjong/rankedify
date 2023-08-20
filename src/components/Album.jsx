import PropTypes from "prop-types";

function Albums({ album, handleAdd, addedAlbums }) {
  const isAlbumAdded = addedAlbums.some(
    (addedAlbum) => addedAlbum.id === album.id
  );
  if (album.album_type === "album") {
    return (
      <li className="album-list">
        <div className="album-desc">
          <img className="album-img" src={album.images[0].url} alt={``} />
          <h2 className="ta-center">{album.name}</h2>
          {isAlbumAdded ? (
            <p className="ta-center">✔️ added</p>
          ) : (
            <button className="btn-add" onClick={() => handleAdd(album)}>
              Add to list
            </button>
          )}
        </div>
      </li>
    );
  }
}

Albums.propTypes = {
  album: PropTypes.any,
  handleAdd: PropTypes.func.isRequired,
  clicked: PropTypes.bool.isRequired,
  addedAlbums: PropTypes.array.isRequired,
};

export default Albums;
