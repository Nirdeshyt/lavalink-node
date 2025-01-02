import { RestRequest, SearchResult } from "../..";
import { Manager, Node } from "../..";
import { WebSocket } from "ws";
export declare class Rest {
    manager: Manager;
    node: Node;
    ws: WebSocket | undefined;
    constructor(manager: Manager, node: Node);
    update(data: RestRequest): Promise<any>;
    loadTracks(query: string, source: string): Promise<SearchResult>;
    destroy(guildId: string): Promise<void>;
}
//# sourceMappingURL=Rest.d.ts.map