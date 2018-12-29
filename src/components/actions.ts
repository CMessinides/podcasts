import createActions from "../store/actionsFactory";
import createNetworkService from "../services/NetworkService";
import createITunesService from "../services/ITunesService";
import createRSSService from "../services/RSSService";

const network = createNetworkService();
export default createActions(
  network,
  createITunesService(network),
  createRSSService(network)
);
