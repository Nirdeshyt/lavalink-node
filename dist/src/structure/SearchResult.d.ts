import { Track } from "../..";
export declare class SearchResult {
    loadType: "track" | "playlist" | "search" | "empty" | "error";
    name?: string;
    error?: any;
    tracks: Track[];
    constructor(data: any);
}
//# sourceMappingURL=SearchResult.d.ts.map