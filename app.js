const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: false });
const GitHub = require('github-api');
require('array-foreach-async');
require('date-utils');
const fs = require('fs');
const accessToken = JSON.parse(fs.readFileSync(__dirname + '/accessToken.json', 'utf8')).token;
const ids = JSON.parse(fs.readFileSync(__dirname + '/settings.json', 'utf8'));
const gh = new GitHub({
  token: ids.github.accessToken
});
let genkaiData;
let msgArchive, msgArchiveCnt = 0;
let issueGUIData = {};
const saveGenkaiData = (data) => { fs.writeFile('genkaiData.json', JSON.stringify(data, null, '    '), (err) => { if (err) console.log(`error!::${err}`) }) };
try { fs.statSync(__dirname + '/apiLaunched.json'); } catch (e) { data = { "time": 0 }; fs.writeFile(__dirname + '/apiLaunched.json', JSON.stringify(data, null, '    '), (err) => { if (err) console.log(`error!::${err}`) }).then(fs.chmod(__dirname + '/apiLaunched.json', 0o600)); };
const replaceAll = (str, beforeStr, afterStr) => {
  var reg = new RegExp(beforeStr, "gi");
  return str.replace(reg, afterStr);
}


try {
  genkaiData = JSON.parse(fs.readFileSync(__dirname + '/genkaiData.json', 'utf8'));
} catch (e) {
  genkaiData = {};
}

client.on('ready', async () => {
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
  logCh = server.channels.cache.get(ids.logCh);
  devCh = server.channels.cache.get(ids.devCh);
  actCh = server.channels.cache.get(ids.actCh);
  logCh.send({ embed });
  //checkMemberActivity(); //Turn on when it's developing
});

