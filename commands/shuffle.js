const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription("shuffle the queue"),
        
	execute: async (interaction) => {
        const queue = useQueue(interaction.guildId);
        queue.tracks.shuffle()
        await interaction.reply({content:`shuffled the queue`, ephemeral: false})
        setTimeout(() => interaction.deleteReply(), 20 * 1000)
        return;
    }}