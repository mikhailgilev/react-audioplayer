import React from "react";
import PlayerButtons from "./PlayerButtons";
import Nav from "./Nav";

const MainSection = (props) =>
  <div className="section" id="main-section">
    <Nav
      inscr={props.inscr}
      onClose={props.onClose}
      isMainNav={props.isMainNav}
      onTogglePlaylistVisibility={props.onTogglePlaylistVisibility}
    />
    <div id="main">
      <div id="upperPart">
        <div id="screen">
          <div id="trackStatusDiv">
            <i className={`fas ${props.status === "stopped" ? "fa-stop" : (props.status === "paused" ? "fa-pause" : "fa-play")} blackBgInscr trackStatusIcon`}></i>
          </div>
          <div id="currentTrackTimeDiv">
            <p className="blackBgInscr">{`${props.currentTrackPosition}`}</p>
          </div>
        </div>
        <div id="rightUpperPart">
          {props.children}
          <input type="range" min="1" max="100" value={props.currentVolume} step="1" title="Volume" id="volumeRange" onInput={props.onChangeVolume} />
          <input type="range" min="1" max="100" value={props.currentBalance} step="1" title="Balance" id="balanceRange" onInput={props.onChangeBalance} />
        </div>
      </div>
      <div id="track">
        <input type="range" min="1" max="100" value={props.currentSliderValue} step="1" title="Playback position" className="slider" id="trackPosition" onInput={props.onRewind} />
      </div>
      <div id="buttons">
        <PlayerButtons
          buttonsDisabled={props.buttonsDisabled}
          playerButtonFuncs={props.playerButtonFuncs}
          divId="playbackControlButtons"
        />
        <div id="additionalButtons">
          <button id="shuffleButton" title="Random order" onClick={props.toggleRandomOrder}>SHUFFLE</button>
          <button onClick={props.toggleRepeatPlayList} title="Repeat">
            <i className="fas fa-redo"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  export default MainSection;
