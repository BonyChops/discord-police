const fs = require('fs');
exports.apiLaunched = () => {
    fs.watch('apiLaunched.json', async function(event, filename) {
        let APIData = JSON.parse(fs.readFileSync(__dirname+'/apiLaunched.json' , 'utf8') || "null");
        if(APITimeCache != APIData.time){
          if(APIData.method != "todoist"){
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
            logCh.send({embed});
            APITimeCache = APIData.time;
          }else{
            const member = server.members.cache.find(member => member.user.tag == APIData.userTag);
            if(member === undefined){
            const fields= [
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
              const embed = embedAlert(`APIエラー: **POST api/${APIData.method}.php**`, `\`\`\`該当するUserTag: ${APIData.userTag}はこの鯖に見つかりませんでした。\`\`\``,16711680, APIData.todoData.time,null, fields);
              logCh.send({embed});
              return;
            }
            const name = member.nickname !== null ? member.nickname : member.user.username;
            const todoDate = IFToDate(APIData.todoData.time);
            console.log(APIData.todoData.time);
            const title = `「${APIData.todoData.name}」達成！`;
            let description,point
            if((todoDate.toFormat("HH24")>= 6)&&(todoDate.toFormat("HH24")<= 23)){
              console.log("健康！");
              description = `${name}さん、お疲れ様！`;
              point = -1000;
            }else{
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
            actCh.send({embed});
          }
        }
    })
}