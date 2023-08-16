import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home({ token, setToken }) {
  const navigate = useNavigate();

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div>
      {token ? (
        <div className="failed">
          <a href="#" onClick={logout}>
            <h1>Invalid token.</h1>
            <h1>Please try and login again.</h1>
          </a>
        </div>
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
