import React from "react";
import { State, Action } from "../../store/types";
import { ThunkDispatch } from "redux-thunk";
import actions from "../../store/actions";
import { connect } from "react-redux";
import { Podcast, PodcastData, FeedData, isComplete } from "../../types";

type PodcastHeaderProps = {
  podcast: Partial<
    Pick<Podcast, "pending" | "lastUpdated" | "error"> &
      Pick<PodcastData, "ID" | "name" | "thumbnails" | "author"> &
      Pick<FeedData, "description">
  >;
  fetchPodcast(ID: number): void;
  fetchFeed(ID: number): void;
};

function PodcastHeader(props: PodcastHeaderProps) {
  return null;
}

const mapStateToProps = (
  state: State,
  { ID }: { ID: number }
): PodcastHeaderProps["podcast"] => {
  const podcast = state.podcasts[ID] || { data: { ID } };
  const feed = podcast.data.feed;
  return {
    ID,
    pending: podcast.pending || (feed && feed.pending),
    error: podcast.error || (feed && feed.error),
    lastUpdated: podcast.lastUpdated || (feed && feed.lastUpdated),
    name: podcast.data.name,
    author: podcast.data.author,
    thumbnails: podcast.data.thumbnails,
    description: feed && feed.data.description
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<State, null, Action>) => {
  return {
    fetchPodcast(ID: number) {
      return dispatch(actions.fetchPodcast(ID));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastHeader);
