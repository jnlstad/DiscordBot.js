const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip_playlist")
		.setDescription("Skips the entire queue"),
	execute: async (interaction) => {
        
        //get the queue, also checks
        const queue = useQueue(interaction.guildId);
        
        if(!queue){
            await interaction.reply(`There is no queue in this server`)
            return;
        }

        const tracks = queue.tracks.toArray();
        
        if (tracks.length < 1 || tracks === undefined){
            await interaction.reply({content:`There are no songs in the queue`, ephemeral: true})
            return;
        }

        queue.delete();
        await interaction.reply({content:`skipped the queue`, ephemeral: true});

    }}