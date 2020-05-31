exports.memberChecker = (msg) =>{
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