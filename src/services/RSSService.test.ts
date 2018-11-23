import createRSSService, { createRSSGateway } from "./RSSService";
import { readFileSync } from "fs";

const xmlString = readFileSync(
  __dirname + "/__fixtures__/ringer-nba-feed.xml"
).toString();

function createXML(inner: string): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?><rss><channel>' +
    inner +
    "</channel></rss>"
  );
}

describe("RSS Gateway", () => {
  it("should throw when given an invalid XML string", () => {
    const rss = createRSSGateway();

    expect(() => rss.read("adsfasfwet31g")).toThrow();
    expect(() => rss.read("<rss><foo /></rss>")).toThrow();
    expect(() => rss.read("<rss><channel><foo /></channel></rss>")).toThrow();
    expect(() =>
      rss.read("<rss><channel><item>food</item></channel></rss>")
    ).not.toThrow();
  });

  describe("Parse episode", () => {
    it("should return a valid GUID if present", () => {
      const rss = createRSSGateway();
      const cases = [
        // Case 1: <guid> without attributes
        { input: createXML("<item><guid>guid</guid></item>"), output: "guid" },
        // Case 2: <guid> with attributes
        {
          input: createXML(
            '<item><guid attr="present">guidWithAttr</guid></item>'
          ),
          output: "guidWithAttr"
        },
        // Case 3: no <guid>, <enclosure> with url attribute
        {
          input: createXML('<item><enclosure url="url" /></item>'),
          output: "url"
        },
        // Case 4: no <guid> or <enclosure> url, <itunes:episode> without attributes
        {
          input: createXML("<item><itunes:episode>ep</itunes:episode></item>"),
          output: "ep"
        },
        // Case 5: no <guid> or <enclosure> url, <itunes:episode> with attributes
        {
          input: createXML(
            '<item><itunes:episode attr="value">epWithAttr</itunes:episode></item>'
          ),
          output: "epWithAttr"
        }
      ];

      for (let i = 0; i < cases.length; i++) {
        expect(rss.read(cases[i].input).episodes[0]).toEqual(
          expect.objectContaining({ ID: cases[i].output })
        );
      }
    });
  });

  it("should return a null feed if the XML is missing tags", () => {
    const expected = {
      entity: "feed",
      description: null,
      episodes: [
        {
          entity: "episode",
          ID: null,
          name: "Untitled",
          description: null,
          episode: null,
          episodeType: null,
          audioURL: null
        }
      ]
    };

    expect(
      createRSSGateway().read("<rss><channel><item>foo</item></channel></rss>")
    ).toEqual(expected);
  });
});

describe("RSS Service", () => {
  it("should return a feed of episodes for a given URL", async () => {
    expect.assertions(2);

    const received = await createRSSService(() => {
      return Promise.resolve(new Response(xmlString));
    }).getFeed("https://rss.art19.com/the-ringer-nba-show");
    const expected = {
      entity: "feed",
      description: expect.any(String),
      episodes: expect.any(Array)
    };

    expect(received).toEqual(expected);
    expect(received.episodes).toHaveLength(341); // if you change the fixture, change this number!
  });
});
