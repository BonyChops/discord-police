const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: false});
const fs = require('fs');
const accessToken = JSON.parse(fs.readFileSync(__dirname+'/accessToken.json', 'utf8')).token;
const ids = JSON.parse(fs.readFileSync(__dirname+'/settings.json', 'utf8'));
let genkaiData;
const googleTTS = require('google-tts-api');
const saveGenkaiData = (data) => { fs.writeFile('genkaiData.json', JSON.stringify(data, null, '    '), (err)=>{if(err) console.log(`error!::${err}`)})};
try{
  genkaiData = JSON.parse(fs.readFileSync(__dirname+'/genkaiData.json', 'utf8'));
}catch(e){
  genkaiData = {};
}

let server;
let logCh;
let channel;
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
let realtimeScanDisable = false;
const dateFormat = (date, format)=> {
    format = format.replace(/YYYY/, date.getFullYear());
    format = format.replace(/MM/, ('00' + date.getMonth() + 1).slice(-2));
    format = format.replace(/DD/, ('00' + date.getDate()).slice(-2));
    format = format.replace(/HH/, ('00' + date.getHours()).slice(-2));
    format = format.replace(/II/, ('00' + date.getMinutes()).slice(-2));
    format = format.replace(/SS/, ('00' + date.getSeconds()).slice(-2));
    return format;
}
const cron = require('node-cron');
class analyzer{
    on = false;
    cnt = 0;
}
anl = new analyzer();

cron.schedule('0,30 0-5 * * *', () => {
  genkaiCheck();
});

const checkMemberActivity = async() => {
  const targetUser = await server.members.cache.filter(member => !member.user.bot && (member.presence.status == "online" ));
  targetUser.forEach(member => {
    console.log(member.user.username);
    if(member.presence.activities.length == 0){
      console.log("No Data!!!");
    }else{
      console.log(member.presence.activities[0].name);
      console.log(member.presence.activities[0].details);
      console.dir(member.presence.activities);

    }
  })
}

const genkaiCheck = async () =>{
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
    if(genkaiData[member.user.id] == null)genkaiData[member.user.id] = {};
    genkaiData[member.user.id].name = name;
    if(genkaiData[member.user.id].point == null) genkaiData[member.user.id].point = 0;
    let memberPointThisTime = point;
    let description = `${dateFormat(new Date(), 'HH:II')}にオンラインだったため**限界ポイント +${point}**付与いたします。`;
    if(member.presence.activities.length != 0){
      if (member.presence.activities[0].name == 'Visual Studio Code'){
        description = description+`\nまた、あなたは${member.presence.activities[0].name}を使用していましたね？？(無論あなたが${member.presence.activities[0].state}で${member.presence.activities[0].details}であったことも知っています)\nこの鯖は健康を目指しており、**深夜のゲームプレイ・開発は__厳重な違反です。__**\nよって該当ユーザーには通常よりも多くの違反点をつけさせていただきます💢`;
      }else{
        description = description+`\nまた、あなたは${member.presence.activities[0].name}を使用していましたね？？\nこの鯖は健康を目指しており、**深夜のゲームプレイ・開発は__厳重な違反です。__**\nよって該当ユーザーには通常よりも多くの違反点をつけさせていただきます💢`;
      }
      memberPointThisTime *= 1.5;
    }
    genkaiData[member.user.id].point += memberPointThisTime;

    embeds.push(
      {
        "title": name,
        "description": description,
        "color": 12390624,
        "timestamp": new Date(),
        "thumbnail": {
          "url": userIcon
        },
        "fields": [
          {
            "name": "今回獲得した限界ポイント",
            "value": memberPointThisTime,
            "inline": true
          },
          {
            "name": "現在の限界ポイント",
            "value": genkaiData[member.user.id].point,
            "inline": true
          }
        ]
      })
    });
  await saveGenkaiData(genkaiData);
  await embeds.forEach(embed => {
    //console.dir(embed);
    channel.send({embed})});
}

const memberChecker = (msg) =>{
  const members = msg.guild.members.cache
  const human = members.filter(member => !member.user.bot);
  const bot = members.filter(member => member.user.bot);
  const embed = {
    "timestamp": "2020-05-12T11:45:24.711Z",
    "fields": [
      {
        "name": "人間",
        "value": `${human.size}人`,
        "inline": true
      },
      {
        "name": "BOT",
        "value": `${bot.size}人`,
        "inline": true
      },
      {
        "name": "Total",
        "value": `${members.size}人`,
        "inline": true
      },
      {
        "name": "BOT率",
        "value": `${(parseFloat(bot.size) / parseFloat(members.size))*100}%`,
        "inline": true
      }
    ]
  };
  msg.channel.send({ embed });
}

client.on('ready', async() => {
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
    server =  client.guilds.cache.get(ids.server);
    channel = server.channels.cache.get(ids.channel);
    logCh =  server.channels.cache.get(ids.logCh);
    logCh.send({embed});
    //checkMemberActivity(); //Turn on when it's developing
});

