import React from "react";
import { Router as ReachRouter } from "@reach/router";
import Podcast from "./podcasts/Podcast";

export default function Router() {
  return (
    <ReachRouter>
      <Podcast path="podcasts/:ID" />
    </ReachRouter>
  );
}
