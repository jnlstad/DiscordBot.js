const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Shows the current queue"),
	execute: async (interaction) => {
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

        
        // Show the first 10 songs in the queue
        queue_message = `Current queue:\n`;
        let i = 0;
        while (i < 10 && i < tracks.length){
            queue_message += `${i+1}. **${tracks[i].title} - ${tracks[i].author}**\n`;
            i++;
        }
        if (tracks.length > 10){
            queue_message += `*...and ${tracks.length - 10} more*`;
        }


        await interaction.reply({content: queue_message, ephemeral: true});
    }}