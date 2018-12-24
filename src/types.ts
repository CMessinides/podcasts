interface Stub {
  loading: boolean;
  error?: ApplicationError;
}

export function isStub(s: any): s is Stub {
  return (<Stub>s).loading !== undefined;
}

interface PodcastBase {
  ID: number;
}

export interface Podcast extends PodcastBase {
  name: string;
  author: Author | AuthorStub;
  channel: Channel | ChannelStub;
}

export type PodcastStub = Stub & PodcastBase;

interface ChannelBase {
  URL: string;
  lastUpdated: Date;
}

export interface Channel extends ChannelBase {
  description: string;
  episodes: Episode[];
}

export type ChannelStub = Stub & ChannelBase;

interface AuthorBase {
  ID: number | null;
  name: string;
}

export interface Author extends AuthorBase {
  podcasts: Podcast[];
}

export type AuthorStub = Stub & AuthorBase;

export interface Episode {
  ID: string;
  name: string;
  description: string;
  audioURL: string;
}

// Custom error types
export interface ErrorData {
  [key: string]: any;
}

export type PreviousError = Error | ApplicationError | null;

export class ApplicationError {
  name: string;
  message: string;
  code: string;
  prev: PreviousError;
  data?: ErrorData;
  constructor(
    name: string = "ApplicationError",
    message: string = "Application encountered an error",
    code: string = "error",
    prev: PreviousError = null,
    data: ErrorData = {}
  ) {
    this.name = name;
    this.message = message;
    this.code = code;
    this.prev = prev;
    this.data = data;
  }
}
