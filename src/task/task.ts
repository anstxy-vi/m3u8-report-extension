import { logger } from "../helper/logger";
import {
  ChromeMessageType,
  Config,
  FrontendEpisode,
  Step,
  Steps,
} from "../type/message";
import { Worker } from "../worker";

const debug = logger("Task");

class Task {
  private status: null | Step = null;

  constructor(private cfg: Config, private worker: Worker) { }

  public getNextStep() {
    if (this.status) {
      return Steps[Steps.indexOf(this.status) + 1];
    }
    return Steps[0];
  }

  public run(tab: chrome.tabs.Tab) {
    const next = this.getNextStep();
    if (next) {
      debug.info("下一步: ", next);
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
          _this.worker.tabEpisodeManager.registeList(message);
          _this.worker.tabListener!.listenM3u8Url();
        }
      }
    );
  }
}

export { Task };
