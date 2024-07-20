import type VimeoPlayer from "@vimeo/player";
import type { YouTubePlayer as _YouTubePlayer } from "youtube-player/dist/types";

// The `off` function is missing from the types declaration while existing
type Listener = void;
interface YouTubePlayer extends _YouTubePlayer { off: (listener: Listener) => void };

export class UniversalPlayer {
  private player!: VimeoPlayer | YouTubePlayer;
  private listener!: Listener;
  constructor(
    public video: string | number,
    public el: HTMLElement,
    public type: "youtube" | "vimeo",
  ) {}

  private isVimeoPlayer(_player: VimeoPlayer | unknown): _player is VimeoPlayer {
    return this.type === "vimeo";
  } 

  private async setupPlayer() {
    if (!this.isVimeoPlayer(this.player)) {
      const YouTubePlayerFactory = (await import("youtube-player")).default;
      const decoded = atob(this.video as string);
      this.player = YouTubePlayerFactory(this.el) as YouTubePlayer; // force the `off` handling
      this.player.cueVideoById(decoded);
    } else {
      const VimeoPlayer = (await import("@vimeo/player")).default;
      const decoded = parseInt(atob(this.video as string));
      this.player = new VimeoPlayer(this.el, { id: decoded, responsive: true });
    }
  }

  // Static constructor to await dynamic imports
  static async create(
    video: string | number,
    el: HTMLElement,
    type: "youtube" | "vimeo",
  ) {
    const obj = new UniversalPlayer(video, el, type);
    await obj.setupPlayer();
    return obj;
  }

  play() {
    if (!this.isVimeoPlayer(this.player)) {
      this.player.playVideo();
    } else {
      this.player.play();
    }
  }

  destroy() {
    if (!this.isVimeoPlayer(this.player)) {
      this.player.off(this.listener);
      this.player.destroy();
    } else {
      this.player.off("ended");
      this.player.destroy();
    }
  }

  onEnded(cb: () => void) {
    if (!this.isVimeoPlayer(this.player)) {
      this.listener = this.player.on("stateChange", (event) => {
        if (event.data === 0) {
          cb();
        }
      });
    } else {
      this.listener = this.player.on("ended", cb);
    }
  }
}
