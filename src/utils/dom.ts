import { logger } from "../helper/logger"

const debug = logger("dom")

export function getDom<R>(dom: string) :R | null {
  const element = document.querySelector(dom)
  debug.info(dom)
  if (element) {
    return element as R
  }
  debug.error(`$$("${dom}") not found`)
  return null
}

export function getDoms<R>(dom: string) :R | null {
  const element = document.querySelectorAll(dom)
  debug.info(dom)
  if (element) {
    return element as R
  }
  debug.error(`$$("${dom}") not found`)
  return null
}

