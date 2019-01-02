import createNetworkService, {
  NETWORK_ERROR,
  NETWORK_HTTP_RESPONSE_ERROR
} from "./NetworkService";
import { setupRecorder } from "nock-record";

const record = setupRecorder();

it("should throw when fetch() errors", async () => {
  expect.assertions(1);

  const expected = expect.objectContaining({
    code: NETWORK_ERROR
  });

  await expect(
    createNetworkService(() => {
      return Promise.reject(new Error("No internet connection"));
    }).fetch("https://networkerror.com/")
  ).rejects.toEqual(expected);
});

it("should throw when response is not OK", async () => {
  expect.assertions(1);

  const { completeRecording, assertScopesFinished } = await record(
    "network-response-failure"
  );

  const expected = expect.objectContaining({
    code: NETWORK_HTTP_RESPONSE_ERROR
  });

  await expect(
    createNetworkService(window.fetch).fetch("http://httpstat.us/404")
  ).rejects.toEqual(expected);

  completeRecording();
  assertScopesFinished();
});

describe("proxy mode", () => {
  const url = "http://someurl.com";
  const fetch = jest.fn(() => Promise.resolve(new Response()));

  afterEach(() => {
    fetch.mockClear();
  });

  it('should default to fetching "/proxy?url=<url>"', async () => {
    expect.assertions(1);

    await createNetworkService(fetch).fetch(url, { proxy: true });

    expect(fetch).toHaveBeenCalledWith("/proxy?url=" + url);
  });

  it("should fetch from a custom proxy endpoint and query key when provided", async () => {
    expect.assertions(1);
    const opts = { proxyEndpoint: "/different-proxy", proxyKey: "target" };

    await createNetworkService(fetch, opts).fetch(url, { proxy: true });

    expect(fetch).toHaveBeenCalledWith(
      `${opts.proxyEndpoint}?${opts.proxyKey}=${url}`
    );
  });
});
