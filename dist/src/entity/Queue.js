"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    constructor() {
        this.queue = [];
    }
    add(track) {
        this.queue.push(track);
    }
    clear() {
        this.queue = [];
    }
    size() {
        return this.queue.length;
    }
    shift() {
        return this.queue.shift();
    }
}
exports.Queue = Queue;
