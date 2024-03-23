enum LoggerEnum {
  Log = "log",
  Warn = "warn",
  Error = "error",
  Info = "info",
  Success = "success",
}

const applyStyles: Record<LoggerEnum, string> = {
  [LoggerEnum.Log]: "color: black",
  [LoggerEnum.Error]: "color: #E86C5D",
  [LoggerEnum.Info]: "color: #3F6FFB",
  [LoggerEnum.Warn]: "color: orange",
  [LoggerEnum.Success]: "color: green",
};

const padStartZero = (n: number, length = 2) =>
  n.toString().padStart(length, "0");

const timestamp = () => {
  const d = new Date();
  const yy = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) =>
    padStartZero(n)
  );
  const dd = [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) =>
    padStartZero(n)
  );
  const dF = dd.join(":");
  const yF = yy.join("/");
  const tF = padStartZero(d.getMilliseconds(), 3);
  return [yF, dF, tF].join(" ");
};

const parseRest = (rest: any[], type: keyof typeof applyStyles) => {
  try {
    const result = rest.reduce(
      ([left, right], word) => {
        if (typeof word === "string") {
          left.push(`%c${word}`);
          right.push(applyStyles[type]);
        } else {
          left.push("%O");
          right.push(word);
        }
        return [left, right];
      },
      [[] as string[], [] as string[]]
    );
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

function applyFunction(...args: [keyof typeof applyStyles, ...rest: any]) {
  const [type, namespace, ...rest] = args;
  const formats = parseRest(rest, type);
  console.log(
    `[${timestamp()}] %c[${namespace}] ${formats[0].join("")}`,
    applyStyles[type],
    ...formats[1]
  );
}

function logger(namespace: string): Record<keyof typeof applyStyles, any> {
  const rest = (args: any) => [namespace, ...args];
  return {
    log: (...args: any) =>
      applyFunction.call(null, LoggerEnum.Log, ...rest(args)),
    error: (...args: any) =>
      applyFunction.call(null, LoggerEnum.Error, ...rest(args)),
    success: (...args: any) =>
      applyFunction.call(null, LoggerEnum.Success, ...rest(args)),
    info: (...args: any) =>
      applyFunction.call(null, LoggerEnum.Info, ...rest(args)),
    warn: (...args: any) =>
      applyFunction.call(null, LoggerEnum.Warn, ...rest(args)),
  };
}

export { logger };
