import { Manager, PlayerConfig, VoiceStats, Node, Queue, wait, LoopType, Track } from "../..";

export class Player {
    public manager: Manager;
    public guildId: string;
    public node: Node;
    public loopType: number;
    public connected: boolean = false;
    public playing: boolean = false;
    public paused: boolean = false;
    public voiceChannelId: string;
    public textChannelId: string;
    public volume: number = 100
    public voiceStats: VoiceStats = {};
    public queue: Queue = new Queue();
    public current!: any;
    public ping: number = 0;
    constructor (manager: Manager, config: PlayerConfig, node: Node){
        this.manager = manager
        this.guildId = config.guildId
        this.voiceChannelId = config.voiceChannelId
        this.textChannelId = config.textChannelId
        this.node = node
        this.loopType = config.loopType || LoopType.None
    }
    public join(): void {
        this.manager.sendPayload(this.guildId, {
          op: 4,
          d: {
            guild_id: this.guildId,
            channel_id: this.voiceChannelId,
            self_mute: false,
            self_deaf: true
          }
        }                  
  )
  this.connected = true
    }
    public leave(): void {
      this.manager.sendPayload(this.guildId, {
        op: 4,
        d: {
          guild_id: this.guildId,
          channel_id: null,
          self_mute: false,
          self_deaf: true
        }
      }                  
)
this.connected = false
    }
    public async play(): Promise<void> {
        return new Promise(async (resolve, reject) => {
          if(!this.queue.size()) return;
          setTimeout(async () => {
            this.current = this.queue.shift()
            const response = await this.node.rest.update({
                guildId: this.guildId,
                data: {
                  track: {
                    encoded: this.current.encoded,
                  },
                  volume: this.volume,
                },
            })
            this.playing = true
          }, 4000)
        })
    }

    public async stop(): Promise<void> {
      return new Promise(async (resolve, reject) => {
        await this.node.rest.update({
          guildId: this.guildId,
          data: {
            track: {
              encoded: null,
            }
          }
        })
          this.queue.clear()
          this.connected = false
          this.playing = false
      })
    }
    public async pause(): Promise<void> {
      if(this.paused) return
      await this.node.rest.update({
        guildId: this.guildId,
        data: {
          pause: true
        }
      })
      this.paused = true
    }
    public async resume(): Promise<void> {
      if(this.paused) return
      await this.node.rest.update({
        guildId: this.guildId,
        data: {
          pause: false
        }
      })
      this.paused = false
    }
    public async delete(): Promise<void> {
      await this.node.rest.destroy(this.guildId)
      this.connected = false
      this.playing = false
    }

}