import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import MyAlbums from "./pages/MyAlbums";
import Login from "./pages/Login";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/myalbums" element={<MyAlbums />} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