client.on('message', async msg => {
  if (msg.content.indexOf("/flash") !== -1) msg.channel.send("フラーーーーッシュ！！！\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n＼ｱｪ／");
  if (msg.author.tag == 'GitHub#0000') checkRepo(msg);
  if (!msg.author.bot) checkIssue(msg);
  if (msg.author != client.user) {
    if (msg.channel.id == ids.logCh) { msg.delete(); return; }
    if (msg.channel.id == ids.terminalCh) {
      if (msg.content == "mode disable") {
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
        msg.channel.send('```Realtime scan disabled.```', { embed });
        logCh.send({ embed });
        realtimeScanDisable = true;
        return;
      }
      if (msg.content == "mode enable") {
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
    if (msg.content.indexOf("!sushi") !== -1) sushi(msg);
    if (msg.content.indexOf("!stripe") !== -1) {
      const line = "<:bony_white:749663187128811658><:bony_black:749663223812325448>".repeat(6);
      for (let i = 0; i < 6; i++) {
        msg.channel.send(line);
      }
    }
    if (msg.content.indexOf("!jig") !== -1) {
      const line = "<:bony_white:749663187128811658><:bony_black:749663223812325448>".repeat(6) + "\n";
      const line2 = "<:bony_black:749663223812325448><:bony_white:749663187128811658>".repeat(6) + "\n";
      for (let i = 0; i < 3; i++) {
        msg.channel.send(line);
        msg.channel.send(line2);
      }
      msg.channel.send(lines.repeat(10).substr(0, 1980));
    }

    if (msg.content.indexOf("!member") !== -1) memberChecker(msg);
    if (msg.content.indexOf("#") !== -1) hashAutoAdd(msg);
    if (msg.content.toLowerCase().indexOf("shine") !== -1) msg.channel.send("✨");
    if (msg.content.toLowerCase().indexOf("!msginfo") !== -1) getMesInfo(msg);
    if (msg.content.toLowerCase().indexOf("!userinfo") !== -1) getUserInfo(msg);
    if (msg.content.toLowerCase().indexOf("!gettimestamp") !== -1) getTimestamp(msg);
    if (msg.content.toLowerCase().indexOf("!issue") !== -1) await createIssue(msg);
    if ((msg.content.search(/ふ{2,}\.{2,}$/) !== -1) || (msg.content.search(/(ふっ){2,}/) !== -1) || (msg.content.search(/(はっ){2,}/) !== -1) || (msg.content.search(/OTTO/) !== -1)) {
      embed = embedAlert("危険思考はおやめください", "鯖の治安悪化に繋がりかねません。", 16312092, new Date(), "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/OOjs_UI_icon_alert-yellow.svg/40px-OOjs_UI_icon_alert-yellow.svg.png");
      msg.channel.send({ embed });
    }
    if (realtimeScanDisable) {
      return
    }
    if (msg.content.toLowerCase().indexOf("!forceblock") !== -1) {
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
    if (anl.on) {
      anl.cnt++;
    } else {
      await startCheck(msg.channel, msg.guild);
    }
  }
  if (msg.author.bot && server.me.id !== msg.author.id) msgArchive = msg;
  msgArchiveCnt++;
  if (msgArchiveCnt > 5) {
    msgArchiveCnt = 0;
    msgArchive = undefined;
  }
});

const checkIssue = async (msg) => {
  const mesEdit = async (content, author) => {
    issueGUIData[author.id].msg.edit(content, { embed: null });
  }
  const resetGUI = async (msg, author) => {
    mesEdit(`<@${author.id}>, \`お待ちください...\``, author);
    msg.reactions.removeAll();
  }
  const edit = async (msg, author, embed) => {
    msg.edit(`<@${author.id}>`, { embed });
  }
  const swMode = (modeStr) => {
    issueGUIData[data.author.id].mode = data.mode = modeStr;
  }
  let data = issueGUIData[msg.author.id];
  if (data === undefined) {
    return;
  }
  if (data.mode === "setTitle") {
    msg.delete();
    await resetGUI(data.msg, data.author);
    swMode("checkTitle");
    let title = issueGUIData[msg.author.id].title = msg.content;
    data = issueGUIData[msg.author.id];
    issueCheckTitle(data);
  }
  if (data.mode === "setContent") {
    msg.delete();
    await resetGUI(data.msg, data.author);
    swMode("checkContent");
    let content = issueGUIData[msg.author.id].content = msg.content;
    data = issueGUIData[msg.author.id];
    issueCheckContent(data);
  }
}

client.on('emojiCreate', async emoji => {
  let embed = embedAlert("危険な絵文字が追加されました", `鯖で不必要に乱用される可能性があります<:${emoji.name}:${emoji.id}>`, 16312092, new Date(), emoji.url);
  embed.author = {
    "name": "Bony SECURE ALART",
    "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/OOjs_UI_icon_alert-yellow.svg/40px-OOjs_UI_icon_alert-yellow.svg.png"
  };
  embed.fields = [
    {
      name: "id",
      value: `\`${emoji.id}\``
    },
    {
      name: "name",
      value: `\`${emoji.name}\``
    },
  ]
  channel.send("", { embed });
});

client.on('emojiUpdate', async (oldEmoji, emoji) => {
  let embed = embedAlert("危険な絵文字が更新されました",
    `鯖で不必要に乱用される可能性があります<:${emoji.name}:${emoji.id}>`,
    16312092,
    new Date(),
    emoji.url);
  embed.author = {
    "name": "Bony SECURE ALART",
    "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/OOjs_UI_icon_alert-yellow.svg/40px-OOjs_UI_icon_alert-yellow.svg.png"
  };
  embed.fields = [
    {
      name: "id",
      value: `\`${emoji.id}\``
    },
    {
      name: "name",
      value: `\`${emoji.name}\``
    },
  ]
  channel.send("", { embed });
});

const issueCheckContent = async (data) => {
  const edit = async (msg, author, embed) => {
    msg.edit(`<@${author.id}>`, { embed });
  }
  await data.msg.react("✅");
  await data.msg.react("❌");
  await edit(data.msg, data.author, embedAlert(`最終確認 - ${data.repo.full_name}への通報(Issue)`, `以下の内容でIssueをたてます。よろしいですか？`, "#FF0000", new Date(), data.img, [{ name: data.title, value: data.content }]));
}

const issueCheckTitle = async (data) => {
  const edit = async (msg, author, embed) => {
    msg.edit(`<@${author.id}>`, { embed });
  }
  await data.msg.react("✅");
  await data.msg.react("❌");
  await edit(data.msg, data.author, embedAlert(`タイトルを設定 - ${data.repo.full_name}への通報(Issue)`, `以下のタイトルでよろしいですか？`, "#FF0000", new Date(), data.img, [{ name: "タイトル", value: `\`${data.title}\`` }]));
}

const issueSetTitle = async (data) => {
  const edit = async (msg, author, embed) => {
    msg.edit(`<@${author.id}>`, { embed });
  }
  await data.msg.react("❌");
  await edit(data.msg, data.author, embedAlert(`タイトルを設定 - ${data.repo.full_name}への通報(Issue)`, `Issueのタイトルを入力してください。`, "#FF0000", new Date(), data.img));
}

const issueSetContent = async (data) => {
  const edit = async (msg, author, embed) => {
    msg.edit(`<@${author.id}>`, { embed });
  }
  await data.msg.react("❌");
  await edit(data.msg, data.author, embedAlert(`内容を設定 - ${data.repo.full_name}への通報(Issue)`, `Issue: \`${data.title}\`の内容を入力してください。`, "#FF0000", new Date(), data.img));
}


client.on('messageReactionAdd', async (react, user) => {
  const sliceBy = (array, num) => {
    let parts = [];
    return array.reduce((acc, data, index) => {
      parts.push(data);
      if (index % num == num - 1 || index === array.length - 1) {
        acc.push(parts);
        parts = [];
      }
      return acc
    }, []);
  }
  const edit = async (msg, author, embed) => {
    msg.edit(`<@${author.id}>`, { embed });
  }
  const mesEdit = async (content, author) => {
    issueGUIData[author.id].msg.edit(content, { embed: null });
  }
  const resetGUI = (msg, author) => {
    mesEdit(`<@${author.id}>, \`お待ちください...\``, author);
    msg.reactions.removeAll();
  }
  const close = (author) => {
    issueGUIData[author.id].msg.reactions.removeAll();
    issueGUIData[author.id] = undefined;
  }
  const cancel = async (author, content = "`このIssueフォームはCloseされました`") => {
    mesEdit(content, author);
    close(author);
  }
  const numRequired = (react) => {
    if (react.emoji.name.substr(1) !== "\uFE0F\u20E3") {
      cancel(data.author, "`エラー`");
      return false;
    }
    return react.emoji.name.substr(0, 1);
  }
  const swMode = (modeStr) => {
    issueGUIData[data.author.id].mode = mode = modeStr;
  }
  let data = issueGUIData[user.id];

  if (issueGUIData[user.id] === undefined || data.msg.id !== react.message.id || data.author.id !== user.id) {
    return
  }
  console.log(JSON.stringify(react.emoji, null));
  await resetGUI(data.msg, data.author);
  let mode = await data.mode;
  if (mode === "targeted") {
    if (react.emoji.name === "❌") {
      issueGUIData[user.id].owner = undefined;
      issueGUIData[user.id].repo = undefined;
      issueGUIData[user.id].mode = mode = "generated";
      react.emoji.name = "✅";
    } else if (react.emoji.name === "✅") {
      swMode("setTitle");
    }
  }
  if (mode === "generated") {
    if (react.emoji.name === "✅") {
      const userStr = await ids.userData.reduce(async (acc, user, index) => {
        if (index !== 0) acc = await acc + "\n";
        acc = await acc + `${index}: ${user.github}`;
        await data.msg.react(index + "\uFE0F\u20E3");
        return await acc;
      }, "");
      await data.msg.react("❌");
      await edit(data.msg, data.author, embedAlert("開発者を選択 - 通報(Issue)", `該当する開発者を選択してください。\n\`\`\`${userStr}\`\`\``, "#FF0000", new Date(), "https://i.imgur.com/3wSKpGi.png"));
      swMode("chooseOwner");
    } else if (react.emoji.name === "❌") {
      cancel(data.author);
      return;
    }
    return;
  }

  if (mode == "chooseOwner") {
    if (react.emoji.name === "❌") {
      cancel(data.author);
      return;
    }
    const num = numRequired(react);
    if (num === false) {
      return;
    }
    issueGUIData[data.author.id].owner = await ids.userData[num].github;
    if (issueGUIData[data.author.id].owner === undefined) {
      cancel(data.author, "`エラー`");
    }
    swMode("ownerChose");
  }

  if (mode == "selectRepos") {
    if (react.emoji.name === "❌") {
      cancel(data.author);
      return;
    }
    if (react.emoji.name === "◀" || react.emoji.name === "▶") {
      mode = "ownerChose";
    } else {
      const num = numRequired(react);
      if (num === false) {
        return;
      }
      data = issueGUIData[user.id];
      issueGUIData[data.author.id].repo = data.pickedRepos.repos[data.pickedRepos.cnt][num];
      issueGUIData[data.author.id].img = ids.botsData.some(bot => bot.repo == issueGUIData[data.author.id].repo.name) ? ids.botsData.find(bot => bot.repo == issueGUIData[data.author.id].repo.name).img
        : data.pickedRepos.repos[0][0].owner.avatar_url;
      swMode("setTitle");
    }
  }
  data = issueGUIData[user.id];
  if (mode == "checkContent") {
    if (react.emoji.name === "❌") {
      swMode("setContent");
      react.emoji.name = "✅";
    } else if (react.emoji.name === "✅") {
      mesEdit("`Issueをたてています...`", data.author);
      const postedBy = ids.userData.find(userData => userData.discord == user.tag).github;
      await gh.getIssues(data.repo.owner.login, data.repo.name).createIssue({ title: data.title, body: data.content + `\n\n> This issue was posted by @${postedBy}` })
        .then((body) => edit(data.msg, data.author, {
          title: `<:issue_open:750967991126196334> Issue opened: ${body.data.title} #${body.data.number}`,
          description: body.data.body,
          color: "#28a745",
          timestamp: new Date(),
          thumbnail: {
            url: data.img
          },
          url: body.data.html_url,
          footer: {
            "text": data.repo.full_name
          },
        })).catch((err) => cancel(data.author, "`エラー`\n```" + err.statusCode + "```\n```" + err.body + "```"));
      close(data.author);
    }
  }

  if (mode == "checkTitle") {
    if (react.emoji.name === "❌") {
      swMode("setTitle");
      react.emoji.name = "✅";
    } else if (react.emoji.name === "✅") {
      swMode("setContent");
    }
  }
  if (mode == "setContent") {
    if (react.emoji.name === "❌") {
      swMode("checkTitle");
      issueCheckTitle(data);
    }
    issueSetContent(data);
  }
  if (mode == "setTitle") {
    if (react.emoji.name === "❌") {
      cancel(data.author);
      return;
    }
    issueSetTitle(data);
  }


  if (mode == "ownerChose") {
    data = issueGUIData[user.id];
    //console.log(data.owner);
    if (data.pickedRepos === undefined) issueGUIData[data.author.id].pickedRepos = new Object();
    if (data.pickedRepos.repos === undefined) {
      issueGUIData[data.author.id].pickedRepos.repos = await sliceBy(await gh.getUser(data.owner).listRepos().then(repo => repo.data), 10);
      issueGUIData[data.author.id].authorImg
    }
    if (data.pickedRepos.cnt === undefined) issueGUIData[data.author.id].pickedRepos.cnt = 0;
    if (react.emoji.name === "◀") issueGUIData[data.author.id].pickedRepos.cnt--;
    if (react.emoji.name === "▶") issueGUIData[data.author.id].pickedRepos.cnt++;
    data = issueGUIData[user.id];

    if (data.pickedRepos.cnt != 0) await data.msg.react("◀");
    const userStr = await data.pickedRepos.repos[data.pickedRepos.cnt].reduce(async (acc, repo, index) => {
      if (index !== 0) acc = await acc + "\n";
      acc = await acc + `${index}: ${repo.full_name}`;
      await data.msg.react(index + "\uFE0F\u20E3");
      return await acc;
    }, "");
    if (data.pickedRepos.cnt + 1 < data.pickedRepos.repos.length) await data.msg.react("▶");
    await data.msg.react("❌");
    await edit(data.msg, data.author, embedAlert("レポジトリを選択 - 通報(Issue)", `該当するレポジトリを選択してください。`, "#FF0000", new Date(), data.img,
      [{ name: "Page: " + `${data.pickedRepos.cnt + 1} / ${data.pickedRepos.repos.length}`, value: `\`\`\`${userStr}\`\`\`` }]));
    swMode("selectRepos");
  }
});

const createIssue = async (msg) => {
  let botData;
  const msgParam = msg.content.split(" ");
  if (msgArchive !== false && msgArchive !== undefined) {
    botData = ids.botsData.find(bot => bot.id == msgArchive.author.id);
  }
  if (msgParam[1] !== undefined) {
    botData = ids.botsData.find(bot => bot.id == msgParam[1]);
  }

  if (issueGUIData[msg.author.id] !== undefined) {
    issueGUIData[msg.author.id].msg.reactions.removeAll();
    issueGUIData[msg.author.id].msg.edit("`このIssueフォームはCloseされました`", { embed: null });
    issueGUIData[msg.author.id] = undefined;
  }
  const gui = await msg.reply("`お待ちください...`");
  await gui.react("✅");
  await gui.react("❌");
  if (botData === undefined) {
    gui.edit(`<@${msg.author.id}>`, { embed: embedAlert("通報(Issue)", "治安維持のための通報に感謝します。Issueを作成しますか？", "#FF0000", new Date(), "https://i.imgur.com/3wSKpGi.png", [{ name: "✅", value: " はい" }, { name: "❌", value: "キャンセル" }]) });
  } else {
    gui.edit(`<@${msg.author.id}>`, { embed: embedAlert(`${botData.owner}/${botData.repo}への通報(Issue)`, `${botData.owner}/${botData.repo}へのIssueですか？`, "#FF0000", new Date(), botData.img, [{ name: "✅", value: " はい" }, { name: "❌", value: "別のレポジトリを通報する" }]) });
  }
  issueGUIData[msg.author.id] = new Object();
  issueGUIData[msg.author.id].msg = gui;
  issueGUIData[msg.author.id].author = msg.author;
  issueGUIData[msg.author.id].mode = botData === undefined ? "generated" : "targeted";
  if (botData !== undefined) {
    issueGUIData[msg.author.id].repo = await gh.getRepo(botData.owner, botData.repo).getDetails().then(repo => repo.data);
    console.log(issueGUIData[msg.author.id].repo)
    issueGUIData[msg.author.id].img = botData.img;
    issueGUIData[data.author.id].owner = await ids.userData[num].github;
  }
  msgArchiveCnt = 0;
  msgArchive = undefined;
}

const IFToDate = (dateSt) => {
  const AMPMto24H = (time) => {
    let hours = Number(time.match(/^(\d+)/)[1]);
    let minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/(.{2})$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + ":" + sMinutes);
  }
  let datePt = dateSt.split(" ");
  datePt[1] = datePt[1].substr(0, datePt[1].length - 1);
  datePt.splice(3, 1);
  datePt[3] = AMPMto24H(datePt[3]);
  const dateStNew = datePt.join(" ");
  return new Date(dateStNew);
}

const embedAlert = (name, description, color, time, userIcon, fields = []) => {
  return {
    "title": name,
    "description": description,
    "color": color,
    "timestamp": time,
    "thumbnail": {
      "url": userIcon
    },
    "fields": fields
  };
};
let server,
  logCh,
  channel,
  devCh,
  actCh,
  activityTimeCache = 0,
  APITimeCache = 0;
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
let realtimeScanDisable = false;
const dateFormat = (date, format) => {
  format = format.replace(/YYYY/, date.getFullYear());
  format = format.replace(/MM/, ('00' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/, ('00' + date.getDate()).slice(-2));
  format = format.replace(/HH/, ('00' + date.getHours()).slice(-2));
  format = format.replace(/II/, ('00' + date.getMinutes()).slice(-2));
  format = format.replace(/SS/, ('00' + date.getSeconds()).slice(-2));
  return format;
}
const cron = require('node-cron');
const { stringify } = require('querystring');
class analyzer {
  on = false;
  cnt = 0;
}
anl = new analyzer();

cron.schedule('0,30 0-5 * * *', () => {
  genkaiCheck();
});

if (fs.existsSync('apiLaunched.json')) {
  fs.watch('apiLaunched.json', async function (event, filename) {
    let APIData = JSON.parse(fs.readFileSync(__dirname + '/apiLaunched.json', 'utf8') || "null");
    if (APITimeCache != APIData.time) {
      if (APIData.method != "todoist") {
        const embed = {
          "title": `**GET api/${APIData.method}.php** が実行されました`,
          "description": "```Hello, world!\n```",
          "color": 65535,
          "timestamp": new Date(),
          "footer": {
            "icon_url": "https://cdn.discordapp.com/avatars/709077937005264948/ebe1823c4fd5cd615d67915ba4c2d5a8.png",
            "text": "Protected by Bony SECURITY POLICE"
          },
          "author": {
            "name": "Bony SECURE Notice"
          },
          "fields": [
            {
              "name": "HOST",
              "value": APIData.host
            },
            {
              "name": "TIMESTAMP",
              "value": APIData.time
            },
            {
              "name": "status",
              "value": APIData.status
            },
            {
              "name": "message",
              "value": APIData.mes
            }
          ]
        };
        logCh.send({ embed });
        APITimeCache = APIData.time;
      } else {
        const member = server.members.cache.find(member => member.user.tag == APIData.userTag);
        if (member === undefined) {
          const fields = [
            {
              "name": "HOST",
              "value": APIData.host
            },
            {
              "name": "TIMESTAMP",
              "value": APIData.time
            },
            {
              "name": "status",
              "value": APIData.status
            },
            {
              "name": "message",
              "value": APIData.mes
            }
          ];
          const embed = embedAlert(`APIエラー: **POST api/${APIData.method}.php**`, `\`\`\`該当するUserTag: ${APIData.userTag}はこの鯖に見つかりませんでした。\`\`\``, 16711680, APIData.todoData.time, null, fields);
          logCh.send({ embed });
          return;
        }
        const name = member.nickname !== null ? member.nickname : member.user.username;
        const todoDate = IFToDate(APIData.todoData.time);
        console.log(APIData.todoData.time);
        const title = `「${APIData.todoData.name}」達成！`;
        let description, point
        if ((todoDate.toFormat("HH24") >= 6) && (todoDate.toFormat("HH24") <= 23)) {
          console.log("健康！");
          description = `${name}さん、お疲れ様！`;
          point = -1000;
        } else {
          console.log("限界...");
          description = `${name}さん、お疲れ様！ただ、次からはもう少し早い時間帯でやりましょうね...\nHint: 健康時間帯でタスクを終わらせるともっとGogler Pointを減らせるよ！`;
          point = -500;
        }
        runGoglerPoint(member.user.id, point, name);
        fields = [
          {
            "name": "今回獲得したGogler Point",
            "value": point,
            "inline": true
          },
          {
            "name": "現在のGogler Point",
            "value": genkaiData[member.user.id].point,
            "inline": true
          }
        ]
        embed = await embedAlert(title, description, 11175687, todoDate, member.user.displayAvatarURL(), fields);
        actCh.send({ embed });
      }
    }
  })
}
const checkMemberActivity = async () => {
  const targetUser = await server.members.cache.filter(member => !member.user.bot && (member.presence.status == "online"));
  targetUser.forEach(member => {
    console.log(member.user.username);
    if (member.presence.activities.length == 0) {
      console.log("No Data!!!");
    } else {
      console.log(member.presence.activities[0].name);
      console.log(member.presence.activities[0].details);
      console.dir(member.presence.activities);

    }
  })
}

const genkaiCheck = async () => {
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
    if ((member.presence.activities.length > 1) || ((member.presence.activities.length == 1) && (member.presence.activities[0].name != "Custom Status"))) {
      if (member.presence.activities[0].name == 'Visual Studio Code') {
        description = description + `\nまた、あなたは${member.presence.activities[0].name}を使用していましたね？？(無論あなたが${member.presence.activities[0].state}で${member.presence.activities[0].details}であったことも知っています)\nこの鯖は健康を目指しており、**深夜のゲームプレイ・開発は__厳重な違反です。__**\nよって該当ユーザーには通常よりも多くの違反点をつけさせていただきます💢`;
      } else {
        description = description + `\nまた、あなたは${member.presence.activities[0].name}を使用していましたね？？\nこの鯖は健康を目指しており、**深夜のゲームプレイ・開発は__厳重な違反です。__**\nよって該当ユーザーには通常よりも多くの違反点をつけさせていただきます💢`;
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
    embeds.push(embedAlert(name, description, 12390624, new Date(), userIcon, fields))
  });
  await embeds.forEach(embed => {
    channel.send({ embed })
  });
}

const memberChecker = (msg) => {
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
        "value": `${(parseFloat(bot.size) / parseFloat(members.size)) * 100}%`,
        "inline": true
      }
    ]
  };
  msg.channel.send({ embed });
}

