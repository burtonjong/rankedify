import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Error from "../components/Error";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function Home({ token, setToken, profile, addedAlbums }) {
  const track = document.getElementById("image-track");

  const handleOnDown = (e) => (track.dataset.mouseDownAt = e.clientY);

  const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
  };

  const handleOnMove = (e) => {
    if (track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientY,
      maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100,
      nextPercentageUnconstrained =
        parseFloat(track.dataset.prevPercentage) + percentage,
      nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.percentage = nextPercentage;

    track.animate(
      {
        transform: `translate(-50%, ${nextPercentage}%)`,
      },
      { duration: 1200, fill: "forwards" }
    );

    for (const image of track.getElementsByClassName("image")) {
      image.animate(
        {
          objectPosition: `50% ${100 + nextPercentage}%`,
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

  const [hoveredIndex, setHoveredIndex] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [hovered, setHovered] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setHovered(false);
  };

  const handleImageClick = (index) => {
    setClickedIndex(index);
    if (index === clickedIndex) {
      setClickedIndex(null);
    }
  };

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      setClickedIndex(null);
    }
  }, [inView]);

  return (
    <>
      {!token ? (
        <Error setToken={setToken} />
      ) : (
        <>
          <div className="bg flex ai-center">
            {inView ? null : (
              <img
                draggable="false  "
                className="blur user-select"
                src={addedAlbums[clickedIndex]?.image}
                alt={addedAlbums[clickedIndex]?.name}
              />
            )}
          </div>

          <Navbar setToken={setToken} profile={profile} />
          <div id="image-track" data-mouse-down-at="0" data-prev-percentage="0">
            {addedAlbums.length > 0 ? (
              <>
                <h1 className="image-title" ref={ref}>
                  Check out your top 10.
                </h1>
                <h2 className="image-title-small">Scroll down.</h2>
                {addedAlbums.slice(0, 10).map((album, index) => (
                  <>
                    <div className="image-info">
                      <img
                        className={`image user-select ${
                          clickedIndex === index ? "clicked " : ""
                        } ${hoveredIndex === index ? "hovered" : ""}`}
                        key={index}
                        src={album.image}
                        alt={album.name}
                        draggable="false"
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleImageClick(index)}
                      />
                      {clickedIndex === index && (
                        <>
                          <div className="flex column">
                            <h1>You rated this album a 10</h1>
                            <h2>Your top 3 songs:</h2>
                            <ul>
                              <li>1. Meow</li>
                              <li>2. Woof</li>
                              <li>3. Bark</li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ))}
              </>
            ) : (
              <h1 className="ta-center image-title">
                You dont have any albums yet.
              </h1>
            )}
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
