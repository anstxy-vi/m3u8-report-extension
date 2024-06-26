import { $episode_a, $search_input, $search_item, $search_submit } from "./config/element";
import { logger } from "./helper/logger";
import { FrontendEpisode } from "./type/message";
import { getDom, getDoms } from "./utils/dom";
import { isChromeMessageType } from "./utils/tab";

const debug = logger("content");

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(msg);
  if (isChromeMessageType(msg)) {
    if (msg.type === "SelectItem") {
      const item = getDom<HTMLLinkElement>(
        `${$search_item}[title=${msg.keyword}]`
      );
      if (item) {
        item.click();
      }
    } else {
      // const search = getDom<HTMLInputElement>($search_input);
      // if (search) {
      //   debug.info("设置关键字: ", msg.keyword);
      //   search.value = msg.keyword;
      // }
      //
      // const submit = getDom<HTMLInputElement>($search_submit);
      // if (submit) {
      //   debug.info("提交关键字搜索");
      //   submit.click();
      // }
    }
    if (msg.type === 'SelectEpisode') {
      const links = getDoms($episode_a)
      const list = Array.from(links as HTMLLinkElement[]).map((a => ({
        href: a.href,
        title: a.textContent
      } as FrontendEpisode)))
      sendResponse(list)
      return
    }
  }

  if (msg.type === "CheckMediaType") {
    const iframe = document.getElementById("cciframe")
    if (iframe as HTMLIFrameElement) {
      const doc = (iframe as HTMLIFrameElement).contentWindow?.document;
      const player = doc?.getElementById("player")
      if (player) {
        const ife = (player as HTMLDivElement).getElementsByTagName("iframe")
        if (ife.length && ife[0]) {
          const d = (ife[0] as HTMLIFrameElement).contentWindow?.document
          const a1 = d?.getElementById("a1")
          const video = a1?.getElementsByTagName("video")?.[0]
          if (video) {
            sendResponse(video.src)
            return;
          }
        }
        
        const video = player.getElementsByTagName("video")?.[0]
        if (video) {
          sendResponse(video.src)
          return;
        }
      }
    }
  }

  sendResponse(msg.type);
});
