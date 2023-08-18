import PropTypes from "prop-types";

function Albums({ album }) {
  return (
    <li className="album-list">
      <div className="album-desc">
        <img className="album-img" src={album.images[0].url} alt={``} />
        <h2 className="ta-center">{album.name}</h2>
      </div>
    </li>
  );
}

Albums.propTypes = {
  album: PropTypes.any,
};

export default Albums;
