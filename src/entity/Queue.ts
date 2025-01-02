import { Player, Track } from "../..";

export class Queue {
    public queue: Track[] = [];

    public add(track: Track): void {
       this.queue.push(track)
    }
    public clear(): void {
        this.queue = []
    }
    public size(): number {
        return this.queue.length
    }
    public shift(): any {
        return this.queue.shift()
    }
}