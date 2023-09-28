import PropTypes from "prop-types";

function AlbumSearch({ query1, setQuery1 }) {
  return (
    <input
      className="search2"
      type="text"
      placeholder="Search albums..."
      value={query1}
      onChange={(e) => setQuery1(e.target.value)}
    />
  );
}

AlbumSearch.propTypes = {
  query1: PropTypes.string.isRequired,
  setQuery1: PropTypes.func.isRequired,
};

export default AlbumSearch;
