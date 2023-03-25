const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Shows the current queue"),
	execute: async (interaction) => {
        const queue = useQueue(interaction.guildId);
        const tracks = queue.tracks.toArray();
        
        if (!tracks){
            await interaction.reply(`There are no songs in the queue`)
            return;
        }
        
        await interaction.reply(`${tracks}`)
    }}