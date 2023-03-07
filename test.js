const { REST, Routes } = require('discord.js');
const { TOKEN, CLIENT_ID } = require('./token.js');
const { pong } = require('./Commands/ping.js');
const { randomHello, helloCommand } = require('./Commands/randomHello.js')
const wait = require('node:timers/promises').setTimeout;

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {    
    name: 'hello',
    description: 'Replies with a random Hello from a set list',
  },
  {    
    name: 'test3',
    description: 'Replies with your ID',
  },
];


const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

//connect to 
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply(pong);
  }


  if (interaction.commandName === 'hello') {
    const randomHelloReply = new randomHello();
    await interaction.reply({ content: randomHelloReply.reply, ephmeral: true})
  }

  if (interaction.commandName === 'test3') {
    const message = await interaction.user;
    console.log(message.id)
    // await interaction.reply({ content: message.user.id, ephmeral: true})
    await interaction.reply({ content: message.id + "\n" 
                              + message.username + "#" + message.discriminator , ephemeral: true})
  }
});

client.login(TOKEN);