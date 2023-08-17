import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";

function Home({ token, setToken }) {
  return (
    <div>
      {!token ? (
        <Error setToken={setToken} />
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

Home.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
};

export default Home;
