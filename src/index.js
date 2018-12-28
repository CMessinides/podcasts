import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import createApp from "./components/App";
import * as serviceWorker from "./serviceWorker";
import createActions from "./store/actionsFactory";
import createNetworkService from "./services/NetworkService";
import createITunesService from "./services/ITunesService";
import createRSSService from "./services/RSSService";

const network = createNetworkService();
const actions = createActions(
  network,
  createITunesService(network),
  createRSSService(network)
);
const App = createApp(actions);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
