import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";
import StoredAlbum from "../components/StoredAlbum";

function MyAlbums({ token, setToken, profile }) {
  const storedAddedAlbums =
    JSON.parse(localStorage.getItem("addedAlbums")) || [];
  // Change "addedAlbum" to "addedAlbums"
  return (
    <div>
      {!token ? (
        <Error setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} profile={profile} />
          <main>
            <ul className="album-list">
              {storedAddedAlbums.map((album, index) => (
                <StoredAlbum key={index} album={album} />
              ))}
            </ul>
          </main>
        </>
      )}
    </div>
  );
}

MyAlbums.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  profile: PropTypes.any,
  addedAlbums: PropTypes.array.isRequired, // Change "addedAlbum" to "addedAlbums"
};

export default MyAlbums;
