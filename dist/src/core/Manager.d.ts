import { EventEmitter } from "events";
import { LavalinkConfig, Player, PlayerConfig, Node, Events } from "../..";
export declare interface Manager {
    on<K extends keyof Events>(event: K, listeners: Events[K]): this;
    once<K extends keyof Events>(event: K, listeners: Events[K]): this;
    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): boolean;
}
export declare class Manager extends EventEmitter {
    initialised: boolean;
    sendPayload: (guildId: string, payload: any) => void;
    joinData: Map<string | number, any>;
    players: Map<string | number, Player>;
    nodes: Map<string | number, Node>;
    clientId: string;
    constructor(config: LavalinkConfig);
    init(clientId: string): void;
    createPlayer(config: PlayerConfig): Player | void;
    packetUpdate(packet: any): Promise<void>;
    attemptConnect(guildId: string): Promise<boolean>;
    getPlayer(guildId: string): Player;
    sortNode(): Node;
}
//# sourceMappingURL=Manager.d.ts.map