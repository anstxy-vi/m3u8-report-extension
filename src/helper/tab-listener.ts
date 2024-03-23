import { Task } from "../task/task";
import { logger } from "./logger";

const debug = logger("TabListener");

class TabListener {
  private tabs = new Set<number>();

  constructor(private task: Task) {}

  public listen() {
    const _this = this;
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (_this.tabs.has(tabId) && changeInfo.status === "complete") {
        _this.task.run(tab);
      }
    });
  }

  public async add(url: string) {
    chrome.tabs.create({ url }, (tab) => {
      if (tab.id) {
        this.tabs.add(tab.id);
      }
    });
  }

  public listenM3u8Url() {
    const _this = this
    chrome.webRequest.onCompleted.addListener(
      function (details) {
        if (details.url.includes("index.m3u8")) {
          _this.task.addEpisode(details.url) 
        }
      },
      { urls: ["<all_urls>"] }
    );
  }
}

export { TabListener };
