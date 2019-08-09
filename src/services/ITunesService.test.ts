import createITunesService, { createITunesGateway } from "./ITunesService";
import { setupRecorder } from "nock-record";
import { readFileSync } from "fs";
import { PodcastResponseData, AuthorResponseData } from "./types";
import { ApplicationError } from "../types";

const record = setupRecorder();

const podcastJSON = readFileSync(
  __dirname + "/__fixtures__/podcast-list.json"
).toString();
const authorJSON = readFileSync(
  __dirname + "/__fixtures__/author-list.json"
).toString();

const podcastResp = JSON.parse(podcastJSON);
const authorResp = JSON.parse(authorJSON);

const defaultNetworkService = {
  async fetch(url: string) {
    const resp = await window.fetch(url);
    if (!resp.ok) throw new Error("Response is not OK");
    return resp;
  }
};

const anyPodcast = expect.objectContaining({
  entity: "podcast",
  ID: expect.any(Number),
  name: expect.any(String),
  censoredName: expect.any(String),
  explicit: expect.any(Boolean),
  thumbnailURLs: {
    30: expect.any(String),
    60: expect.any(String),
    100: expect.any(String),
    600: expect.any(String)
  }
});

const anyAuthor = expect.objectContaining({
  entity: "author",
  ID: expect.any(Number),
  name: expect.any(String)
});

describe("iTunes Gateway", () => {
  it("should create a podcast from the iTunes track response", () => {
    const p = podcastResp.results[0];
    const received = createITunesGateway().read(p);
    const expected: PodcastResponseData = {
      entity: "podcast",
      ID: p.collectionId,
      author: {
        ID: p.artistId,
        name: p.artistName
      },
      name: p.collectionName,
      censoredName: p.collectionCensoredName,
      explicit: p.collectionExplicitness === "explicit",
      feedURL: p.feedUrl,
      thumbnailURLs: {
        30: p.artworkUrl30,
        60: p.artworkUrl60,
        100: p.artworkUrl100,
        600: p.artworkUrl600
      }
    };

    expect(received).toEqual(expected);
  });

  it("should create an author from the iTunes artist response", () => {
    const a = authorResp.results[0];
    const received = createITunesGateway().read(a);
    const expected: AuthorResponseData = {
      entity: "author",
      ID: a.artistId,
      name: a.artistName
    };

    expect(received).toEqual(expected);
  });
});

describe("iTunes Service", () => {
  describe("search", () => {
    it("should search podcasts", async () => {
      expect.assertions(1);

      const { completeRecording, assertScopesFinished } = await record(
        "itunes-podcast-search"
      );

      const received = await createITunesService(
        defaultNetworkService
      ).searchPodcasts("food");
      const expected = expect.arrayContaining([anyPodcast]);

      completeRecording();
      assertScopesFinished();

      expect(received).toEqual(expected);
    });

    it("should search authors", async () => {
      expect.assertions(1);

      const { completeRecording, assertScopesFinished } = await record(
        "itunes-author-search"
      );

      const received = await createITunesService(
        defaultNetworkService
      ).searchAuthors("ringer");
      const expected = expect.arrayContaining([anyAuthor]);

      completeRecording();
      assertScopesFinished();

      expect(received).toEqual(expected);
    });

    it("should allow a limit on search results", async () => {
      expect.assertions(2);

      const itunes = createITunesService(defaultNetworkService);

      let { completeRecording, assertScopesFinished } = await record(
        "itunes-limit-podcast-search"
      );

      await expect(
        itunes.searchPodcasts("food", { limit: 2 })
      ).resolves.toHaveLength(2);

      completeRecording();
      assertScopesFinished();

      ({ completeRecording, assertScopesFinished } = await record(
        "itunes-limit-author-search"
      ));

      await expect(
        itunes.searchAuthors("ringer", { limit: 1 })
      ).resolves.toHaveLength(1);

      completeRecording();
      assertScopesFinished();
    });
  });

  describe("get by ID", () => {
    it("should get a podcast if ID is valid", async () => {
      expect.assertions(1);

      const { completeRecording, assertScopesFinished } = await record(
        "itunes-podcast-lookup"
      );

      const received = await createITunesService(
        defaultNetworkService
      ).getPodcastByID(262727638);
      const expected = anyPodcast;

      completeRecording();
      assertScopesFinished();

      expect(received).toEqual(expected);
    });

    it("should get an author if ID is valid", async () => {
      expect.assertions(1);

      const { completeRecording, assertScopesFinished } = await record(
        "itunes-author-lookup"
      );

      const received = await createITunesService(
        defaultNetworkService
      ).getAuthorByID(1134742667);
      const expected = anyAuthor;

      completeRecording();
      assertScopesFinished();

      expect(received).toEqual(expected);
    });

    it("should throw if ID does not match any record", async () => {
      expect.assertions(2);

      const itunes = createITunesService({
        async fetch() {
          return await Promise.resolve(
            new Response('{ "resultCount": 0, "results": [] }')
          );
        }
      });

      await expect(itunes.getPodcastByID(1109271715)).rejects.toEqual(
        expect.any(ApplicationError)
      );

      await expect(itunes.getAuthorByID(1043703531)).rejects.toEqual(
        expect.any(ApplicationError)
      );
    });

    describe("podcast", () => {
      it("should throw if ID matches an author", async () => {
        expect.assertions(1);

        const iTunes = createITunesService({
          async fetch() {
            return await Promise.resolve(new Response(authorJSON));
          }
        });

        await expect(iTunes.getPodcastByID(1)).rejects.toEqual(
          expect.any(ApplicationError)
        );
      });
    });

    describe("author", () => {
      it("should throw if ID matches a podcast", async () => {
        expect.assertions(1);

        const iTunes = createITunesService({
          async fetch() {
            return await Promise.resolve(new Response(podcastJSON));
          }
        });

        await expect(iTunes.getAuthorByID(1)).rejects.toEqual(
          expect.any(ApplicationError)
        );
      });
    });
  });
});
