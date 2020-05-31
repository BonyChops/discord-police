const client = global.client;
exports.onReady = async() => {
    client.user.setPresence({
        status: "online",  //You can show online, idle....
        activity: {
            name: "✔この鯖は保護されています",  //The message shown
            type: "LISTENING" //PLAYING: WATCHING: LISTENING: STREAMING:
        }
    });
    console.log(`Logged in as ${client.user.tag}!`);
    const embed = {
      "title": "**サービスを開始しました**",
      "description": "```Hello, world!\n```",
      "color": 65535,
      "timestamp": new Date(),
      "footer": {
        "icon_url": "https://cdn.discordapp.com/avatars/709077937005264948/ebe1823c4fd5cd615d67915ba4c2d5a8.png",
        "text": "Protected by Bony SECURITY POLICE"
      },
      "thumbnail": {
        "url": "https://i.imgur.com/LQiUEtF.png"
      },
      "author": {
        "name": "Bony SECURE Notice"
      }
    };
    server = client.guilds.cache.get(ids.server);
    channel = server.channels.cache.get(ids.channel);
    logCh =  server.channels.cache.get(ids.logCh);
    devCh = server.channels.cache.get(ids.devCh);
    actCh = server.channels.cache.get(ids.actCh);
    logCh.send({embed});
    //checkMemberActivity(); //Turn on when it's developing
}