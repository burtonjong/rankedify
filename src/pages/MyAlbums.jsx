import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";
import StoredAlbum from "../components/StoredAlbum";
import SelectedAlbum from "../components/SelectedAlbum";
import AlbumSearch from "../components/AlbumSearch";
import { useEffect, useState } from "react";

function MyAlbums({
  show,
  profile,
  setUserRating,
  addRatingToAlbum,
  addedAlbums,
  setAdded,
}) {
  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [selected, setSelected] = useState(false);
  const [query1, setQuery1] = useState("");

  const handleClick = (album) => {
    setSelectedAlbum(album);
    setSelected(true);
    console.log(album);
  };

  const [filteredAlbums, setFilteredAlbums] = useState(addedAlbums);

  // Use useEffect to filter the albumNames array based on the query
  useEffect(() => {
    if (query1.length > 3) {
      const filtered = addedAlbums.filter(
        (album) =>
          album.name.toLowerCase().includes(query1.toLowerCase()) ||
          album.artist.toLowerCase().includes(query1.toLowerCase())
      );
      console.log(filtered);
      setFilteredAlbums(filtered);
    }
    if (query1.length < 3) {
      setFilteredAlbums(addedAlbums);
    }
  }, [query1]);

  return (
    <div className="myalbum-container">
      {!show ? (
        <Error />
      ) : (
        <>
          <Navbar profile={profile} />
          <main className="box-container">
            <div className="box">
              <AlbumSearch query1={query1} setQuery1={setQuery1} />
              <ul className="list list-albums">
                {filteredAlbums.map((album, index) => (
                  <StoredAlbum
                    key={index}
                    album={album}
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
                setSelected={setSelected}
                setAdded={setAdded}
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
  setAdded: PropTypes.func.isRequired,
};

export default MyAlbums;
