import { logger } from "./helper/logger";
import { TabListener } from "./helper/tab-listener";
import { Task } from "./task/task";
import { Config } from "./type/message";

const debug = logger("worker");

const config: Config = {
  url: "https://www.mandaom.com",
  keyword: "妄想学生会第二季",
};

class Worker {
  protected static instance: null | Worker = null;

  public tabListener: TabListener | null = null;

  public config = config;

  constructor() {}

  async start() {
    debug.info("worker start");

    const { url, keyword } = config;

    const task = new Task(config, this);

    this.tabListener = new TabListener(task);
    this.tabListener.listen();

    this.tabListener.add(url + `/search/${keyword}`);
  }

  static getInstance() {
    if (!Worker.instance) {
      Worker.instance = new Worker();
    }
    return Worker.instance;
  }
}

export const worker = Worker.getInstance();

export { Worker };
