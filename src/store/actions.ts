import createActions from "./actionsFactory";
import createNetworkService from "../services/NetworkService";
import createITunesService from "../services/ITunesService";
import createRSSService from "../services/RSSService";

const network = createNetworkService();
export default createActions(
  network,
  createITunesService(network, { proxy: true }),
  createRSSService(network, { proxy: true })
);
