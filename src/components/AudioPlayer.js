import React from "react";
import state from "../state";
import Song from "../Song";
import MainSection from "./MainSection";
import PlayListSection from "./PlayListSection";
import { Howler } from "howler";

export default class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.songDataUpdateInterval = null;
    this.state = state;
    this.handleSongFiles = this.handleSongFiles.bind(this);
  }

  /**
   * Sets the current song`s playback time to that specified by user via the slider (event.target) and updates the state accordingly to show the new playback time
   */
  rewind = (event) => {
    if (this.state.songList.length !== 0 && this.state.status !== "stopped") {
      const newTrackPosition = event.target.value;
      this.setState(prevState => {
        prevState.songList[prevState.currentSong - 1].currentPosition = newTrackPosition;
        return {
          currentSliderValue: newTrackPosition,
          currentTrackPosition: prevState.songList[this.state.currentSong - 1].formattedCurrentPosition
        };
      });
    }
  }

  /**
   * Resizes the playlist in response to user`s resizing the app`s window
   */
  resizeList = () => {
    // the playerHeight prop is not updated if user decides to resize the window down past a certain height, otherwise 
    // if user hides the playlist altogether and then decides to show it back by clicking the button in the main Nav, the playlist will not be shown properly 
    this.setState(prevState => ({
      isPlayListShown: window.innerHeight > prevState.minPlayerHeight,
      playerHeight: window.innerHeight > prevState.minPlayerHeightWithPlaylist ? window.innerHeight : prevState.playerHeight
    }));
  }

  /**
   * Hides/shows the "Playlist" section and resizes the app`s window
   */
  togglePlaylistVisibility = () => {
    this.setState(prevState => {
      // if the playlist should be hidden, the window resizes to the minimum height, if shown - to the previous height, stored in the state 
      window.resizeTo(prevState.playerWidth, prevState.isPlayListShown ? prevState.minPlayerHeight : prevState.playerHeight);
      return { isPlayListShown: !prevState.isPlayListShown };
    });
  }

  onChangeVolume = (event) => {
    Howler.volume(event.target.value / 100);
    this.setState({ currentVolume: event.target.value });
  }

  onChangeBalance = (event) => {
    Howler.stereo((event.target.value - 50) / 50);
    this.setState({ currentBalance: event.target.value });
  }

  /**
   * Adds the resize event listener to make it possible to resize the playlist toghether with the app`s window
   */
  componentDidMount() {
    window.addEventListener("resize", this.resizeList);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeList);
  }

  /**
   * onClick handler for all buttons that upload new songs. Clicks the invisible <input type="file"> element, which will then handle the song files 
   * 
   * @param boolean newPlaylist - specifies whether the new songs should replace the current playlist or be added to it
   */
  clickAddFiles = (newPlaylist) => {
    this.setState({ createNewPlaylist: newPlaylist });
    this.uploader.click();
  }

  /**
   * Creates new Song objects for every song added to the playlist and updates the state with the new playlist
   */
  async handleSongFiles(event) {
    if (event.target.files.length !== 0) {
      const files = event.target.files;
      for (let x = 0; x < files.length; x++) {
        let newSong;
        await new Promise(resolve => {
          const fl = new FileReader();
          fl.addEventListener("load", (loadEvent) => {
            let songName = files[x].name.replace(/^(\d+. |\d+ [-] |\d )(\w.+)$/, "$2").replace(/[.]\w+$/, "");
            newSong = new Song(loadEvent.target.result, songName, this.state.currentBalance);
            resolve();
          });
          fl.readAsDataURL(files[x]);
        });
        await newSong.load();
        this.setState(prevState => ({
          songList: prevState.createNewPlaylist && x === 0 ? [newSong] : [...prevState.songList, newSong],
          history: prevState.createNewPlaylist && x === 0 ? [] : prevState.history,
          status: prevState.createNewPlaylist && x === 0 ? "stopped" : prevState.status,
          currentTrackPosition: prevState.createNewPlaylist && x === 0 ? "00:00" : prevState.currentTrackPosition,
          currentSliderValue: prevState.createNewPlaylist && x === 0 ? 0 : prevState.currentSliderValue,
          currentTrackDuration: prevState.createNewPlaylist && x === 0 ? "00:00" : prevState.currentTrackDuration,
          currentSong: prevState.createNewPlaylist && x === 0 ? 1 : prevState.currentSong
        }));
      }
    }
  }

  /**
   * Pauses the current song if it is playing, otherwise plays it
   */
  clickPause = () => {
    if (this.state.status !== "stopped") {
      if (this.state.status === "paused") {
        this.clickPlay(this.state.currentSong);
      } else {
        this.setState({ status: "paused" });
      }
    }
  }

  clickStop = () => {
    this.setState({ status: "stopped", currentTrackPosition: "00:00", currentSliderValue: 0 });
  }

  clickPlay = (songNumber) => {
    this.setState(prevState => {
      if (prevState.status !== "paused") {
        this.stopCurrentSong(prevState);
      }
      return {
        status: "playing",
        currentTrackDuration: prevState.songList[songNumber - 1].formattedDuration,
        currentSong: songNumber,
        history: prevState.history.includes(songNumber) ? prevState.history : [...prevState.history, songNumber]
      }
    });
  }

  /**
   * Stops the interval that updates the information about the currently playing song
   */
  stopRenderingSongData = () => {
    clearInterval(this.songDataUpdateInterval);
    this.songDataUpdateInterval = null;
  }

  stopCurrentSong = (state) => {
    state.songList[state.currentSong - 1].stop();
    state.songList[state.currentSong - 1].currentPosition = 0;
  }

  /**
   * Handles the song objects based on the state changes
   */
  componentDidUpdate(_prevProps, prevState, _snapshot) {
    if (prevState.status !== "playing" && this.state.status === "playing") {
      this.songDataUpdateInterval = setInterval(() => this.renderCurrentSongData(), 250);
    }
    if (prevState.status === "playing" && this.state.status !== "playing") {
      this.stopRenderingSongData();
    }
    if ((prevState.status !== "stopped" && this.state.status === "stopped") || this.state.currentSong !== prevState.currentSong) {
      this.stopCurrentSong(prevState);
    }
    if ((this.state.status === "playing" && !this.state.songList[this.state.currentSong - 1].isPlaying)) {
      this.state.songList[this.state.currentSong - 1].play();
    }
    if (prevState.status === "playing" && this.state.status === "paused") {
      prevState.songList[prevState.currentSong - 1].pause();
    }
  }

  /**
   * Selects the next song to play from the current state
   * 
   * @param boolean forward - shows whether the song should be changed to the next or the previous one 
   * @param {*} state - the information we need to select the new song from the playlist (the current song, whether the playlist is looped, whether the order is random, the playlist itself and the history) 
   */
  determineNextSong = (forward, { currentSong, repeatPlayList, isRandomOrder, songList, history }) => {
    let nextSong;
    if (isRandomOrder) {
      if (history.length !== songList.length) {
        do {
          nextSong = Math.ceil(Math.random() * songList.length);
        } while (history.includes(nextSong));
      } else {
        nextSong = repeatPlayList ? Math.ceil(Math.random() * songList.length) : currentSong;
      }
    } else {
      nextSong = currentSong + (forward ? 1 : -1);
      if (nextSong === songList.length + 1) {
        nextSong = repeatPlayList ? 1 : currentSong;
      } else if (!forward && nextSong === 0) {
        nextSong = repeatPlayList ? songList.length : currentSong;
      }
    }
    return nextSong;
  }

  /**
   * Handles the onClick event of the "step backward" and "step forward" buttons of the player 
   * 
   * @param boolean forward - determines whether the song should be changed to the previous or the next one
   */
  clickChangeSong = (forward) => {
    this.setState(prevState => {
      const nextSong = this.determineNextSong(forward, prevState);
      if (prevState.repeatPlayList || ((prevState.isRandomOrder && prevState.history.length !== prevState.songList.length) || (!prevState.isRandomOrder && nextSong !== prevState.currentSong))) {
        return {
          history: prevState.history.length !== prevState.songList.length ? [...prevState.history, nextSong] : [nextSong],
          currentSong: nextSong,
          currentSliderValue: 0,
          currentTrackPosition: "00:00",
          currentTrackDuration: prevState.songList[nextSong - 1].formattedDuration,
          status: prevState.status !== "stopped" ? "playing" : "stopped"
        }
      }
    }, () => {
      // if there is only one song in the playlist, it shouldn`t be changed, just rewinded to the start
      if (this.state.songList.length === 1 && this.state.repeatPlayList) {
        this.state.songList[this.state.currentSong - 1].currentPosition = 0;
      }
    });
  }

  /**
   * Handles the transition from the previous song to the next one when the previous one finishes playing naturally
   * 
   * @param {*} prevState - the corresponding fields of the prevState object
   */
  handleSongChange = ({ isRandomOrder, currentSong, repeatPlayList, history, status, songList }) => {
    let nextSong = this.determineNextSong(true, { isRandomOrder, currentSong, repeatPlayList, history, status, songList });
    let newStateObj = {};
    if (!isRandomOrder) {
      newStateObj.status = currentSong === nextSong && !repeatPlayList ? "stopped" : status;
    } else {
      newStateObj.history = history.length !== songList.length ? [...history, nextSong] : [nextSong];
      newStateObj.status = history.length === songList.length && !repeatPlayList ? "stopped" : status;
    }
    newStateObj.currentSong = nextSong;
    return newStateObj;
  }

  /**
   * Updates the information about the currently playing song  
   */
  renderCurrentSongData = () => {
    this.setState(prevState => {
      let newStateObj = !prevState.songList[prevState.currentSong - 1].isPlaying ? this.handleSongChange(prevState) : this.handleInfoLineShift(prevState);
      newStateObj.currentSliderValue = (prevState.songList[prevState.currentSong - 1].currentPosition / prevState.songList[prevState.currentSong - 1].duration) * 100;
      newStateObj.currentTrackPosition = prevState.songList[prevState.currentSong - 1].formattedCurrentPosition;
      return newStateObj;
    });
  }

  /**
   * Handles the onClick event of the divs representing songs in the playlist, selects the clicked song 
   * 
   * @param number songNumber - the number of the song that has been selected 
   */
  toggleSelection = (event, songNumber) => {
    this.state.songList[songNumber - 1].selected = true;
    for (let x = 0; x < this.state.songList.length; x++) {
      // by pressing ctrl, user can select multiple songs
      if (x !== songNumber - 1 && !event.ctrlKey) {
        this.state.songList[x].selected = false;
      }
    }
    this.setState({});
  }

  toggleRepeatPlayList = () => {
    this.setState(prevState => ({ repeatPlayList: !prevState.repeatPlayList }));
  }

  /**
   * Determines whether the songs should be played in random or sequential order, updates history (which is only tracked in random order)
   */
  toggleRandomOrder = () => {
    this.setState(prevState => ({
      isRandomOrder: !prevState.isRandomOrder,
      history: !prevState.isRandomOrder ? [prevState.currentSong] : []
    }));
  }

  /**
   * Handles the movement of the line in the upper-right corner of the player which shows information about the current song.
   * "InfoLineMarginLeft" shifts it by changing the margin-left style property of the "this.infoline" element,
   * "infoLineRightClip" controls the visible area through the clip-path style property
   *   
   * @param {*} state - the corresponding fields of the state object
   */
  handleInfoLineShift = ({ infoLineMarginLeft, infoLineRightClip }) => {
    let newStateObj = {};
    const lineSpeed = 3;
    // this.testDiv is an invisible element that is used to measure the length of the infoline text in pixels, needed to determine whether the line
    // should reset to the starting position (it can`t keep shifting to the right forever)
    const shouldResetLinePosition = Math.abs(infoLineMarginLeft) >= ((this.testDiv.getBoundingClientRect().width / 2) - lineSpeed);
    newStateObj.infoLineMarginLeft = shouldResetLinePosition ? 0 : (infoLineMarginLeft - lineSpeed);
    newStateObj.infoLineRightClip = shouldResetLinePosition ? 0 : (infoLineRightClip + lineSpeed);
    return newStateObj;
  }

  /**
   * Handles the onClick event of the buttons in the "Rem" popup in the footer, removes songs from the playlist
   * 
   * @param string query - the criterion by which to remove songs 
   */
  clickRemoveSongs = (query) => {
    if (this.state.isRemPopupExpanded) {
      this.setState(prevState => {
        if (this.state.songList.length !== 0) {
          let newSongList = [];
          if (query === "selected") {
            newSongList = prevState.songList.filter(song => !song.isSelected);
          } else if (query === "crop") {
            newSongList = prevState.songList.filter(song => song.isSelected);
          }
          return {
            songList: newSongList,
            status: "stopped",
            history: [],
            currentTrackPosition: "00:00",
            currentSliderValue: 0,
            currentSong: newSongList.includes(prevState.songList[prevState.currentSong - 1]) ? newSongList.indexOf(prevState.songList[prevState.currentSong - 1]) + 1 : 1,
            isRemPopupExpanded: false
          }
        } else {
          return this.togglePopupVisibility(false, false, false);
        }
      });
    } else {
      this.setState(this.togglePopupVisibility(false, true, false));
    }
  }

  /**
   * Handles the onClick event of the buttons in the "Sel" popup in the footer, selects songs in the playlist
   * 
   * @param string query - the criterion by which to select songs 
   */
  clickSelectSongs = (query) => {
    if (this.state.isSelPopupExpanded) {
      this.state.songList.forEach(songObj => {
        if (query === "inverted") {
          songObj.selected = !songObj.selected;
        } else {
          songObj.selected = query === "all";
        }
      });
      this.setState(this.togglePopupVisibility(false, false, false));
    } else {
      this.setState(this.togglePopupVisibility(true, false, false));
    }
  }

  /**
 * Handles the onClick event of the buttons in the "Sort" popup in the footer, sorts songs in the playlist
 * 
 * @param string query - the criterion by which to sort songs 
 */
  clickSort = (query) => {
    if (this.state.isSortPopupExpanded) {
      this.setState(prevState => {
        let newStateObj = this.togglePopupVisibility(false, false, false);
        if (prevState.songList.length !== 0) {
          const prevCurrentSong = prevState.songList[prevState.currentSong - 1];
          if (query === "name") {
            newStateObj.songList = prevState.songList.sort((a, b) => a.songName > b.songName ? 1 : (a.songName < b.songName ? -1 : 0));
          } else if (query === "reverse") {
            newStateObj.songList = prevState.songList.reverse();
          } else if (query === "random") {
            newStateObj.songList = [];
            while (newStateObj.songList.length !== prevState.songList.length) {
              const randomNum = Math.floor(Math.random() * prevState.songList.length);
              const songToPush = prevState.songList[randomNum];
              if (!newStateObj.songList.includes(songToPush)) {
                newStateObj.songList.push(songToPush);
              }
            }
          }
          newStateObj.currentSong = newStateObj.songList.indexOf(prevCurrentSong) + 1;
          newStateObj.history = [];
        }
        return newStateObj;
      });
    } else {
      this.setState(this.togglePopupVisibility(false, false, true));
    }
  }

  /**
   * Handles the onClick event of the topmost app div, closes all popups when clicked on any element other than a popup
   */
  closePopups = (event) => {
    if (event.target.className !== "footer-button") {
      this.setState(this.togglePopupVisibility(false, false, false));
    }
  }

  togglePopupVisibility = (isSelPopupExpanded, isRemPopupExpanded, isSortPopupExpanded) => {
    return { isSelPopupExpanded, isRemPopupExpanded, isSortPopupExpanded };
  }

  render() {
    const playerButtonFuncs = {
      clickPlay: () => this.clickPlay(this.state.currentSong),
      clickPause: this.clickPause,
      clickStop: this.clickStop,
      clickStepForward: () => this.clickChangeSong(true),
      clickStepBackward: () => this.clickChangeSong(false),
      createNewPlaylist: () => this.clickAddFiles(true)
    };

    const popupButtonFuncs = {
      clickAddFiles: () => this.clickAddFiles(false),
      clickRemoveSongs: this.clickRemoveSongs,
      clickSelectSongs: this.clickSelectSongs,
      clickSort: this.clickSort
    };

    const currentSongObj = this.state.songList[this.state.currentSong - 1];
    const infoLineText = this.state.songList.length === 0 ? "" : `${this.state.currentSong}. ${currentSongObj.songName} (${currentSongObj.formattedDuration}) *** `.repeat(4);
    return (
      <div id="player" style={{ height: this.state.playerHeight + "px" }} onClick={this.closePopups}>
        <div ref={node => this.testDiv = node} id="infoLineLengthTestDiv">{infoLineText}</div>
        <input type="file" ref={node => this.uploader = node} className="hidden" onChange={this.handleSongFiles} accept=".mp3, .wav, .flac" multiple />
        <MainSection
          inscr="PLAYA"
          onClose={window.close}
          isMainNav
          onTogglePlaylistVisibility={this.togglePlaylistVisibility}
          onChangeVolume={this.onChangeVolume}
          onChangeBalance={this.onChangeBalance}
          status={this.state.status}
          currentTrackPosition={this.state.currentTrackPosition}
          currentSliderValue={this.state.currentSliderValue}
          onRewind={this.rewind}
          currentVolume={this.state.currentVolume}
          currentBalance={this.state.currentBalance}
          buttonsDisabled={this.state.songList.length === 0}
          playerButtonFuncs={playerButtonFuncs}
          toggleRepeatPlayList={this.toggleRepeatPlayList}
          toggleRandomOrder={this.toggleRandomOrder}
        >
          {<div id="infoline">
            <p
              id="info-p"
              ref={node => this.infoline = node}
              style={{ marginLeft: `${this.state.infoLineMarginLeft}px`, clipPath: `inset(0px 0px 0px ${this.state.infoLineRightClip}px)` }}
            >
              {infoLineText}
            </p>
          </div>}
        </MainSection>
        {this.state.isPlayListShown &&
          <PlayListSection
            height={this.state.playerHeight - 120}
            inscr="PLAYA&nbsp;PLAYLIST"
            onClose={this.togglePlaylistVisibility}
            playerHeight={this.state.playerHeight}
            songList={this.state.songList}
            playSong={this.clickPlay}
            toggleSelection={this.toggleSelection}
            currentSong={this.state.currentSong}
            currentTrackPosition={this.state.currentTrackPosition}
            currentTrackDuration={this.state.currentTrackDuration}
            buttonsDisabled={this.state.songList.length === 0}
            playerButtonFuncs={playerButtonFuncs}
            popupButtonFuncs={popupButtonFuncs}
            isRemPopupExpanded={this.state.isRemPopupExpanded}
            isSelPopupExpanded={this.state.isSelPopupExpanded}
            isSortPopupExpanded={this.state.isSortPopupExpanded}
          />
        }
      </div>
    );
  }
}