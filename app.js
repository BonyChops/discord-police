const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: false});
require('date-utils');
const fs = require('fs');
const accessToken = JSON.parse(fs.readFileSync(__dirname+'/accessToken.json', 'utf8')).token;
const ids = JSON.parse(fs.readFileSync(__dirname+'/settings.json', 'utf8'));
let genkaiData;
const saveGenkaiData = (data) => { fs.writeFile('genkaiData.json', JSON.stringify(data, null, '    '), (err)=>{if(err) console.log(`error!::${err}`)})};
try {fs.statSync(__dirname+'/apiLaunched.json'); }catch (e){ data = {"time": 0}; fs.writeFile(__dirname+'/apiLaunched.json', JSON.stringify(data, null, '    '), (err)=>{if(err) console.log(`error!::${err}`)}).then(fs.chmod(__dirname+'/apiLaunched.json', 0o600));};
const functions = require('./src/functions')
const IFToDate = functions.IFToDate;
const embedAlert = functions.embedAlert;
const dateFormat = functions.dateFormat;
const runGoglerPoint = functions.runGoglerPoint;
const checkMemberActivity = functions.checkMemberActivity;
const onMessage = require('./src/onEvents/onMessage').onMessage;
const onReady = require('./src/onEvents/onReady').onReady;
const genkaiCheck = require('./src/genkaiCheck').genkaiCheck;
const checkRepo = require('./src/checkRepo').checkRepo;
const apiLaunched = require('./src/apiLaunched').apiLaunched;
const memberChecker = require('./src/memberChecker').memberChecker;
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const replaceAll = (str, beforeStr, afterStr) => {
  var reg = new RegExp(beforeStr, "gi");
  return str.replace(reg, afterStr);
}
try{
  genkaiData = JSON.parse(fs.readFileSync(__dirname+'/genkaiData.json', 'utf8'));
}catch(e){
  genkaiData = {};
}
let server,
    logCh,
    channel,
    devCh,
    actCh,
    activityTimeCache = 0,
    APITimeCache = 0,
    realtimeScanDisable = false;

const cron = require('node-cron');
class analyzer{
    on = false;
    cnt = 0;
}
anl = new analyzer();

cron.schedule('0,30 0-5 * * *', () => {
  genkaiCheck();
});

if (fs.existsSync('apiLaunched.json')) {
  apiLaunched();
}





client.on('presenceUpdate', async(oldUser, newUser) => {
  if(newUser.guild !== server) return;
  const cacheData = await {"status": newUser.status, "id": newUser.userID};
  activityTimeCache = cacheData;
  console.log("EventFound.");
  if((newUser.user.bot)&&((oldUser === undefined)||(oldUser.status !== newUser.status))){
    const member = newUser.member;
    const botStatus = newUser.status;
    console.dir(botStatus);
    if(botStatus == "online"){
      const embed = embedAlert(`${member.user.username} がオンラインになりました`, "長期アップデートにより、より危険な仕様に変更されている可能性があります", 16711680, new Date(), member.user.displayAvatarURL());
      channel.send({embed});
    }
    if(botStatus == "offline"){
      const embed = embedAlert(`${member.user.username} がオフラインになりました`, "長期アップデートにより、危険な仕様が追加される可能性があります。", 16312092, new Date(), "https://i.imgur.com/LQiUEtF.png");
      channel.send({embed});
    }
  }
  if((!server.members.cache.get(oldUser.userID).user.bot)&&(oldUser.activities.length < newUser.activities.length)&&(newUser.activities[0].name != "Custom Status")){
    console.log("got it!");
    const member = server.members.cache.get(oldUser.userID);
    const isVS = (newUser.activities[0].name.indexOf("Visual Studio") !== -1)
    if (!isVS) return;
    const color = isVS ? 16312092 : 5301186;
    const name = member.nickname !== null ? member.nickname : member.user.username;
    const description = isVS ? `危険なアプリケーションが開発される恐れがあります。\n${name}:\n\`\`\`さて、、、いっちょなにか作ってやりますか(ｷﾘｯ\`\`\`` : `\n${name}:\n\`\`\`もうﾏﾁﾞ無理…ﾏﾘｶしよ…ﾌﾞｫｫｫｫｫｫｫﾝwwwwwwｲｲｨｨｨｨｨﾔｯﾌｩｩｩｩｩwwwwww\`\`\``
    let embed = {
      "title": `${name}は**${newUser.activities[0].name}**を起動しました`,
      "description": description,
      "color": color,
      "timestamp": new Date(),
      "thumbnail": {
        "url": member.user.displayAvatarURL()
      }
    };
    if(newUser.activities[0].name.indexOf("Visual Studio Code") !== -1 ){
      embed.author = {
        "name": "Bony SECURE ALART",
        "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/OOjs_UI_icon_alert-yellow.svg/40px-OOjs_UI_icon_alert-yellow.svg.png"
      }
    }
    channel.send({ embed });
  }
})

client.on('ready', onReady);

client.on('message', onMessage);

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
            "name": "Bony SECURE WARNING",
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
}
