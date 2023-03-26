const dotenv = require('dotenv');
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');



function deployAllCommands () {
	// Load .env file
	dotenv.config()
	const TOKEN = process.env.TOKEN;
	const CLIENT_ID = process.env.CLIENT_ID;
	const GUILD_ID = process.env.GUILD_ID;




	const commands = [];
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	function deployCommands(){
	for (const file of commandFiles) {
	try{
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	} catch (error) {
		console.error(error)
	}
	}

	const rest = new REST({ version: '10' }).setToken(TOKEN);

	//wipes all commands
	rest.delete(Routes.applicationGuildCommand(CLIENT_ID, GUILD_ID, 'commandId'))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

	// for global commands
	rest.delete(Routes.applicationCommand(CLIENT_ID, 'commandId'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);


	(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(CLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
	})();
	}

	deployCommands()
}

module.exports = {deployAllCommands}