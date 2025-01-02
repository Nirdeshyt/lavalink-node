# Lavalink-Node

Lavalink-Node is a library for interacting with Lavalink, a standalone audio streaming server, making it easy to integrate high-quality music playback into your Discord bot. This library simplifies managing Lavalink nodes, creating players, and streaming audio.

## Features
- Lightweight and efficient.
- Supports multiple Lavalink nodes.
- Easily manage players and queues.
- Full support for events and payload handling.

## Installation

Install the package via npm:

```bash
npm install lavalink-node
```

## Requirements
- Node.js v16 or higher.
- A working Lavalink server.
- A Discord bot token.

## Usage Example

Here's a simple example to get started with `Lavalink-Node`:

### Setting Up the Client and Manager

```javascript
const { Manager } = require("lavalink-node");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ]
});

const manager = new Manager({
  nodes: [
    {
      host: "localhost",
      port: 443,
      password: "testlavalink",
      secure: false,
      identifier: "Local Node",
    },
  ],
  sendPayload: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload), // Or client.ws._ws.send(0, payload) if you don't have sharding setup
});

manager.on("nodeCreate", (node) => {
  console.log(`Node ${node.identifier} has been created`);
});

manager.on("nodeReady", (node) => {
  console.log(`Node ${node.identifier} is ready`);
});

client.on("ready", () => {
  console.log("Client ready");
  manager.init(client.user.id);
});

client.on("raw", (packet) => manager.packetUpdate(packet)); // send raw packet to lavalink-node for handling

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ").slice(1);

  if (message.content.startsWith("play")) {
    const player =
      manager.getPlayer(message.guild.id) ||
      manager.createPlayer({
        guildId: message.guild.id,
        voiceChannelId: message.member.voice.channel.id, // Replace with your voice channel ID.
        textChannelId: message.channel.id,
      });

    const response = await player.node.rest.loadTracks(args.join(" "), "soundcloud"); // send link as first arg and empty search platform

    if (response.loadType === "search" || response.loadType === "playlist"){
    response.tracks.forEach(track => {
        player.queue.add(track);
      });
    } else if(response.loadType !== "empty" || response.loadType !== "error"){
      player.queue.add(response.tracks[0])
    } else {
      return
    }
    if(!player.connected) await player.join()
    if(!player.playing) await player.play()
  }
});

client.login("YOUR_BOT_TOKEN"); // Replace with your bot token.
```

## Events
The `Manager` and `Player` classes emit various events:

### Manager Events
- **nodeCreate**: Triggered when a Lavalink node is created.
- **nodeReady**: Triggered when a Lavalink node is ready.

### Player Events
- **trackStart**: Triggered when a player starts playing a track.
- **trackFinish**: Triggered when a track ends.

## API Reference

### `Manager`
- **`Manager(options)`**: Initializes the manager with Lavalink nodes.
- **`manager.init(clientId)`**: Initializes the manager with the bot's client ID.
- **`manager.createPlayer(options)`**: Creates a player for a guild.
- **`manager.getPlayer(guildId)`**: Gets the player for a specific guild.
- **`manager.packetUpdate(packet)`**: Updates the manager with raw Discord packets.

### `Player`
- **`player.play()`**: Starts playing the first track in the queue.
- **`player.stop()`**: Stops the current track.
- **`player.pause()`**: Pauses the playback.
- **`player.resume()`**: Resumes the playback.
- **`player.queue.add(track)`**: Adds a track to the queue.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to report bugs or suggest features.

## License
This project is licensed under the MIT License.
