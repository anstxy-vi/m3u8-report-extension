import { EpisodeUrlType } from "../type/message"

/**
 * 检查url资源类型
 *
 * @export
 * @param {string} url
 * @return {*}  {EpisodeUrlType}
 */
export function checkUrlType(url: string): EpisodeUrlType {
  if (url.startsWith("http")) return "mp4"
  return "m3u8"
}