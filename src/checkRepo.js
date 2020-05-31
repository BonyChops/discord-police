exports.checkRepo = async(msg) =>{
    let embed = msg.embeds[0];
    if(embed.title.search(/new commit.??$/) === -1) {console.log("This isn't commit"); return;}
    if((gitName = embed.description.substr(embed.description.search(/\s[^\s]*$/)+1)) === -1) {console.log("Failed to get user name"); return;}
    const member = server.members.cache.find(member => member.user.tag == ids.github[gitName]);
    const user = member.user
    let name = member.nickname !== null ? member.nickname : user.username;
    const dt = new Date();
    let title,description,color;
    if((dt.toFormat("HH24") >= 6)&&(dt.toFormat("HH24") <= 23)){
      point = -500;
      title = await "健康な時間帯のコミットです！";
      description = await `Gogler Point ${point}`;
      color = await 65280;
    }else if ((dt.toFormat("HH24") >= 0)&&(dt.toFormat("HH24") <= 5)){
      point = 100;
      title = await `**限界開発が検出されました**`;
      description = await `Gogler Point ${point}💢`;
      color = await 16312092;
    }else{
      return
    }
    runGoglerPoint(user.id, point, name);
    fields = [
      {
        "name": "今回獲得したGogler Point",
        "value": point,
        "inline": true
      },
      {
        "name": "現在のGogler Point",
        "value": genkaiData[user.id].point,
        "inline": true
      }
    ]
    embed = await embedAlert(title, description, color, new Date(), user.displayAvatarURL(), fields);
    msg.channel.send({embed});
    await saveGenkaiData(genkaiData);
}