const runGoglerPoint = async (id, point, name) => {
  if (genkaiData[id] == null) genkaiData[id] = {};
  genkaiData[id].name = name;
  if (genkaiData[id].point == null) genkaiData[id].point = 0;
  if ((genkaiData[id].point < 0) && (point >= 0)) genkaiData[id].point = 0;
  genkaiData[id].point += point;
  await saveGenkaiData(genkaiData);
}

const checkRepo = async (msg) => {
  let embed = msg.embeds[0];
  if (embed.title.search(/new commit.??$/) === -1) { console.log("This isn't commit"); return; }
  if ((gitName = embed.description.substr(embed.description.search(/\s[^\s]*$/) + 1)) === -1) { console.log("Failed to get user name"); return; }
  const member = server.members.cache.find(member => member.user.tag == ids.userData.find(user => user.github == gitName).discord);
  const user = member.user
  let name = member.nickname !== null ? member.nickname : user.username;
  const dt = new Date();
  let title, description, color;
  if ((dt.toFormat("HH24") >= 6) && (dt.toFormat("HH24") <= 23)) {
    point = -500;
    title = await "健康な時間帯のコミットです！";
    description = await `Gogler Point ${point}`;
    color = await 65280;
  } else if ((dt.toFormat("HH24") >= 0) && (dt.toFormat("HH24") <= 5)) {
    point = 100;
    title = await `**限界開発が検出されました**`;
    description = await `Gogler Point ${point}💢`;
    color = await 16312092;
  } else {
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
  msg.channel.send({ embed });
  await saveGenkaiData(genkaiData);
}



const hashAutoAdd = async (msg) => {
  const categoryCh = server.channels.cache.find(ch => (ch.name.toLowerCase() == "hashtags") && (ch.type == "category"));
  let hashes = msg.content.split(" ").filter(msg => ((msg.indexOf("#") !== -1) && (isNaN(msg.substr(1)) && (msg.substr(1).search(/>$/) === -1))));
  hashes = hashes.map(msg => msg.substr(msg.indexOf("#")));
  let hashChs = [];
  let nameCache = [];
  let isNewHash = false;
  for (let i = 0; i < hashes.length; i++) {
    let hashName = await hashes[i].substr(1);
    if ((server.channels.cache.find(ch => ch.name == hashName) === undefined) && (nameCache.find(el => el == hashName) === undefined)) {
      hashChs[i] = await server.channels.create(hashName, { parent: categoryCh });
      await nameCache.push(hashes[hashName]);
      isNewHash = true;
    } else {
      hashChs[i] = await server.channels.cache.find(ch => ch.name == hashChs[i]);
    }
  }
  console.dir(hashes);
  let sendMes = msg.content;
  if (isNewHash) {
    for (let i = 0; i < hashChs.length; i++) {
      sendMes = await sendMes.replace(hashes[i], `<#${hashChs[i].id}>`);
      console.log(hashChs[i].id);
    }
    msg.delete();
    console.log(sendMes);
    msg.reply(sendMes);
  }

}

client.on('presenceUpdate', async (oldUser, newUser) => {
  if (newUser.guild !== server) return;
  const cacheData = await { "status": newUser.status, "id": newUser.userID };
  activityTimeCache = cacheData;
  console.log("EventFound.");
  const member = server.members.cache.get(newUser.userID);
  if ((newUser.user.bot) && ((oldUser === undefined) || (oldUser.status !== newUser.status)) && (member.roles.cache.find(role => role.name == "DEVELOPING") === undefined)) {
    const member = newUser.member;
    const botStatus = newUser.status;
    console.dir(botStatus);
    if (botStatus == "online") {
      const embed = embedAlert(`${member.user.username} がオンラインになりました`, "長期アップデートにより、より危険な仕様に変更されている可能性があります", 16711680, new Date(), member.user.displayAvatarURL());
      channel.send({ embed });
    }
    if (botStatus == "offline") {
      const embed = embedAlert(`${member.user.username} がオフラインになりました`, "長期アップデートにより、危険な仕様が追加される可能性があります。", 16312092, new Date(), "https://i.imgur.com/LQiUEtF.png");
      channel.send({ embed });
    }
  }
  if ((!server.members.cache.get(oldUser.userID).user.bot) && (oldUser.activities.length < newUser.activities.length) && (newUser.activities[0].name != "Custom Status")) {
    console.log("got it!");
    const member = server.members.cache.get(oldUser.userID);
    const isVS = (newUser.activities[0].name.indexOf("Visual Studio") !== -1)
    if (!isVS) return;
    const color = isVS ? 16312092 : 5301186;
    const name = member.nickname !== null ? member.nickname : member.user.username;
    const description = isVS ? `危険なアプリケーションが開発される恐れがあります。\n${name}:\n\`\`\`さて、、、いっちょなにか作ってやりますか(ｷﾘｯ\`\`\`` : `\n${name}:\n\`\`\`もうﾏﾁﾞ無理…ﾏﾘｶしよ…ﾌﾞｫｫｫｫｫｫｫﾝwwwwwwｲｲｨｨｨｨｨﾔｯﾌｩｩｩｩｩwwwwww\`\`\``
    const title = newUser.activities[0].name.indexOf("Visual Studio Code") !== -1 ? `${name}は<:vscode:751814332907520051>${newUser.activities[0].name}を起動しました` : `${name}は${newUser.activities[0].name}を起動しました`
    let embed = {
      title,
      "description": description,
      "color": color,
      "timestamp": new Date(),
      "thumbnail": {
        "url": member.user.displayAvatarURL()
      }
    };
    if (newUser.activities[0].name.indexOf("Visual Studio Code") !== -1) {
      embed.author = {
        "name": "Bony SECURE ALART",
        "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/OOjs_UI_icon_alert-yellow.svg/40px-OOjs_UI_icon_alert-yellow.svg.png"
      }
    }
    channel.send({ embed });
  }
})



client.login(accessToken);

const getTimestamp = (msg) => {
  const timeStamp = msg.content.substr(msg.content.toLowerCase().indexOf("!gettimestamp") + 3 + 4 + 5 + 1);
  const date = new Date(Number(timeStamp));
  msg.channel.send("```" + date.toLocaleString() + "```");
}

const getUserInfo = (msg) => {
  const id = msg.content.substr(msg.content.toLowerCase().indexOf("!userinfo") + 9).trim();
  console.log(id)
  const member = server.members.cache.find(member => member.user.id == id);
  msg.channel.send(`\`\`\` ${JSON.stringify(member, null, '    ')}  \`\`\``)
}

const getMesInfo = (msg) => {
  const url = msg.content.substr(msg.content.toLowerCase().indexOf("!msginfo") + 8).trim().split("/");
  //Ex: https://discordapp.com/channels/688624658286772394/711266999099195430/716899671334715522
  const channel = msg.guild.channels.cache.find(channel => channel.id == url[5]);
  channel.fetch();
  console.log(url[5])
  console.log(channel.name);
  console.dir(channel.messages.cache.filter(message => message.content !== undefined))
  channel.messages.fetch(url[6])
    .then(message => {
      console.log(message.content)
      msg.channel.send(`\`\`\` ${JSON.stringify(message, null, '    ')}  \`\`\``)
      console.log("OK");
    })
    .catch(e => {
      channel.send("```" + e + "```")
    });
}
const sushi = async (msg) => {
  await waitAndSay(msg.channel, 'ハマチ！', 250);
  await waitAndSay(msg.channel, '中トロ！', 250);
  await waitAndSay(msg.channel, '甘海老ロール！', 500);
  await waitAndSay(msg.channel, 'サーモン！', 250);
  await waitAndSay(msg.channel, 'ハンバーグ！', 1000);
  await waitAndSay(msg.channel, '稲荷！', 250);
  await waitAndSay(msg.channel, 'サラダ！', 2500);
  await waitAndSay(msg.channel, 'サーモン炙り！', 500);
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
  await waitAndSay(msg.channel, '/happy', 10);
}

const waitAndSay = async (channel, mes, sec) => {
  await channel.send(mes);
  await sleep(sec)
}
const startCheck = async (channel, server) => {
  if (anl.on) return;
  anl.on = true;
  await sleep(2000);
  if (anl.cnt >= 10) {
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
    await role_created.setPosition(myRole.rawPosition - 1)
      .then(updated => console.log(`Role position: ${updated.position}`))
      .catch(console.error);
    channel.permissionsFor(role_created);
    channel.overwritePermissions([
      {
        id: role_created,
        deny: ['SEND_MESSAGES'],
      },
    ], 'Needed to change permissions');
    await server.members.cache.forEach(member => {
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
    await channel.send("@everyone **重大な治安悪化が検出されました**", { embed, "tts": true });
    logCh.send({ embed, "tts": false });
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
    await channel.send({ embed, "tts": false });
    logCh.send({ embed, "tts": false });
    let blockedRoles = await server.roles.cache.filter(role => role.name === "BLOCKED");
    await blockedRoles.forEach(role => { try { role.delete() } catch { console.log('lol') } });
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
