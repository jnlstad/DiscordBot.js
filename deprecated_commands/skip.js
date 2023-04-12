const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip a song"),
        
	execute: async (interaction) => {
        const queue = useQueue(interaction.guildId);
        queue.node.skip()
        await interaction.reply(`Skipped the current song`)
    }}