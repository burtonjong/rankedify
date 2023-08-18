import PropTypes from "prop-types";

function Albums({ album, handleAdd }) {
  return (
    <li className="album-list">
      <div className="album-desc">
        <img className="album-img" src={album.images[0].url} alt={``} />
        <h2 className="ta-center">{album.name}</h2>
        <button className="btn-add" onClick={() => handleAdd(album)}>
          Add to list
        </button>
      </div>
    </li>
  );
}

Albums.propTypes = {
  album: PropTypes.any,
  handleAdd: PropTypes.func.isRequired,
};

export default Albums;
