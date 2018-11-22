import {
  EpisodeResult,
  FeedResult,
  FetchFn,
  ApplicationError,
  RSSGateway,
  RSSService
} from "../types";
import XMLParser from "fast-xml-parser";
import createNetworkConnection from "./NetworkService";

export const RSS_ERROR = "rss/error";
export const RSS_READ_ERROR = "rss/read-error";
export const RSS_INVALID_XML_ERROR = "rss/invalid-xml-error";

type XMLOpts = Partial<XMLParser.X2jOptions>;

interface XMLElementObj {
  [attr: string]: any;
  "#text"?: string;
}

type XMLElement = XMLElementObj | string;

interface XMLItem {
  [key: string]: XMLElement;
  title: XMLElement;
  description: XMLElement;
  guid: XMLElement;
  enclosure: XMLElement;
  "itunes:title": XMLElement;
  "itunes:summary": XMLElement;
  "itunes:episode": XMLElement;
  "itunes:episodeType": XMLElement;
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
  if (el && typeof el !== "string" && el[key]) return el[key];
  return null;
}

function getTextFromElement(el?: XMLElement): string | null {
  if (typeof el === "string") return el;
  if (el && el["#text"]) return el["#text"];
  return null;
}

function pickGUIDFromItem(
  item: Partial<XMLItem>,
  attrPrefix: string = ""
): string {
  return (
    getTextFromElement(item.guid) ||
    getAttrFromElement(item.enclosure, attrPrefix + "url") ||
    getTextFromElement(item["itunes:episode"]) ||
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
    read(xml: string): FeedResult {
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

      const episodes: EpisodeResult[] = items.map(
        (item: Partial<XMLItem>): EpisodeResult => {
          return {
            guid: pickGUIDFromItem(item, prefix),
            name:
              getTextFromElement(item.title) ||
              getTextFromElement(item["itunes:title"]) ||
              "Untitled",
            description:
              getTextFromElement(item.description) ||
              getTextFromElement(item["itunes:summary"]) ||
              "No description",
            episode: parseInt(pickEpisodeFromItem(item), 10) || undefined,
            episodeType:
              getTextFromElement(item["itunes:episodeType"]) || undefined,
            audioURL:
              getAttrFromElement(item["enclosure"], prefix + "url") || undefined
          };
        }
      );
      return {
        description:
          getTextFromElement(feed.rss.channel["title"]) || "No description",
        episodes
      };
    }
  };
}

export default function createRSSService(
  fetch: FetchFn = window.fetch
): RSSService {
  return {
    async feed(url: string) {
      const response = await createNetworkConnection(fetch).fetch(url);

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
