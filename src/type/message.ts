export type ChromeMessageType = {
  type: Step;
  keyword: string;
};

export enum MessageType {
  TYPE_KEYWORD = "type_keyword",
}

export type Config = {
  url: string;
  keyword: string;
};

export const Steps = [
  /*"TypeKeyword", */
  "SelectItem",
  "SelectEpisode",
] as const;

type StepTuple = typeof Steps;

export type Step = StepTuple[number];

export enum EpisodeStatus {
  Downloading,
  Downloaded,
  Errors
}

export type Episode = {
  title: string
  m3u8: string
  status: EpisodeStatus 
}

export type FrontendEpisode = Pick<Episode, 'title'> & {href: string}
