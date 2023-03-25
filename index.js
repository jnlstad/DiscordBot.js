const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { Player, useQueue } = require("discord-player")


// Load .env file
dotenv.config()
const TOKEN = process.env.TOKEN;

const client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]});



client.commands = new Discord.Collection();
// Load ./Commands js files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
  }
}



const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(TOKEN)


///Discord Music Player
const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  },

})



player.events.on('playerStart', (queue, track) => {
  // Emitted when the player starts to play a song
  queue.metadata.channel.send(`Started playing: **${track.title} - ${track.author}**`);
});

player.events.on('audioTrackAdd', (queue, track) => {
  // Emitted when the player adds a single song to its queue
  queue.metadata.channel.send(`Track **${track.title} - ${track.author}** queued by **${track.requestedBy.username}**`);
});

player.events.on('audioTracksAdd', (queue, track) => {
  // Emitted when the player adds multiple songs to its queue
  queue.metadata.channel.send(`Multiple Track's queued`);
});

player.events.on('playerSkip', (queue, track) => {
  // Emitted when the audio player fails to load the stream for a song
  queue.metadata.channel.send(`Skipping **${track.title} - ${track.author}** due to an issue!`);
});

// player.events.once('emptyQueue', () => {
//   useQueue(interaction.guildId).options.leaveOnEnd = true;
// });


player.events.on('disconnect', (queue) => {
  // Emitted when the bot leaves the voice channel
  queue.metadata.channel.send(`There's been 5 minutes of inactivity, so my job here is done`);
});

player.events.on('emptyChannel', (queue) => {
  // Emitted when the voice channel has been empty for the set threshold
  // Bot will automatically leave the voice channel with this event
  queue.metadata.channel.send(`Leaving because I was alone for the past 5 minutes :(`);
});