import { worker } from "./worker";

chrome.runtime.onInstalled.addListener(function () {
  worker.start();
});
