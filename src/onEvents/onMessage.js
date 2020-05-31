exports.onMessage = async msg => {
    if(msg.content.indexOf("/flash") !== -1) msg.channel.send("フラーーーーッシュ！！！\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n＼ｱｪ／");
    if(msg.author.tag == 'GitHub#0000') checkRepo(msg);
    if(msg.author != client.user){
      if(msg.channel.id == ids.logCh) {msg.delete(); return;}
      if(msg.channel.id == ids.terminalCh){
        if(msg.content == "mode disable"){
          client.user.setPresence({
            status: "dnd",  //You can show online, idle....
            activity: {
                name: "☓この鯖は危険な状態です",  //The message shown
                type: "LISTENING" //PLAYING: WATCHING: LISTENING: STREAMING:
            }
          });
          const embed = {
            "title": "**リアルタイムスキャンは無効です**",
            "description": `サーバーを保護するには、今すぐリアルタイムスキャンを有効にしてください。`,
            "color": 16711680,
            "timestamp": new Date(),
            "footer": {
              "icon_url": "https://cdn.discordapp.com/avatars/709077937005264948/ebe1823c4fd5cd615d67915ba4c2d5a8.png",
              "text": "Protected by Bony SECURITY POLICE"
            },
            "thumbnail": {
              "url": "https://i.imgur.com/3wSKpGi.png"
            },
            "author": {
              "name": "Bony SECURE WARNING",
              "icon_url": "https://i.imgur.com/3wSKpGi.png"
            },
          };
          msg.channel.send('```Realtime scan disabled.```', {embed});
          logCh.send({embed});
          realtimeScanDisable = true;
          return;
        }
        if(msg.content == "mode enable"){
          client.user.setPresence({
            status: "online",  //You can show online, idle....
            activity: {
                name: "✔この鯖は保護されています",  //The message shown
                type: "LISTENING" //PLAYING: WATCHING: LISTENING: STREAMING:
            }
          });
          msg.channel.send('```Realtime scan enabled.```')
          realtimeScanDisable = false;
          return;
        }
        msg.channel.send("```Command invalid.```");
        return;
        }
        if(msg.content.indexOf("!sushi") !== -1) sushi(msg);
        if(msg.content.indexOf("!member") !== -1) memberChecker(msg);
        if((msg.content.search(/ふ{2,}\.{2,}$/) !== -1)||(msg.content.search(/(ふっ){2,}/) !== -1)) {
          embed = embedAlert("危険思考はおやめください","鯖の治安悪化に繋がりかねません。",16312092,new Date(), "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/OOjs_UI_icon_alert-yellow.svg/40px-OOjs_UI_icon_alert-yellow.svg.png");
          msg.channel.send({embed});
        }
        if(realtimeScanDisable){
          return
        }
        if(msg.content.indexOf("!forceBlock") !== -1){
          anl.cnt = 100;
          msg.channel.send("強制的にブロック処理を行います。※試験的機能としてお使いください。");
        }
  /*       let isNeedChange = false;
        let content = msg.content;
        const NGWords = JSON.parse(fs.readFileSync(__dirname+"/NGWords.json"));
        for(let word of Object.keys(NGWords)){
          if(content.toLocaleLowerCase().indexOf(word) !== -1){
            isNeedChange = true
            content = await replaceAll(content, word,NGWords[word]);
            console.log(content);
          }
        }
        if(isNeedChange){
          await msg.delete();
          await msg.reply(content);
        } */
        if(anl.on){
            anl.cnt++;
        }else{
            await startCheck(msg.channel, msg.guild);
        }
    }
}