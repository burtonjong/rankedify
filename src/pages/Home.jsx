import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";

function Home({ token, setToken, profile, addedAlbums }) {
  const track = document.getElementById("image-track");

  const handleOnDown = (e) => (track.dataset.mouseDownAt = e.clientX);

  const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
  };

  const handleOnMove = (e) => {
    if (track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
      maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100,
      nextPercentageUnconstrained =
        parseFloat(track.dataset.prevPercentage) + percentage,
      nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.percentage = nextPercentage;

    track.animate(
      {
        transform: `translate(${nextPercentage}%, -50%)`,
      },
      { duration: 1200, fill: "forwards" }
    );

    for (const image of track.getElementsByClassName("image")) {
      image.animate(
        {
          objectPosition: `${100 + nextPercentage}% 50%`,
        },
        { duration: 1200, fill: "forwards" }
      );
    }
  };

  /* -- Had to add extra lines for touch events -- */

  window.onmousedown = (e) => handleOnDown(e);

  window.ontouchstart = (e) => handleOnDown(e.touches[0]);

  window.onmouseup = (e) => handleOnUp(e);

  window.ontouchend = (e) => handleOnUp(e.touches[0]);

  window.onmousemove = (e) => handleOnMove(e);

  window.ontouchmove = (e) => handleOnMove(e.touches[0]);

  /* -- Had to add extra lines for touch events -- */

  window.onmousedown = (e) => handleOnDown(e);

  window.ontouchstart = (e) => handleOnDown(e.touches[0]);

  window.onmouseup = (e) => handleOnUp(e);

  window.ontouchend = (e) => handleOnUp(e.touches[0]);

  window.onmousemove = (e) => handleOnMove(e);

  window.ontouchmove = (e) => handleOnMove(e.touches[0]);

  console.log(profile);
  return (
    <>
      {!token ? (
        <Error setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} profile={profile} />
          <div id="image-track" data-mouse-down-at="0" data-prev-percentage="0">
            {addedAlbums.slice(0, 10).map((album, index) => (
              <img
                className="image"
                key={index}
                src={album.image}
                alt={album.name}
                draggable="false"
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

Home.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  profile: PropTypes.any,
  addedAlbums: PropTypes.array.isRequired,
};

export default Home;
