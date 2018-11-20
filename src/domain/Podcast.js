export default class Podcast {
  constructor(data) {
    this.iTunesID = data.iTunesID;
    this.name = data.name;
    this.feedURL = data.feedURL;
    this.thumbnailURLs = data.thumbnailURLs;
  }
}
