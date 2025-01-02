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
exports.Rest = void 0;
const __1 = require("../..");
const __2 = require("../..");
class Rest {
    constructor(manager, node) {
        this.manager = manager;
        this.node = node;
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, __2.request)(`http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/v4/sessions/${this.node.sessionId}/players/${data.guildId}?noReplace=true`, {
                method: "PATCH",
                body: JSON.stringify(data.data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.node.password
                }
            });
            return response;
        });
    }
    loadTracks(query, source) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let identifier;
                if (query.startsWith("http://") || query.startsWith("https://")) {
                    identifier = query;
                }
                else {
                    identifier = `${(_a = __2.sources[source]) !== null && _a !== void 0 ? _a : source}:${query}`;
                }
                const response = yield (0, __2.request)(`http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/v4/loadtracks?identifier=${identifier}`, { headers: {
                        Authorization: this.node.password,
                    } });
                const data = new __1.SearchResult(response);
                resolve(data);
            }));
        });
    }
    destroy(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, __2.request)(`http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/v4/sessions/${this.node.sessionId}/players/${guildId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": this.node.password
                }
            });
        });
    }
}
exports.Rest = Rest;
