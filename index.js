const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { message_delete } = require('./functions/discord_funcs.js')
const { Player, useQueue } = require("discord-player")
const { deployAllCommands } = require('./deploy-commands.js');

// Load .env file
dotenv.config({ path: 'env_files\\.env' })
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

//Deploys commands
deployAllCommands();

client.login(TOKEN)


///Discord Music Player
const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  },

})



player.events
  .on('playerStart', (queue, track) => {
    // Emitted when the player starts to play a song
    let channel_data = queue.metadata.channel.send(`Started playing: **${track.title} - ${track.author}**`);
    message_delete(client, channel_data, 20 * 1000);
})
  .once('audioTrackAdd', (queue) => {
  // leaveOnEnd is set to false, so the player will not leave the channel when the queue is empty
  useQueue(queue.metadata.guildId).options.leaveOnEnd = false;
})
  .on('audioTrackAdd', (queue, track) => {
  // Emitted when the player adds a single song to its queue
  channel_data = queue.metadata.channel.send(`Track **${track.title} - ${track.author}** queued by **${track.requestedBy.username}**`);
  message_delete(client, channel_data, 20 * 1000);
})
  .on('audioTracksAdd', (queue, track) => {
  // Emitted when the player adds multiple songs to its queue
  let channel_data = queue.metadata.channel.send(`Multiple Track's queued`);
  message_delete(client, channel_data, 20 * 1000);
})
  .on('playerSkip', (queue, track) => {
  // Emitted when the audio player fails to load the stream for a song
  let channel_data = queue.metadata.channel.send(`Skipping **${track.title} - ${track.author}** due to an issue!`);
  message_delete(client, channel_data, 20 * 1000);
})
  .on('emptyChannel', (queue) => {
  // Emitted when the voice channel has been empty for the set threshold
  // Bot will automatically leave the voice channel with this event
  let channel_data = queue.metadata.channel.send(`Leaving because I ended up being alone :(`);
  message_delete(client, channel_data, 20 * 1000);
});
