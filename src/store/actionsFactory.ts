import createNetworkService from "../services/NetworkService";
import createITunesService from "../services/ITunesService";
import createRSSService from "../services/RSSService";
import { ActionCreators } from "../components/types";
import createPodcastActions from "./podcasts/actionsFactory";

export default function createActions(
  network = createNetworkService(),
  iTunes = createITunesService(network),
  RSS = createRSSService(network)
): ActionCreators {
  return {
    ...createPodcastActions(iTunes, RSS)
  };
}
