const Discord = require('discord.js');
const { prefix, token, ban_phrases_array, giphyToken } = require('./config.json');
const client = new Discord.Client();

var GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giphyToken);

client.once('ready', () => {
    console.log('Ready!')
})

function getRandomBanPhrase() {
    return ban_phrases_array[~~(Math.random()*ban_phrases_array.length)];
}

client.on('message', message => {

    function hasPermission(member) {
        return message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']);
    }
    
    function commandPrefix() {
        return message.content.startsWith(`${prefix}kick`);
    }


    if (hasPermission() && commandPrefix()) { 

        let member = message.mentions.members.first();
        member.kick().then((member) => {           

         giphy.search('gifs', {"q": "loki approves" })
            .then((response) => {
                var totalResponses = response.data.length;
                var responseIndex = Math.floor((Math.random() * 10) + 1) % totalResponses;
                var responseFinal = response.data[responseIndex];
                
                message.channel
                    .send(`${getRandomBanPhrase()} \n ${member.displayName} foi kickado! :skull:`, {
                    files: [responseFinal.images.fixed_height.url],
                    tts: true
                })
                                .catch(error => message.channel.send(error))
            }) 
            .catch(() => {
                message.channel.send("404!");
            }) 
        })
        .catch((error) => message.channel.send(`Cannot kick a member ${error}`))
    } 
})
client.login(token);