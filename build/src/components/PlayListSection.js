import React from "react";
import PlayList from "./PlayList";
import Footer from "./FooterComponents";
import Nav from "./Nav";

const PlayListSection = (props) =>
  <div className="section" style={{ height: `${props.height}px` }}>
    <Nav
      inscr={props.inscr}
      onClose={props.onClose}
    />
    <PlayList
      playerHeight={props.playerHeight}
      songList={props.songList}
      playSong={props.playSong}
      toggleSelection={props.toggleSelection}
      currentSong={props.currentSong}
    />
    <Footer
      resizeList={props.resizeList}
      isRemPopupExpanded={props.isRemPopupExpanded}
      isSelPopupExpanded={props.isSelPopupExpanded}
      isSortPopupExpanded={props.isSortPopupExpanded}
      currentTrackPosition={props.currentTrackPosition}
      currentTrackDuration={props.currentTrackDuration}
      buttonsDisabled={props.buttonsDisabled}
      playerButtonFuncs={props.playerButtonFuncs}
      popupButtonFuncs={props.popupButtonFuncs}
    />
  </div>

export default PlayListSection;