import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";
import StarRating from "../components/StarRating";

function MyAlbums({ token, setToken, profile, setUserRating }) {
  const storedAddedAlbums =
    JSON.parse(localStorage.getItem("addedAlbums")) || [];
  // Change "addedAlbum" to "addedAlbums"

  return (
    <div className="myalbum-container">
      {!token ? (
        <Error setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} profile={profile} />
          <main>
            <div className>
              <ul className="mylist-container">
                {storedAddedAlbums.map((album, index) => (
                  <StoredAlbum
                    key={index}
                    album={album}
                    setUserRating={setUserRating}
                    addedAlbums={storedAddedAlbums}
                  />
                ))}
              </ul>
            </div>

            <div>
              <h1>MEOWMEOW</h1>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

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

StoredAlbum.propTypes = {
  index: PropTypes.number.isRequired,
  album: PropTypes.object.isRequired,
  setUserRating: PropTypes.func.isRequired,
  addedAlbums: PropTypes.array.isRequired,
};

MyAlbums.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  profile: PropTypes.any,
  addedAlbums: PropTypes.array.isRequired, // Change "addedAlbum" to "addedAlbums"
  setUserRating: PropTypes.func.isRequired,
};

export default MyAlbums;
