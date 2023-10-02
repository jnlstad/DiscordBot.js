const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("skip")
		.setDescription("Skip a song or the entire queue")
        .addStringOption(option =>
            option.setName(`skip_choice`)
                .setDescription(`Choose to skip the current song or the entire queue`)
                .setRequired(true)
                .addChoices(
                    {name: `song`, value: `song`},
                    {name: `queue`, value: `queue`},
                )),
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName(`song`)
        //         // .setRequired(true)
        //         )
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName(`queue`)
        //         // .setRequired(true)
        //         ),
        

	execute: async (interaction) => {

        //Error handling
        const queue = useQueue(interaction.guildId);
        
        if(!queue){
            await interaction.reply(`There is no queue in this server`)
            setTimeout(() => interaction.deleteReply(), 20 * 100)
            return;
        }
        //End of error handling


        if(interaction.options.get('skip_choice').value === `song`){

            const queue = useQueue(interaction.guildId);
            queue.node.skip()
            await interaction.reply(`Skipped the current song`)
            setTimeout(() => interaction.deleteReply(), 20 * 100)
            return;
        } 
        

        //Queue error handling
        const tracks = queue.tracks.toArray();
        
        if (tracks.length < 1 || tracks === undefined){
            await interaction.reply({content:`There are no songs in the queue`, ephemeral: true})
            setTimeout(() => interaction.deleteReply(), 20 * 100)
            return;
        }
        //End of error handling


        else if (interaction.options.get('skip_choice').value === `queue`){
            const queue = useQueue(interaction.guildId);
            queue.node.stop()
            await interaction.reply(`Skipped the entire queue`)
            setTimeout(() => interaction.deleteReply(), 10 * 100)
            return;
        }

        else {
            await interaction.reply({content:`You forgot to input a subcommand`, ephemeral: true})
            setTimeout(() => interaction.deleteReply(), 10 * 100)
            return;
        }
    }}