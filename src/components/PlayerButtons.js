import React from "react";

const PlayerButtons = ({ buttonsDisabled, playerButtonFuncs, divId }) =>
  <div id={divId}>
    <button disabled={buttonsDisabled} onClick={playerButtonFuncs.clickStepBackward} title="Previous song">
      <i className="fas fa-step-backward"></i>
    </button>
    <button disabled={buttonsDisabled} onClick={playerButtonFuncs.clickPlay} title="Play">
      <i className="fas fa-play"></i>
    </button>
    <button disabled={buttonsDisabled} onClick={playerButtonFuncs.clickPause} title="Pause">
      <i className="fas fa-pause"></i>
    </button>
    <button disabled={buttonsDisabled} onClick={playerButtonFuncs.clickStop} title="Stop">
      <i className="fas fa-stop"></i>
    </button>
    <button disabled={buttonsDisabled} onClick={playerButtonFuncs.clickStepForward} title="Next song">
      <i className="fas fa-step-forward"></i>
    </button>
    <button onClick={playerButtonFuncs.createNewPlaylist}>
      <i className="fas fa-upload"></i>
    </button>
  </div>

  export default PlayerButtons;