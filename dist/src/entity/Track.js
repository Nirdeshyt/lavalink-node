"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
class Track {
    constructor(data) {
        this.time = 0;
        this.encoded = data.encoded;
        this.identifier = data.info.identifier;
        this.author = data.info.author;
        this.title = data.info.title;
        this.url = data.info.uri;
        this.seekable = data.info.isSeekable;
        this.source = data.info.source;
        this.duration = data.info.length;
        this.stream = data.info.isStream;
        this.isrc = data.info.isrc;
        this.artworkUrl = data.info.artworkUrl;
        this.position = data.info.position;
    }
}
exports.Track = Track;
