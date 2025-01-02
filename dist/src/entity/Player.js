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
exports.Player = void 0;
const __1 = require("../..");
class Player {
    constructor(manager, config, node) {
        this.connected = false;
        this.playing = false;
        this.paused = false;
        this.volume = 100;
        this.voiceStats = {};
        this.queue = new __1.Queue();
        this.ping = 0;
        this.manager = manager;
        this.guildId = config.guildId;
        this.voiceChannelId = config.voiceChannelId;
        this.textChannelId = config.textChannelId;
        this.node = node;
        this.loopType = config.loopType || __1.LoopType.None;
    }
    join() {
        this.manager.sendPayload(this.guildId, {
            op: 4,
            d: {
                guild_id: this.guildId,
                channel_id: this.voiceChannelId,
                self_mute: false,
                self_deaf: true
            }
        });
        this.connected = true;
    }
    leave() {
        this.manager.sendPayload(this.guildId, {
            op: 4,
            d: {
                guild_id: this.guildId,
                channel_id: null,
                self_mute: false,
                self_deaf: true
            }
        });
        this.connected = false;
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!this.queue.size())
                    return;
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    this.current = this.queue.shift();
                    const response = yield this.node.rest.update({
                        guildId: this.guildId,
                        data: {
                            track: {
                                encoded: this.current.encoded,
                            },
                            volume: this.volume,
                        },
                    });
                    this.playing = true;
                }), 4000);
            }));
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield this.node.rest.update({
                    guildId: this.guildId,
                    data: {
                        track: {
                            encoded: null,
                        }
                    }
                });
                this.queue.clear();
                this.connected = false;
                this.playing = false;
            }));
        });
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.paused)
                return;
            yield this.node.rest.update({
                guildId: this.guildId,
                data: {
                    pause: true
                }
            });
            this.paused = true;
        });
    }
    resume() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.paused)
                return;
            yield this.node.rest.update({
                guildId: this.guildId,
                data: {
                    pause: false
                }
            });
            this.paused = false;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.node.rest.destroy(this.guildId);
            this.connected = false;
            this.playing = false;
        });
    }
}
exports.Player = Player;
