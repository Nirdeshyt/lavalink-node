"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const events_1 = require("events");
const __1 = require("../..");
class Manager extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.initialised = false;
        this.joinData = new Map();
        this.players = new Map();
        this.nodes = new Map();
        this.sendPayload = config.sendPayload;
        config.nodes.forEach((node) => {
            const nodeObj = new __1.Node(this, node);
            this.nodes.set(node.identifier, nodeObj);
        });
    }
    init(clientId) {
        this.initialised = true;
        this.clientId = clientId;
        this.nodes.forEach((node) => __awaiter(this, void 0, void 0, function* () {
            yield node.connect(clientId);
        }));
    }
    createPlayer(config) {
        if (!this.initialised)
            return;
        const node = this.sortNode();
        const player = new __1.Player(this, config, node);
        this.players.set(config.guildId, player);
        this.emit("playerCreate", player);
        return player;
    }
    packetUpdate(packet) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.initialised)
                return;
            if (!["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(packet.t))
                return;
            if (!packet.d.token && !packet.d.session_id)
                return;
            const player = this.getPlayer(packet.d.guild_id);
            if (!player)
                return;
            if (packet.t === "VOICE_STATE_UPDATE") {
                if (packet.d.user_id !== this.clientId)
                    return;
                player.voiceStats.sessionId = packet.d.session_id;
                yield this.attemptConnect(packet.d.guild_id);
            }
            else if (packet.t === "VOICE_SERVER_UPDATE") {
                player.voiceStats.endpoint = packet.d.endpoint;
                player.voiceStats.token = packet.d.token;
                yield this.attemptConnect(packet.d.guild_id);
            }
        });
    }
    attemptConnect(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = this.getPlayer(guildId);
            if (!player.voiceStats.endpoint || !player.voiceStats.token || !player.voiceStats.sessionId)
                return false;
            yield player.node.rest.update({
                guildId: guildId,
                data: {
                    voice: {
                        endpoint: player.voiceStats.endpoint,
                        sessionId: player.voiceStats.sessionId,
                        token: player.voiceStats.token,
                    }
                }
            });
            return true;
        });
    }
    getPlayer(guildId) {
        const player = this.players.get(guildId);
        return player;
    }
    sortNode() {
        let nodes = [...this.nodes.values()].filter(node => node.connected);
        if (nodes.length === 0)
            throw new Error("No connected nodes");
        return nodes.sort((a, b) => a.players - b.players)[0];
    }
}
exports.Manager = Manager;
