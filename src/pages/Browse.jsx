import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Error from "../components/Error";

function Browse({ token, setToken, query, setQuery, profile }) {
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
            <div>
              <h1>MEOW</h1>
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
};

export default Browse;
