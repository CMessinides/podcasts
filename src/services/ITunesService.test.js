import ITunesService from "./ITunesService";
import { setupRecorder } from "nock-record";
import { Podcast, Author } from "../domain";

function createErrorService() {
  return new ITunesService("https://itunes.apple.com", () =>
    Promise.reject(new Error("No internet connection"))
  );
}

const record = setupRecorder();

it("should return errors when fetch errors", async () => {
  expect.assertions(2);

  const iTunes = createErrorService();
  let received;
  const podcastsExpected = {
    error: expect.any(Error),
    podcasts: []
  };
  const authorsExpected = {
    error: expect.any(Error),
    authors: []
  };

  // Search podcasts
  received = await iTunes.searchPodcasts({ term: "food" });
  expect(received).toEqual(podcastsExpected);

  // Search authors
  received = await iTunes.searchAuthors({ term: "BBC" });
  expect(received).toEqual(authorsExpected);

  // TODO: Get podcast

  // TODO: Get author
});

it("should return errors when response is not OK", async () => {
  expect.assertions(2);

  const iTunes = new ITunesService("https://itunes.apple.com");
  let completeRecording, assertScopesFinished;
  let received;
  const podcastsExpected = {
    error: expect.any(Error),
    podcasts: []
  };
  const authorsExpected = {
    error: expect.any(Error),
    authors: []
  };

  // Search podcasts
  ({ completeRecording, assertScopesFinished } = await record(
    "search-podcasts-failure"
  ));
  received = await iTunes.searchPodcasts({
    term: "food",
    country: "foo"
  });

  completeRecording();
  assertScopesFinished();

  expect(received).toEqual(podcastsExpected);

  // Search authors
  ({ completeRecording, assertScopesFinished } = await record(
    "search-authors-failure"
  ));
  received = await iTunes.searchAuthors({
    term: "BBC",
    country: "foo"
  });

  completeRecording();
  assertScopesFinished();

  expect(received).toEqual(authorsExpected);

  // TODO: Get podcast

  // TODO: Get author
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
    const expected = {
      error: null,
      podcasts: [expect.any(Podcast), expect.any(Podcast), expect.any(Podcast)]
    };

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
    const expected = {
      error: null,
      authors: [expect.any(Author), expect.any(Author)]
    };

    completeRecording();
    assertScopesFinished();

    expect(received).toEqual(expected);
  });
});
