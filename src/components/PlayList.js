import React from "react";

const PlayList = ({ playerHeight, songList, toggleSelection, playSong, currentSong }) =>
  <div id="playlist" style={{ height: (playerHeight - 175) + "px" }}>
    {songList.map((songObj, index) =>
      <div
        key={`song-${index + 1}`}
        onDoubleClick={() => playSong(index + 1)}
        onClick={(event) => toggleSelection(event, index + 1)}
        className={`list-item ${songList[index].isSelected ? " selected-item" : ""} ${index === currentSong - 1 ? "currently-playing" : ""}`}
      >
        <p className="song-descr">{`${index + 1}. ${songObj.formattedSongName}`}</p>
        <p className="song-length">{`${songObj.formattedDuration}`}</p>
      </div>
    )}
  </div>

  export default PlayList;