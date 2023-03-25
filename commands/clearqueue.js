const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip_queue")
		.setDescription("Skips to the last song in the queue"),
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

        queue.node.skipTo(tracks.length-1)
        await interaction.reply({content:`skipped to the last song`, ephemeral: true})

    }}