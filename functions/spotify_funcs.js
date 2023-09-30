const dotenv = require('dotenv');
const axios = require('axios');
const fsPromises = require('fs').promises;



dotenv.config({ path: 'env_files\\.spotify.env' });
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;



const spotify_get_new_token = async () => {
    /**
    Returns a new spotify token. 
    - Client_ID and Secret are ENV
    */
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
            headers: {
                Authorization: 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
            },
            json: true,
        });
        await fsPromises.writeFile(__dirname + '/../env_files/spotify_access_token.txt', response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        throw error;
    }
}



const spotify_track_data_get = async (link, spotify_token) => {
    /**
    Returns information about a track stored in a JSON format 
    @param {spotify_link} string link to song
    @param {spotify_token} string temporary access token
    */
    try {
        const response = await axios.get('https://api.spotify.com/v1/tracks/' + link.split("/")[link.split("/").length-1].split("?")[0], {
            headers: {
                Authorization: 'Bearer ' + spotify_token,
            },
        });
        return response;
    } catch (error) {
        return ''
        // throw error;
    }
}

const spotify_track_data_to_string = async (track_data) => {
    /**
    Returns a string = "Artist1, Artist2 - Song Name"
    @param {track_data} JSON information about track
    */
    
    if (!track_data || track_data.length < 1) {
        return '';
    }

    const artistNames = track_data.data.artists.map((artist) => artist.name).join(', ');
    const trackName = track_data.data.name;

    return `${artistNames} - ${trackName}`;
}



module.exports = {spotify_get_new_token, spotify_track_data_to_string, spotify_track_data_get};