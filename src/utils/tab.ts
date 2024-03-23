import { ChromeMessageType, Steps } from "../type/message";

export function isChromeMessageType(msg: any): msg is ChromeMessageType {
  return Steps.includes(msg?.type)
}
