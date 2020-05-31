exports.genkaiCheck = async () =>{
    const targetUser = await server.members.cache.filter(member => !member.user.bot && (member.presence.status == "online" || member.presence.activities.length != 0));
    //console.dir(targetUser);
    console.log(targetUser.size);
    if (targetUser.size === 0) {
      console.log("No one.");
      return;
    }
    let embeds = [
      {
          "title": "Bony Health Check",
          "description": `**おはよう！${dateFormat(new Date(), 'HH')}時に何やってるんだい？**\n`,
          "color": 12390624,
          "timestamp": new Date(),
          "image": {
            "url": "https://pbs.twimg.com/media/Bmsgqy3CMAAtAh3?format=jpg&name=small"
          }
      }
    ];
    const point = 100 * (Number(dateFormat(new Date(), 'HH')) + 1);



    await targetUser.forEach(member => {
      let name = member.nickname !== null ? member.nickname : member.user.username;
      let userIcon = member.user.displayAvatarURL();

      let memberPointThisTime = point;
      let description = `${dateFormat(new Date(), 'HH:II')}にオンラインだったため**Gogler Point +${point}**付与いたします。`;
      if((member.presence.activities.length > 1)||((member.presence.activities.length == 1)&&(member.presence.activities[0].name != "Custom Status"))){
        if (member.presence.activities[0].name == 'Visual Studio Code'){
          description = description+`\nまた、あなたは${member.presence.activities[0].name}を使用していましたね？？(無論あなたが${member.presence.activities[0].state}で${member.presence.activities[0].details}であったことも知っています)\nこの鯖は健康を目指しており、**深夜のゲームプレイ・開発は__厳重な違反です。__**\nよって該当ユーザーには通常よりも多くの違反点をつけさせていただきます💢`;
        }else{
          description = description+`\nまた、あなたは${member.presence.activities[0].name}を使用していましたね？？\nこの鯖は健康を目指しており、**深夜のゲームプレイ・開発は__厳重な違反です。__**\nよって該当ユーザーには通常よりも多くの違反点をつけさせていただきます💢`;
        }
        memberPointThisTime *= 1.5;
      }
      runGoglerPoint(member.user.id, memberPointThisTime, name);
      fields = [
        {
          "name": "今回獲得したGogler Point",
          "value": memberPointThisTime,
          "inline": true
        },
        {
          "name": "現在のGogler Point",
          "value": genkaiData[member.user.id].point,
          "inline": true
        }
      ]
      embeds.push(embedAlert(name, description, 12390624, new Date(), userIcon,fields))
      });
    await embeds.forEach(embed => {
      channel.send({embed})});
}