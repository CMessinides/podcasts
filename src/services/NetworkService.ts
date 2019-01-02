import { ApplicationError } from "../types";
import { NetworkService, NetworkServiceFactoryOpts } from "./types";

export const NETWORK_ERROR = "network/error";
export const NETWORK_HTTP_RESPONSE_ERROR = "network/http-response-error";

export default function createNetworkService(
  fetch: GlobalFetch["fetch"] = window.fetch,
  { proxyEndpoint = "/proxy", proxyKey = "url" }: NetworkServiceFactoryOpts = {}
): NetworkService {
  return {
    async fetch(url: string, { proxy = false }: { proxy?: boolean } = {}) {
      try {
        var response = await fetch(
          proxy ? `${proxyEndpoint}?${proxyKey}=${url}` : url
        );

        if (!response.ok) {
          throw new ApplicationError(
            "NetworkError",
            `Network service encountered HTTP error: Status ${
              response.status
            } - ${response.statusText}`,
            NETWORK_HTTP_RESPONSE_ERROR,
            null,
            { url, response }
          );
        }
      } catch (error) {
        if (error instanceof ApplicationError) throw error;

        throw new ApplicationError(
          "NetworkError",
          "Network service encountered network error",
          NETWORK_ERROR,
          error,
          { url }
        );
      }

      return response;
    }
  };
}