client.on('message', async msg => {


  googleTTS('Hello World', 'en', 1)
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
                  "name": "Bony SECURE ALERT",
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
        if(realtimeScanDisable){
          return
        }
        if(msg.content.indexOf("!forceBlock") !== -1){
          anl.cnt = 100;
          msg.channel.send("強制的にブロック処理を行います。※試験的機能としてお使いください。");
        }
        if(anl.on){
            anl.cnt++;
        }else{
            await startCheck(msg.channel, msg.guild);
        }
    }
});

client.login(accessToken);

const sushi = async(msg) =>{
    await waitAndSay(msg.channel, 'ハマチ！',250);
    await waitAndSay(msg.channel, '中トロ！',250);
    await waitAndSay(msg.channel, '甘海老ロール！',500);
    await waitAndSay(msg.channel, 'サーモン！',250);
    await waitAndSay(msg.channel, 'ハンバーグ！',1000);
    await waitAndSay(msg.channel, '稲荷！',250);
    await waitAndSay(msg.channel, 'サラダ！',2500);
    await waitAndSay(msg.channel, 'サーモン炙り！',500);
    let embed = {
        "title": "**パフェ**",
        "image": {
          "url": "https://i.imgur.com/WEEpoqU.png"
        }
      };
    msg.channel.send({ embed });
    await sleep(250);
    embed = {
        "title": "**いわし**",
        "image": {
          "url": "https://i.imgur.com/sleOQPC.png"
        }
      };
    msg.channel.send({ embed });
    await sleep(500);
    await waitAndSay(msg.channel, '/happy',10);
}

const waitAndSay = async(channel, mes, sec)=>{
    await channel.send(mes);
    await sleep(sec)
}
const startCheck = async(channel, server)  =>{
    if(anl.on) return;
    anl.on = true;
    await sleep(2000);
    if(anl.cnt >= 10){
        console.log("The security situation deteriorating detected.");
        await client.user.setPresence({
          status: "dnd",  //You can show online, idle....
          activity: {
              name: "[！]重大な治安悪化を検出",  //The message shown
              type: "LISTENING" //PLAYING: WATCHING: LISTENING: STREAMING:
          }
        });

        let role_created;
        await server.roles.create({
            data: {
              name: 'BLOCKED',
              color: 'RED',
            },
            reason: 'BLOCKED TO SPEECH',
          }).then(role => role_created = role)
        console.log(client.user.username);
        let myRole = await server.roles.cache.find(role => role.name === client.user.username);
        console.dir(myRole);
        await role_created.setPosition(myRole.rawPosition-1)
        .then(updated => console.log(`Role position: ${updated.position}`))
        .catch(console.error);
        channel.permissionsFor(role_created);
        channel.overwritePermissions([
            {
               id: role_created,
               deny: ['SEND_MESSAGES'],
            },
          ], 'Needed to change permissions');
        await server.members.cache.forEach( member =>{
            try {
                member.roles.add(role_created)
              } catch (error) {
                console.error(error);
              }
        });


        let detectedTime = new Date();
        let embed = {
          "title": "**重大な治安悪化が検出されました**",
          "description": `${dateFormat(detectedTime, 'YYYY/MM/DD HH:II:SS')}ごろ、チャンネル[<#${channel.id}>]で治安の悪化を検出しました。\nこのチャンネルでの発信は__**一時的にブロック**__されます。`,
          "color": 16711680,
          "timestamp": detectedTime,
          "footer": {
            "icon_url": "https://cdn.discordapp.com/avatars/709077937005264948/ebe1823c4fd5cd615d67915ba4c2d5a8.png",
            "text": "Protected by Bony SECURITY POLICE"
          },
          "thumbnail": {
            "url": "https://i.imgur.com/3wSKpGi.png"
          },
          "author": {
            "name": "Bony SECURE ALERT",
            "icon_url": "https://i.imgur.com/3wSKpGi.png"
          },
         };
        await channel.send("@everyone **重大な治安悪化が検出されました**",{ embed,  "tts": true });
        logCh.send({ embed,  "tts": false });
        await console.log("sleep for 3s");
        await sleep(30000);
        embed = {
          "title": "**治安は回復しました**",
          "description": `${dateFormat(detectedTime, 'YYYY/MM/DD HH:II:SS')}に治安の悪化を検出しましたが、治安の回復を確認したため、アクセスブロックを解除いたしました。`,
          "color": 65280,
          "timestamp": new Date(),
          "footer": {
            "icon_url": "https://cdn.discordapp.com/avatars/709077937005264948/ebe1823c4fd5cd615d67915ba4c2d5a8.png",
            "text": "Protected by Bony SECURITY POLICE"
          },
          "thumbnail": {
            "url": "https://freeiconshop.com/wp-content/uploads/edd/checkmark-flat.png"
          },
          "author": {
            "name": "Bony SECURE Notice"
          }
        };
        await channel.send({ embed,  "tts": false });
        logCh.send({ embed,  "tts": false });
        let blockedRoles = await server.roles.cache.filter(role => role.name === "BLOCKED");
        await blockedRoles.forEach(role => {try{role.delete()}catch{console.log('lol')}});
        await client.user.setPresence({
          status: "online",  //You can show online, idle....
          activity: {
              name: "✔この鯖は保護されています",  //The message shown
              type: "LISTENING" //PLAYING: WATCHING: LISTENING: STREAMING:
          }
        });
    }
    anl.on = await false;
    anl.cnt = await 0;

    //channel.send('done');
}
