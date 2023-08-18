import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Error from "../components/Error";
import Album from "../components/Album";
import { useEffect } from "react";

function Browse({
  token,
  setToken,
  query,
  setQuery,
  profile,
  setAlbums,
  albums,
}) {
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchAlbums() {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${query}&type=album&limit=12`,
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

          console.log("Fetched Albums:", data);

          // Adjust the property name based on the actual response structure
          if (data.Response === "False") {
            throw new Error("Album not Found");
          }

          // Adjust the property name and structure based on the actual response
          setAlbums(data.albums.items);
          console.log(albums);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
          }
        }
      }

      if (query.length < 3) {
        setAlbums([]);
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
      {!token ? (
        <Error setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} profile={profile} />
          <div className="container-search">
            <Search query={query} setQuery={setQuery} />
          </div>

          <main>
            <div className="album-container">
              {albums.map((album) => (
                <Album album={album} key={album.id} />
              ))}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

Browse.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  profile: PropTypes.any,
  setAlbums: PropTypes.func.isRequired,
  albums: PropTypes.array.isRequired,
};

export default Browse;
