import { useNavigate } from "react-router";

function Error() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };
  return (
    <div>
      <div className="failed">
        <a href="#" onClick={logout}>
          <div className="error-message">
            <h1 className="ta-center">Invalid token.</h1>
            <h1>Please try and login again.</h1>
          </div>
        </a>
      </div>
    </div>
  );
}

export default Error;
