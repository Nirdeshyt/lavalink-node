import { EventEmitter } from "events";
import { LavalinkConfig, LavalinkNode, Player, PlayerConfig, Node, Events } from "../..";

export declare interface Manager {
    on<K extends keyof Events>(event: K, listeners: Events[K]): this;
    once<K extends keyof Events>(event: K, listeners: Events[K]): this;
    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): boolean;
}

export class Manager extends EventEmitter {
    public initialised: boolean = false;
    public sendPayload: (guildId: string, payload: any) => void
    public joinData: Map<string|number, any> = new Map();
    public players: Map<string|number, Player> = new Map();
    public nodes: Map<string|number, Node> = new Map();
    public clientId!: string;
   
    constructor (config: LavalinkConfig) {
       super()
       this.sendPayload = config.sendPayload
       config.nodes.forEach((node) => {
        const nodeObj = new Node(this, node)
        this.nodes.set(node.identifier, nodeObj)
       })
    }

    public init(clientId: string): void {
        this.initialised = true
        this.clientId = clientId
        this.nodes.forEach(async (node) => {
            await node.connect(clientId)
        })
    }

    public createPlayer(config: PlayerConfig): Player | void {
        if(!this.initialised) return
        const node = this.sortNode();
            const player = new Player(this, config, node);
            this.players.set(config.guildId, player);
            this.emit("playerCreate", player)
            return player;
    }

    public async packetUpdate(packet: any): Promise<void> {
        if(!this.initialised) return;
        if (!["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(packet.t)) return;
    
        if (!packet.d.token && !packet.d.session_id) return;
    
        const player = this.getPlayer(packet.d.guild_id);
        if(!player) return
    
        if (packet.t === "VOICE_STATE_UPDATE") {
            if(packet.d.user_id !== this.clientId) return;
            player.voiceStats.sessionId = packet.d.session_id;
            await this.attemptConnect(packet.d.guild_id)
        } else if (packet.t === "VOICE_SERVER_UPDATE") {
            player.voiceStats.endpoint = packet.d.endpoint;
            player.voiceStats.token = packet.d.token;
            await this.attemptConnect(packet.d.guild_id)
        }
    }

    public async attemptConnect(guildId: string): Promise<boolean> {
      const player = this.getPlayer(guildId)
      if(!player.voiceStats.endpoint || !player.voiceStats.token || !player.voiceStats.sessionId) return false;
      await player.node.rest.update({
        guildId: guildId,
        data: {
            voice: {
                endpoint: player.voiceStats.endpoint,
                sessionId: player.voiceStats.sessionId,
                token: player.voiceStats.token,
            }
        }
      })
      return true
    }

    public getPlayer(guildId: string): Player {
        const player: Player = this.players.get(guildId)!;
        return player;
    }

    public sortNode(): Node {
        let nodes = [...this.nodes.values()].filter(node => node.connected);
        
        if(nodes.length === 0) throw new Error("No connected nodes");
        
        return nodes.sort((a, b) => a.players - b.players)[0];
    }
}
