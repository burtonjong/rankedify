import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Error from "../components/Error";
import Album from "../components/Album";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function Browse({
  show,
  query,
  setQuery,
  profile,
  setAlbums,
  albums,
  handleAdd,
  addedAlbums,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchAlbums() {
        const token = Cookies.get("access_token");
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${query}&type=album&market=US&limit=12`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`, // Replace with your actual access token
              },
              signal: controller.signal,
            }
          );

          if (!response.ok) {
            throw new Error("Something went wrong with fetching albums");
          }

          const data = await response.json();

          console.log("Fetched Albums:", data.length);

          if (data.albums.items.length === 0) {
            setError("Album cannot be found");
            setAlbums([]); // Clear the albums array when no albums are found
          } else {
            setIsLoading(false);
            setAlbums(data.albums.items);
            setError("");
          }
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setAlbums([]);
        setError("");
        return;
      }

      fetchAlbums();

      return function cleanup() {
        controller.abort();
      };
    },
    [query]
  );

  useEffect(() => {
    console.log("Updated Albums:", albums);
  }, [albums]);

  return (
    <div>
      {!show ? (
        <Error />
      ) : (
        <>
          <Navbar profile={profile} />
          <div className="container-search">
            <Search query={query} setQuery={setQuery} />
          </div>

          <main>
            <div className="album-container">
              {isLoading && <Loader />}

              {!isLoading &&
                !error &&
                albums.map((album, index) => (
                  <Album
                    album={album}
                    index={index} // Pass the index as a prop
                    key={album.id}
                    handleAdd={handleAdd}
                    addedAlbums={addedAlbums}
                  />
                ))}

              {error && <p className="error">{error}</p>}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

Browse.propTypes = {
  show: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  profile: PropTypes.any,
  setAlbums: PropTypes.func.isRequired,
  albums: PropTypes.array.isRequired,
  handleAdd: PropTypes.func.isRequired,
  addedAlbums: PropTypes.array.isRequired,
};

export default Browse;

function Loader() {
  return <p className="loader">Loading...</p>;
}
