import React from "react";

const Nav = ({ inscr, isMainNav, onTogglePlaylistVisibility, onClose }) =>
  <nav>
    <i className="fas fa-atom"></i>
    <div className="navDiv">
      <span></span>
      <h6>{inscr}</h6>
      <span></span>
    </div>
    {isMainNav && <button className="closeSectionButton" onClick={onTogglePlaylistVisibility}><i className="fas fa-minus"></i></button>}
    <button className="closeSectionButton" onClick={onClose}><i className="fas fa-times"></i></button>
  </nav>;

export default Nav;