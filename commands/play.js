const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require("discord-player")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play a song from YouTube.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Searches for a song and plays it")
                .setRequired(true)
		),

	execute: async (interaction) => {
        const player = useMasterPlayer();
        const channel = interaction.member.voice.channel
		if (!channel) return interaction.reply("You need to be in a Voice Channel to play a song.");
        const query = interaction.options.getString("query", true)


        await interaction.deferReply();
        const searchResult = await player.search(query, {requestedBy: interaction.user});

        if (!searchResult || !searchResult.tracks.length){
            interaction.followUp({content: "No results were found!"});
            return;
        } else {
            try {
                await player.play(channel, searchResult, {
                    nodeOptions: {
                        metadata: interaction
                    }
                });
                await interaction.editReply(`Loading your Track`);
            } catch (e) {
                return interaction.followUp(`Something went wrong ${e}`)
            }
        }
        
    }}