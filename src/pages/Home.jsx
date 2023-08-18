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
            <div>
              <h1>MEOW</h1>
              {profile && profile.images && profile.images.length > 0 && (
                <img
                  src={profile.images[0].url}
                  alt="Profile"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                />
              )}
              {profile && profile.display_name && (
                <p>Email: {profile.display_name}</p>
              )}
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
  profile: PropTypes.any,
};

export default Home;
