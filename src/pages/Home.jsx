import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";

function Home({ token, setToken, profile }) {
  console.log(profile);
  return (
    <div>
      {!token ? (
        <Error setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} profile={profile} />
          <main>
            <div></div>
          </main>
        </>
      )}
    </div>
  );
}

Home.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  profile: PropTypes.any,
};

export default Home;
