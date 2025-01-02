import { Track } from "../.."

export class SearchResult {
    public loadType: "track"| "playlist" | "search" | "empty" | "error";
    public name?: string;
    public error?: any;
    public tracks: Track[] = [];
    constructor (data: any) {
        this.loadType = data.loadType
        if(data.loadType === "track"){
            this.tracks.push(new Track(data.data))
        } else if(data.loadType === "playlist"){
            this.name = data.data.info.name
            data.data.tracks.forEach((track: any) => {
                this.tracks.push(new Track(track))
            })
        } else if(data.loadType === "search"){
            data.data.forEach((track: any) => {
                this.tracks.push(new Track(track))
            })
        } else if(data.loadType === "empty"){
            this.tracks = []
        } else if(data.loadType === "error")
            this.tracks = []
            this.error = data.data
    }
}