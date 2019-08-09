import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text } from "@storybook/addon-knobs";
import { PodcastViewBase } from "../components/podcasts/PodcastView";
import { fetchPodcastRequested } from "../store/podcasts/actionCreators";
import { CompletePodcast, Podcast } from "../types";

const defaultPodcast: CompletePodcast = {
  pending: false,
  lastUpdated: Date.now(),
  error: undefined,
  data: {
    ID: 1109271715,
    name: text("Podcast Name", "The Ringer NBA Show"),
    author: {
      ID: 1043703531,
      name: text("Author Name", "The Ringer")
    },
    thumbnails: {
      30: "https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/a5/cb/e0/a5cbe0ba-5fe1-b618-007c-e84ff4f92932/source/30x30bb.jpg",
      60: "https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/a5/cb/e0/a5cbe0ba-5fe1-b618-007c-e84ff4f92932/source/60x60bb.jpg",
      100: "https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/a5/cb/e0/a5cbe0ba-5fe1-b618-007c-e84ff4f92932/source/100x100bb.jpg",
      600: "https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/a5/cb/e0/a5cbe0ba-5fe1-b618-007c-e84ff4f92932/source/600x600bb.jpg"
    },
    feed: {
      data: {
        URL: "https://rss.art19.com/the-ringer-nba-show"
      }
    }
  }
};

const pendingPodcast: Podcast = {
  pending: true,
  data: { ID: 1043703531 }
};

const defaultFetchPodcast = () => {
  console.log("Podcast fetch requested");
  return Promise.resolve(fetchPodcastRequested(defaultPodcast.data.ID));
};

storiesOf("PodcastView", module)
  .addDecorator(withKnobs)
  .add("Default", () => (
    <PodcastViewBase
      podcast={{
        pending: false,
        lastUpdated: Date.now(),
        error: undefined,
        data: {
          ID: 1109271715,
          name: text("Podcast Name", "The Ringer NBA Show"),
          author: {
            ID: 1043703531,
            name: text("Author Name", "The Ringer")
          },
          thumbnails: {
            30: "https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/a5/cb/e0/a5cbe0ba-5fe1-b618-007c-e84ff4f92932/source/30x30bb.jpg",
            60: "https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/a5/cb/e0/a5cbe0ba-5fe1-b618-007c-e84ff4f92932/source/60x60bb.jpg",
            100: "https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/a5/cb/e0/a5cbe0ba-5fe1-b618-007c-e84ff4f92932/source/100x100bb.jpg",
            600: "https://is3-ssl.mzstatic.com/image/thumb/Music128/v4/a5/cb/e0/a5cbe0ba-5fe1-b618-007c-e84ff4f92932/source/600x600bb.jpg"
          },
          feed: {
            data: {
              URL: "https://rss.art19.com/the-ringer-nba-show"
            }
          }
        }
      }}
      fetchPodcast={defaultFetchPodcast}
    />
  ))
  .add("Pending", () => (
    <PodcastViewBase
      podcast={pendingPodcast}
      fetchPodcast={defaultFetchPodcast}
    />
  ));
