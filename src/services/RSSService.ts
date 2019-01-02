import { ApplicationError } from "../types";
import XMLParser from "fast-xml-parser";
import {
  RSSService,
  FeedResponseData,
  EpisodeReponseData,
  NetworkService,
  RSSServiceFactoryOpts
} from "./types";

export const RSS_ERROR = "rss/error";
export const RSS_READ_ERROR = "rss/read-error";
export const RSS_INVALID_XML_ERROR = "rss/invalid-xml-error";

type XMLOpts = Partial<XMLParser.X2jOptions>;

interface XMLElementObj {
  [attr: string]: string | number | XMLElementObj;
}

type XMLElement = XMLElementObj | string;

interface XMLItem {
  [key: string]: XMLElement;
}

interface RSSGateway {
  read(xml: string): FeedResponseData;
}

function validateFeed(feed: any): true {
  if (
    typeof feed === "string" ||
    !feed.rss ||
    !feed.rss.channel ||
    !feed.rss.channel.item
  ) {
    throw new ApplicationError(
      "RSSError",
      "RSS service cannot parse invalid XML",
      RSS_INVALID_XML_ERROR,
      null
    );
  }

  return true;
}

function getAttrFromElement(
  el?: XMLElement,
  key: string = "#text"
): string | null {
  if (el && typeof el !== "string" && el[key]) return el[key] as string;
  return null;
}

function getTextFromElement(el?: XMLElement): string | null {
  if (typeof el === "string") return el;
  if (el && el["#text"]) return el["#text"] as string;
  return null;
}

function pickIDFromItem(
  item: Partial<XMLItem>,
  attrPrefix: string = ""
): string {
  return (
    getTextFromElement(item.guid) ||
    getAttrFromElement(item.enclosure, attrPrefix + "url") ||
    ""
  );
}

function pickEpisodeFromItem(item: Partial<XMLItem>): string {
  return getTextFromElement(item["itunes:episode"]) || "";
}

export function createRSSGateway(
  xmlOpts: XMLOpts = { ignoreAttributes: false, attributeNamePrefix: "attr_" },
  parse = XMLParser.parse
): RSSGateway {
  const prefix = xmlOpts.attributeNamePrefix;
  return {
    read(xml: string): FeedResponseData {
      const feed = parse(xml, xmlOpts);

      try {
        validateFeed(feed);
      } catch (error) {
        error.data = {
          ...error.data,
          xml
        };
        throw error;
      }

      const items = Array.isArray(feed.rss.channel.item)
        ? feed.rss.channel.item
        : Array(feed.rss.channel.item);

      const episodes: EpisodeReponseData[] = items.map(
        (item: Partial<XMLItem>): EpisodeReponseData => {
          return {
            entity: "episode",
            ID: pickIDFromItem(item, prefix),
            name:
              getTextFromElement(item.title) ||
              getTextFromElement(item["itunes:title"]) ||
              undefined,
            description:
              getTextFromElement(item.description) ||
              getTextFromElement(item["itunes:summary"]) ||
              undefined,
            episode: parseInt(pickEpisodeFromItem(item), 10) || undefined,
            episodeType:
              getTextFromElement(item["itunes:episodeType"]) || undefined,
            audioURL:
              getAttrFromElement(item["enclosure"], prefix + "url") || ""
          };
        }
      );
      return {
        entity: "feed",
        description: getTextFromElement(feed.rss.channel["title"]) || undefined,
        episodes
      };
    }
  };
}

export default function createRSSService(
  network: NetworkService,
  { proxy = false }: RSSServiceFactoryOpts = {}
): RSSService {
  return {
    async getFeed(url: string) {
      const response = await network.fetch(url, { proxy });

      try {
        var xml = await response.text();
      } catch (error) {
        throw new ApplicationError(
          "RSSError",
          "RSS service cannot read response body",
          RSS_READ_ERROR,
          error,
          { url, response }
        );
      }

      return createRSSGateway().read(xml);
    }
  };
}
