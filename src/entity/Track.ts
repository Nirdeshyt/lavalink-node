

export class Track {
    public encoded: string;
    public identifier: string;
    public author: string;
    public title: string;
    public url?: string;
    public seekable: boolean;
    public source: string;
    public duration: number;
    public stream: boolean;
    public isrc?: string;
    public artworkUrl?: string;
    public position: number;
    public time?: number = 0
    constructor (data: any) {
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