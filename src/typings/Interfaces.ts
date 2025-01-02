import { Node, Player, Track } from "../..";
export interface LavalinkNode {
    host: string,
    port: number,
    password: string,
    secure: boolean,
    identifier: string,
    sessionId: string,
}
export interface LavalinkConfig {
    nodes: LavalinkNode[],
    sendPayload: (guildId: string, payload: any) => void
}
export interface PlayerConfig {
    guildId: string,
    voiceChannelId: string,
    textChannelId: string,
    loopType?: number,
}
export interface VoiceStats {
    token?: string,
    endpoint?: string,
    sessionId?: string
}
  export interface RestRequest {
    guildId: string,
    data: Object,
  }
  export interface Events {
    "debug": (data: string) => void,
    "nodeConnect": (node: Node) => void,
    "nodeDisconnect": (node: Node, code: number, reason: string) => void,
    "trackStart": (player: Player, track: any) => void,
    "trackFinish": (player: Player, track: any) => void,
    "voiceChannelUpdate": (oldChannelId: string, newChannelId: string, player: Player) => void,
    "playerDelete": (guildId: string) => void,
    "playerCreate": (player: Player) => void,
    "playerUpdate": (player: Player, track: Track) => void,
  }
  