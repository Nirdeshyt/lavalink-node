import { LavalinkNode, Manager, Rest } from "../..";
import { WebSocket } from "ws";
export declare class Node {
    manager: Manager;
    host: string;
    port: number;
    password: string;
    secure: boolean;
    identifier: string;
    players: number;
    rest: Rest;
    connected: boolean;
    sessionId: string;
    ws: WebSocket;
    constructor(manager: Manager, node: LavalinkNode);
    connect(clientId: string): Promise<void>;
    protected message(data: Buffer): Promise<void>;
}
//# sourceMappingURL=Node.d.ts.map