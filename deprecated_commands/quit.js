const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue, useMasterPlayer } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("quit")
		.setDescription("kicks bot out of voice channel"),
        
	execute: async (interaction) => {
        player = useMasterPlayer();
        queue = useQueue(interaction.guildId);
        
        
        //KILLS THE PLAYER, rendering it unusable until the bot is restarted
        queue.player.destroy();
        await interaction.reply({content:`left the voice channel`, ephemeral: false})
    }}