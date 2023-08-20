import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";
import StoredAlbum from "../components/StoredAlbum";
import SelectedAlbum from "../components/SelectedAlbum";
import { useState, useEffect } from "react";

function MyAlbums({ token, setToken, profile, setUserRating }) {
  const storedAddedAlbums =
    JSON.parse(localStorage.getItem("addedAlbums")) || [];

  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [selected, setSelected] = useState(false);

  const handleClick = (album) => {
    setSelectedAlbum(album);
    setSelected(true);
  };

  useEffect(() => {}, [selectedAlbum]);

  return (
    <div className="myalbum-container">
      {!token ? (
        <Error setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} profile={profile} />
          <main className="box-container">
            <div className="box">
              <ul className="list list-albums">
                {storedAddedAlbums.map((album, index) => (
                  <StoredAlbum
                    key={index}
                    album={album}
                    setUserRating={setUserRating}
                    addedAlbums={storedAddedAlbums}
                    onSelectAlbum={() => handleClick(album)}
                  />
                ))}
              </ul>
            </div>

            <div className="box-selected">
              <SelectedAlbum
                selectedAlbum={selectedAlbum}
                setUserRating={setUserRating}
                selected={selected}
              />
            </div>
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
  setUserRating: PropTypes.func.isRequired,
};

export default MyAlbums;
