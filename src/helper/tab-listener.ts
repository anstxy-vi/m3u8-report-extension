import { Task } from "../task/task";
import { worker } from "../worker";
import { logger } from "./logger";

const debug = logger("TabListener");

class TabListener {
  private tabs = new Set<number>();

  constructor(private task: Task) { }

  public listen() {
    const _this = this;
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (_this.tabs.has(tabId) && changeInfo.status === "complete") {
        _this.task.run(tab);
      }
      if (worker.tabEpisodeManager.hasTabId(tabId) && changeInfo.status === "complete") {
        chrome.tabs.sendMessage(tabId, { type: "CheckMediaType" }, function (response: string) {
          console.log('response', response)
          if (response !== "CheckMediaType") {
            worker.tabEpisodeManager.associaTab({
              tabId,
              url: response
            })
          }
        })
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
    debug.info("开始监听WebRequest")
    chrome.webRequest.onCompleted.addListener(
      function (details) {
        if (details.url.includes("index.m3u8")) {
          worker.tabEpisodeManager.associaTab({
            tabId: details.tabId,
            url: details.url
          })
        }
      },
      { urls: ["<all_urls>"] }
    );
  }
}

export { TabListener };
