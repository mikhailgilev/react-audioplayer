import { Howl, Howler } from "howler";

export default class Song {
  constructor(data, songName, balance) {
    this.howl = new Howl({ src: [data] });
    this.name = songName;
    this.isSelected = false;
    this.howl.stereo((balance - 50) / 50);
  }

  async load() {
    this.songLength = await new Promise(resolve => {
      this.howl.once("load", () => resolve(this.howl.duration()));
    });
  }

  get formattedDuration() {
    return `${Math.floor(this.duration / 60)}:${Math.floor(this.duration % 60).toString().padStart(2, "0")}`;
  }

  get duration() {
    return this.songLength;
  }

  get songName() {
    return this.name;
  }

  get formattedSongName() {
    return this.name.length >= 30 ? this.name.substring(0, 29) + "..." : this.name;
  }

  play() {
    this.howl.play();
  }

  pause() {
    this.howl.pause();
  }

  get isPlaying() {
    return this.howl.playing();
  }

  get currentPosition() {
    return this.howl.seek();
  }

  set currentPosition(value) {
    this.howl.seek(this.duration * (value / 100));
  }

  get formattedCurrentPosition() {
    return `${Math.floor(this.currentPosition / 60).toString().padStart(2, "0")}:${Math.floor(this.currentPosition % 60).toString().padStart(2, "0")}`;
  }

  get selected() {
    return this.isSelected;
  }

  set selected(value) {
    this.isSelected = value;
  }

  stop() {
    this.howl.stop();
  }
}