import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";

function MyAlbums({ token, setToken, profile }) {
  return (
    <div>
      {!token ? (
        <Error setToken={setToken} profile={profile} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <main>
            <div>
              <h1>MEOW</h1>
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
};

export default MyAlbums;
