import { logger } from "../helper/logger";
import {
  ChromeMessageType,
  Config,
  Episode,
  EpisodeStatus,
  FrontendEpisode,
  MessageType,
  Step,
  Steps,
} from "../type/message";
import { Worker } from "../worker";

const debug = logger("Task");

class Task {
  private status: null | Step = null;

  private episodes = new Map<number, Episode>();
  private activeSeq = -1;

  constructor(private cfg: Config, private worker: Worker) {}

  public getNextStep() {
    if (this.status) {
      return Steps[Steps.indexOf(this.status) + 1];
    }
    return Steps[0];
  }

  public run(tab: chrome.tabs.Tab) {
    const next = this.getNextStep();
    debug.info("下一步: ", next);
    if (next) {
      this.status = next;
      this.next(next, tab);
    }
  }

  public next(step: Step, tab: chrome.tabs.Tab) {
    const _this = this;
    chrome.tabs.sendMessage<ChromeMessageType>(
      tab.id!,
      {
        type: step,
        keyword: this.cfg.keyword,
      },
      function (message: Step | FrontendEpisode[]) {
        if (message instanceof Array) {
          debug.warn("循环获取")
          _this.worker.tabListener!.listenM3u8Url();
          _this.loopEpisodes(message);
        }
      }
    );
  }

  public async loopEpisodes(list: FrontendEpisode[]): Promise<any> {
    const [first, ...rest] = list;
      debug.log("first: ", first);
    if (first) {
      this.activeSeq += 1;
      const tab = await chrome.tabs.create({
        url: `${first.href}`,
      });
      return await this.loopEpisodes(rest);
    } else {
      console.log("length: ", this.episodes.size)
      for (const [n, p] of this.episodes.entries()) {
        debug.log(n, p.title, p.m3u8, p.title);
      }
    }
    return null;
  }

  public addEpisode(m3u8Url: string) {
    debug.log("set m3u8url: ", m3u8Url);
    this.episodes.set(this.activeSeq, {
      title: "第x集",
      m3u8: m3u8Url,
      status: EpisodeStatus.Downloading,
    });
  }
}

export { Task };
