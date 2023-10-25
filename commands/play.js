const { SlashCommandBuilder } = require("@discordjs/builders");
const { YoutubeExtractor } = require('@discord-player/extractor');
const { useMainPlayer } = require("discord-player");
const {spotify_get_new_token, spotify_track_data_to_string, spotify_track_data_get, spotify_get_playlist_data, spotify_get_album_data} = require('../functions/spotify_funcs.js');
const fs = require("fs");


//Runs once on boot to initialize spotify token
var spotify_token = '';
fs.readFile(__dirname + "/../env_files/spotify_access_token.txt", (err, data) => {
    spotify_token = data.toString();
})


module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play a song from YouTube or Spotify Onii-chan!")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Searches for a song and plays it")
                .setRequired(true)
		),
            
	execute: async (interaction) => {
        let global_error = 'Unable to process the song'

        /* Initializes Player */
        const player = useMainPlayer();
        player.extractors.register(YoutubeExtractor);
        const channel = interaction.member.voice.channel
		if (!channel) return interaction.reply("You need to be in a Voice Channel to play a song.");
        let query = interaction.options.getString("query", true)
        
        await interaction.deferReply({ephemeral: false});
        

        /** Runs if a song is a spotify.com/track link */
        if (query.includes("open.spotify.com/track")) {
            try {
                let response = await spotify_track_data_get(query, spotify_token);
                query = await spotify_track_data_to_string(response);
                console.log(query)
                if (!query) {
                    spotify_get_new_token().then(async(response) => {
                        spotify_token = response
                        response = await spotify_track_data_get(query, spotify_token); // This function doesn't wait, so it does not get the token with it.
                        query = await spotify_track_data_to_string(response);
                    })
                    
                }
            } 
            catch (error) {
                console.log(error)
                if(typeof(error) == 'object'){
                    global_error = `${error[0]} - ${error[1]}`
                } else {
                    console.log(error)
                }   
            }
        } 
        else if (query.includes("open.spotify.com/playlist")){
            try{
                query = await spotify_get_playlist_data(query, spotify_token);
                if (!query) {
                    spotify_get_new_token().then(async(response) => {
                        spotify_token = response
                        query = await spotify_get_playlist_data(query, response);
                        } 
                    )
                }
            } catch(error) {
                if(typeof(error) == 'object'){
                    global_error = `${error[0]} - ${error[1]}`
                } else {
                    console.log(error)
                }
            }
        }
        else if (query.includes("open.spotify.com/album")){
            try{
                query = await spotify_get_album_data(query, spotify_token);
                if (!query) {
                    spotify_get_new_token().then(async(response) => {
                        spotify_token = response
                        query = await spotify_get_album_data(query, response);
                        } 
                    )
                }
            } catch(error) {
                if(typeof(error) == 'object'){
                    console.log(error)
                    global_error = `${error[0]} - ${error[1]}`
                } else {
                    console.log(error)
                }
            }
        } else if (query.includes("spotify.com")) {
            global_error = 'This link is not supported';
            query = null;
        }       

        
        
        let searchResult
        if (typeof(query) === 'object'){
        try {
            let aQuery = await query;
            aQuery.forEach(async (song) => {
                searchResult = await player.search(song, {requestedBy: interaction.user});

                if (!searchResult || !searchResult.tracks.length){
                    interaction.followUp({content: `No Results Found, Please try again!`});
                    setTimeout(() => interaction.deleteReply(), 30 * 1000)
                    return;
                } else {
                    try {
                        await player.play(channel, searchResult, {
                            nodeOptions: {
                                metadata: interaction
                            }

                        });
                    } catch(error) {
                        console.log(error)
                        return;
                    } 
                }
                })

        	} catch(error){
        	console.log(error)
            return;
       	} 
        await interaction.editReply({content:`Added all your tracks to the queue`, ephemeral: false});
        setTimeout(() => interaction.deleteReply(), 30 * 1000)
        return;
    }

    // One Song
        else if(typeof(query) === 'string'){
        try {
            searchResult = await player.search(query, {requestedBy: interaction.user});
            } catch (error) {
                console.log(error)
        }
        if (!searchResult || !searchResult.tracks.length){
            interaction.followUp({content: `No Results Found, Please try again!`});
            return;
        } else {
            try {
                await player.play(channel, searchResult, {
                    nodeOptions: {
                        metadata: interaction
                    }
                });
                await interaction.editReply({content:`Added **${searchResult._data.tracks[0].title}** to the queue`, ephemeral: false});
                setTimeout(() => interaction.deleteReply(), 30 * 1000)
                return;
            } catch (error) {
                return interaction.followUp({content:`Something went wrong ${error}`, ephemeral: false})
            }
        }
    } return interaction.followUp({content:`${global_error}`, ephemeral: false})
  }
} 