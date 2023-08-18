import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";

function Navbar({ setToken, profile }) {
  const navigate = useNavigate();

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <ul className="nav-ul">
          <li className="logo">
            <Link to="/home" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  fill="#91C8E4"
                  d="M448 64c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                />
              </svg>
              <span className="link-text">Rankedify</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/home" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                  className="svg-hover"
                  fill="#91C8E4"
                  d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
                />
              </svg>
              <span className="link-text">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/myalbums" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  className="svg-hover"
                  fill="#91C8E4"
                  d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"
                />
              </svg>
              <span className="link-text">My List</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/browse" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  className="svg-hover"
                  fill="#91C8E4"
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                />
              </svg>
              <span className="link-text">Browse</span>
            </Link>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link profile-image" onClick={logout}>
              {profile && profile.images && profile.images.length > 0 && (
                <img
                  className="svg-hover"
                  src={profile.images[0].url}
                  alt="Profile"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                />
              )}

              <span className="link-text">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

Navbar.propTypes = {
  setToken: PropTypes.func.isRequired,
  profile: PropTypes.any,
};

export default Navbar;
