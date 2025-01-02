"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResult = void 0;
const __1 = require("../..");
class SearchResult {
    constructor(data) {
        this.tracks = [];
        this.loadType = data.loadType;
        if (data.loadType === "track") {
            this.tracks.push(new __1.Track(data.data));
        }
        else if (data.loadType === "playlist") {
            this.name = data.data.info.name;
            data.data.tracks.forEach((track) => {
                this.tracks.push(new __1.Track(track));
            });
        }
        else if (data.loadType === "search") {
            data.data.forEach((track) => {
                this.tracks.push(new __1.Track(track));
            });
        }
        else if (data.loadType === "empty") {
            this.tracks = [];
        }
        else if (data.loadType === "error")
            this.tracks = [];
        this.error = data.data;
    }
}
exports.SearchResult = SearchResult;
