import { useNavigate } from "react-router";
import PropTypes from "prop-types";

function Error({ setToken }) {
  const navigate = useNavigate();

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");

    navigate("/");
  };
  return (
    <div>
      <div className="failed">
        <a href="#" onClick={logout}>
          <h1>Invalid token.</h1>
          <h1>Please try and login again.</h1>
        </a>
      </div>
    </div>
  );
}

Error.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Error;
