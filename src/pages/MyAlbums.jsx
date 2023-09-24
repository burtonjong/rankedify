import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";
import StoredAlbum from "../components/StoredAlbum";
import SelectedAlbum from "../components/SelectedAlbum";
import { useState } from "react";

function MyAlbums({
  show,
  profile,
  setUserRating,
  addRatingToAlbum,
  addedAlbums,
}) {
  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [selected, setSelected] = useState(false);

  const handleClick = (album) => {
    setSelectedAlbum(album);
    setSelected(true);
    console.log(addedAlbums);
  };

  return (
    <div className="myalbum-container">
      {!show ? (
        <Error />
      ) : (
        <>
          <Navbar profile={profile} />
          <main className="box-container">
            <div className="box">
              <ul className="list list-albums">
                {addedAlbums.map((album, index) => (
                  <StoredAlbum
                    key={index}
                    album={album}
                    setUserRating={setUserRating}
                    addedAlbums={addedAlbums}
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
                addRatingToAlbum={addRatingToAlbum}
                addedAlbums={addedAlbums}
              />
            </div>
          </main>
        </>
      )}
    </div>
  );
}

MyAlbums.propTypes = {
  show: PropTypes.bool.isRequired,
  profile: PropTypes.any,
  setUserRating: PropTypes.func.isRequired,
  addRatingToAlbum: PropTypes.func.isRequired,
  addedAlbums: PropTypes.array.isRequired,
};

export default MyAlbums;
