import createITunesService, { createITunesGateway } from "./ITunesService";
import { setupRecorder } from "nock-record";
import { readFileSync } from "fs";
import { PodcastInputData, AuthorInputData } from "../repositories/types";

const record = setupRecorder();

const podcastResp = JSON.parse(
  readFileSync(__dirname + "/__fixtures__/podcast-list.json").toString()
);
const authorResp = JSON.parse(
  readFileSync(__dirname + "/__fixtures__/author-list.json").toString()
);

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
    x30: expect.any(String),
    x60: expect.any(String),
    x100: expect.any(String),
    x600: expect.any(String)
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
    const expected: PodcastInputData = {
      entity: "podcast",
      ID: p.collectionId,
      authorID: p.artistId,
      name: p.collectionName,
      censoredName: p.collectionCensoredName,
      explicit: p.collectionExplicitness === "explicit",
      thumbnailURLs: {
        x30: p.artworkUrl30,
        x60: p.artworkUrl60,
        x100: p.artworkUrl100,
        x600: p.artworkUrl600
      }
    };

    expect(received).toEqual(expected);
  });

  it("should create an author from the iTunes artist response", () => {
    const a = authorResp.results[0];
    const received = createITunesGateway().read(a);
    const expected: AuthorInputData = {
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

    it("should return null if ID does not match any record", async () => {
      expect.assertions(2);

      const itunes = createITunesService({
        async fetch() {
          return await Promise.resolve(
            new Response('{ "resultCount": 0, "results": [] }')
          );
        }
      });

      await expect(itunes.getPodcastByID(1109271715)).resolves.toBeNull();

      await expect(itunes.getAuthorByID(1043703531)).resolves.toBeNull();
    });
  });
});
