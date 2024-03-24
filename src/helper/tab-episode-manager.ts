import { FrontendEpisode } from "../type/message"
import { Associa } from "../type/tab"
import { logger } from "./logger"
import { TabEpisode } from "./tab-episode"

const debug = logger("TabEpisodeManager")

/**
 * 剧集标签页管理器
 *
 * @class TabEpisodeManager
 */
class TabEpisodeManager {

  private list = new Map<number, TabEpisode>()

  private episodes: FrontendEpisode[] = []

  constructor() { }

  /**
   * 注册标签页列表
   *
   * @param {FrontendEpisode[]} episodes
   * @memberof TabEpisodeManager
   */
  public registeList(episodes: FrontendEpisode[]) {
    //  $TEST
    this.episodes = [...episodes].slice(0, 2)
    this.next()
  }

  /**
   * 添加标签页并记录
   *
   * @param {string} url
   * @memberof TabEpisodeManager
   */
  async addTab(episode: FrontendEpisode) {
    const tabEpisode = new TabEpisode(episode)
    const tab = await tabEpisode.create()
    if (tab.id) {
      this.list.set(tab.id, tabEpisode)
    }
  }

  /**
   * 该标签页是否存在
   *
   * @param {number} tabId
   * @return {*} 
   * @memberof TabEpisodeManager
   */
  public hasTabId(tabId: number) {
    return this.list.has(tabId)
  }

  /**
   * 将探测到的资源关联至标签页
   *
   * @param {Associa} info
   * @return {*} 
   * @memberof TabEpisodeManager
   */
  associaTab(info: Associa) {
    const tab = this.list.get(info.tabId) as TabEpisode
    tab.setReportResult(info)
    tab.close()

    if (this.episodes.length === 0) {
      this.logTabsInfo()
      return
    }
    this.next()

  }

  /**
   * 下一个剧集
   *
   * @memberof TabEpisodeManager
   */
  next() {
    const shift = this.episodes.shift()
    if (shift) {
      this.addTab(shift)
    }
  }

  /**
   * 输出所关联到的信息
   *
   * @memberof TabEpisodeManager
   */
  logTabsInfo() {
    const all = Array.from(this.list.values()).every(tab => Boolean(tab.result))
    if (all) {
      for (const [_, tab] of this.list.entries()) {
        const { tabId, ...rest } = tab.result!
        const log = Object.values(rest).join(", ")
        console.log(log)
      }
    }
  }

}

export {
  TabEpisodeManager
}