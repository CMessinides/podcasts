import ITunesService, {
  translatePodcast,
  translateAuthor
} from "./ITunesService";
import { setupRecorder } from "nock-record";
import { Podcast, Author } from "../domain";
import { readFileSync } from "fs";

function createErrorService() {
  return new ITunesService("https://itunes.apple.com", () =>
    Promise.reject(new Error("No internet connection"))
  );
}

const record = setupRecorder();

it("should throw when fetch errors", async () => {
  expect.assertions(4);

  const iTunes = createErrorService();
  const expected = expect.any(Error);

  // Search podcasts
  await expect(iTunes.searchPodcasts({ term: "food" })).rejects.toEqual(
    expected
  );

  // Search authors
  await expect(iTunes.searchAuthors({ term: "BBC" })).rejects.toEqual(expected);

  // Get podcast
  await expect(iTunes.getPodcast(1109271715)).rejects.toEqual(expected);

  // Get author
  await expect(iTunes.getAuthor(1043703531)).rejects.toEqual(expected);
});

it("should throw when response is not OK", async () => {
  expect.assertions(2);

  const iTunes = new ITunesService("https://itunes.apple.com");
  let completeRecording, assertScopesFinished;
  let expected = expect.any(Error);

  // Search podcasts
  ({ completeRecording, assertScopesFinished } = await record(
    "search-podcasts-failure"
  ));

  await expect(
    iTunes.searchPodcasts({
      term: "food",
      country: "foo"
    })
  ).rejects.toEqual(expected);

  completeRecording();
  assertScopesFinished();

  // Search authors
  ({ completeRecording, assertScopesFinished } = await record(
    "search-authors-failure"
  ));

  await expect(
    iTunes.searchAuthors({
      term: "BBC",
      country: "foo"
    })
  ).rejects.toEqual(expected);

  completeRecording();
  assertScopesFinished();
});

describe("searchPodcasts", () => {
  it("should return a list of podcasts", async () => {
    expect.assertions(1);

    // mock the HTTP call with a fixture
    const { completeRecording, assertScopesFinished } = await record(
      "search-podcasts-success"
    );

    const iTunes = new ITunesService("https://itunes.apple.com");
    const received = await iTunes.searchPodcasts({ term: "food", limit: 3 });
    const expected = [
      expect.any(Podcast),
      expect.any(Podcast),
      expect.any(Podcast)
    ];

    completeRecording();
    assertScopesFinished();

    expect(received).toEqual(expected);
  });
});

describe("searchAuthors", () => {
  it("should return a list of authors", async () => {
    expect.assertions(1);

    // mock the HTTP call with a fixture
    const { completeRecording, assertScopesFinished } = await record(
      "search-authors-success"
    );

    const iTunes = new ITunesService("https://itunes.apple.com");
    const received = await iTunes.searchAuthors({ term: "BBC", limit: 2 });
    const expected = [expect.any(Author), expect.any(Author)];

    completeRecording();
    assertScopesFinished();

    expect(received).toEqual(expected);
  });
});

describe("getPodcast", () => {
  it("should throw if given a non-integer ID", async () => {
    expect.assertions(1);

    const iTunes = new ITunesService("https://itunes.apple.com/");

    await expect(iTunes.getPodcast("foo")).rejects.toEqual(expect.any(Error));
  });

  it("should return a podcast", async () => {
    expect.assertions(1);

    const { completeRecording, assertScopesFinished } = await record(
      "get-podcast-success"
    );

    const iTunes = new ITunesService("https://itunes.apple.com/");
    const received = await iTunes.getPodcast(1109271715);
    const expected = expect.any(Podcast);

    completeRecording();
    assertScopesFinished();

    expect(received).toEqual(expected);
  });
});

describe("getAuthor", () => {
  it("should throw if given a non-integer ID", async () => {
    expect.assertions(1);

    const iTunes = new ITunesService("https://itunes.apple.com/");

    await expect(iTunes.getAuthor("foo")).rejects.toEqual(expect.any(Error));
  });

  it("should return an author", async () => {
    expect.assertions(1);

    const { completeRecording, assertScopesFinished } = await record(
      "get-author-success"
    );

    const iTunes = new ITunesService("https://itunes.apple.com/");
    const received = await iTunes.getAuthor(1043703531);
    const expected = expect.any(Author);

    completeRecording();
    assertScopesFinished();

    expect(received).toEqual(expected);
  });
});

describe("translatePodcast", () => {
  it("should translate the raw API response into a podcast model", () => {
    const result = JSON.parse(
      readFileSync(__dirname + "/__fixtures__/podcast-list.json")
    ).results[0];
    const received = translatePodcast(result);
    const expected = new Podcast({
      iTunesID: result.collectionId,
      name: result.collectionName,
      feedURL: result.feedUrl,
      thumbnailURLs: {
        "30": result.artworkUrl30,
        "60": result.artworkUrl60,
        "100": result.artworkUrl100,
        "600": result.artworkUrl600
      }
    });

    expect(received).toEqual(expected);
  });
});

describe("translateAuthor", () => {
  it("should translate the raw API response into an author model", () => {
    const result = JSON.parse(
      readFileSync(__dirname + "/__fixtures__/author-list.json")
    ).results[0];
    const received = translateAuthor(result);
    const expected = new Author({
      iTunesID: result.artistId,
      name: result.artistName
    });

    expect(received).toEqual(expected);
  });
});
