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
exports.sources = void 0;
exports.request = request;
exports.wait = wait;
function request(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield fetch(url, options).then(res => res.json());
        return request;
    });
}
function wait(time) {
    return __awaiter(this, void 0, void 0, function* () {
        setTimeout(() => {
            return;
        }, time * 1000);
    });
}
exports.sources = {
    youtube: "ytsearch",
    soundcloud: "scsearch",
    youtubemusic: "ytmsearch",
    local: "local",
};
