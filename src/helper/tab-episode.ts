import { EpisodeUrlType, FrontendEpisode } from "../type/message";
import { Associa } from "../type/tab";
import { checkUrlType } from "../utils/url";

type ReportResult = {
  tabId: number
  url: string
  title: string
  type: EpisodeUrlType
}


/**
 * 剧集单独标签页
 *
 * @class TabEpisode
 */
class TabEpisode {

  public result: null | ReportResult = null

  private tab: chrome.tabs.Tab | null =  null

  constructor(private episode: FrontendEpisode) {}

  /**
   * 创建标签页
   *
   * @param {chrome.tabs.CreateProperties} param
   * @return {*} 
   * @memberof TabEpisode
   */
  async create() {
    this.tab = await chrome.tabs.create({
      url: this.episode.href
    })
    return this.tab
  }

  /**
   * 关闭标签页
   *
   * @memberof TabEpisode
   */
  async close() {
    chrome.tabs.remove([this.result!.tabId])
    this.tab = null
  }

  /**
   * 设置该标签页探测到的结果
   *
   * @param {ReportResult} rs
   * @memberof TabEpisode
   */
  public setReportResult(rs: Associa) {
    this.result = {
      tabId: rs.tabId,
      title: this.episode.title,
      type: checkUrlType(rs.url),
      url: rs.url
    }
  }

}

export {
  TabEpisode
}