
async function message_delete(client, message_data, time){
    /** 
     * Deletes a message, within set time.
     * @param {message_data} Promise with channelId and Id (MessageId)
     * @param {time} int in milliseconds
    */
    message_data.then( async(data) => {
      channel = await client.channels.fetch(data.channelId)
      setTimeout(() => channel.messages.delete(data.id), time)
    })
}


module.exports = {message_delete}
