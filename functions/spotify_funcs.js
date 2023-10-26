const dotenv = require('dotenv');
const axios = require('axios');
const fsPromises = require('fs').promises;



dotenv.config({ path: 'env_files/.spotify.env' });
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
        return Promise.resolve(response.data.access_token);
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

        const artistNames = response.data.artists.map((artist) => artist.name).join(', ');
        const trackName = response.data.name;

        return `${artistNames} - ${trackName}`;
    } catch (error) {
        console.log(error)
        const errorcode = error.response.status
        if(errorcode === 401){
            console.log('Invalid Spotify Token')
            return link
        } else if(errorcode === 404){
            throw [errorcode, `Could not find song`]
        } else {
            console.log(error)
            return '';
        }
    }
} 


const spotify_get_playlist_data = async(link, spotify_token) => {
    /**
     * Outputs a list [Artist1 - Song]
     * @param {link} string link to spotify playlist
     * @param {spotify_token} string active spotify token
     */
    const id = link.split("/")[link.split("/").length-1].split("?")[0]
    try{
    const response = await axios.get('https://api.spotify.com/v1/playlists/' + id + '/tracks', {
          headers: {
            Authorization: 'Bearer ' + spotify_token,
        },
      });
  
      let songs_list = []
      
      response.data.items.forEach(item => {
        const artistNames = item.track.artists.map((artist) => artist.name).join(', ');
        const trackName = item.track.name;
        songs_list.push(`${artistNames} - ${trackName}`)
      })
      return songs_list
    
    } catch (error) {
      const errorcode = error.response.status
      if(errorcode === 404){
        throw [errorcode, `Could not find Playlist, it's either private or it's a bad link`]
      }
      else if(errorcode === 401){
        return link
      } else {
        console.log(error)
      }
    }
}


const spotify_get_album_data = async(link, spotify_token) => {
    /**
     * Outputs a list [Artist1 - Song]
     * @param {link} string link to spotify playlist
     * @param {spotify_token} string active spotify token
     */
    const id = link.split("/")[link.split("/").length-1].split("?")[0]
    try{
    const response = await axios.get('https://api.spotify.com/v1/albums/' + id + '/tracks', {
          headers: {
            Authorization: 'Bearer ' + spotify_token,
        },
      });
      
      let songs_list = []
      response.data.items.forEach(item => {
        const artistNames = item.artists.map((artist) => artist.name).join(', ');
        const trackName = item.name;
        songs_list.push(`${artistNames} - ${trackName}`)
      })
      return songs_list
    
    } catch (error) {
        const errorcode = error.response.status
        if(errorcode === 404){
            throw [errorcode, `Could not find Album, it's either private or it's a bad link`]
        } else if(errorcode === 401){
            console.log('Invalid spotify Token')
            return link
        } else {
          console.log(error)
        }
    }
}




module.exports = {spotify_get_new_token, spotify_track_data_get, spotify_get_playlist_data, spotify_get_album_data};