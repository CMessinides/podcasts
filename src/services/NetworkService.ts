import { ApplicationError } from "../types";
import { NetworkService } from "../stores/types";

export const NETWORK_ERROR = "network/error";
export const NETWORK_HTTP_RESPONSE_ERROR = "network/http-response-error";

export default function createNetworkService(
  fetch: GlobalFetch["fetch"] = window.fetch
): NetworkService {
  return {
    async fetch(url: string) {
      try {
        var response = await fetch(url);

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
