const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue, useMasterPlayer } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("kicks bot out of voice channel"),
        
	execute: async (interaction) => {
        player = useMasterPlayer();
        queue = useQueue(interaction.guildId);
        
        queue.player.destroy();
        await interaction.reply({content:`left the voice channel`, ephemeral: false})
    }}