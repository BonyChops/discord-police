exports.embedAlert = (name, description, color, time, userIcon, fields = []) =>{
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

exports.IFToDate = (dateSt) => {
    const AMPMto24H = (time) => {
        let hours = Number(time.match(/^(\d+)/)[1]);
        let minutes = Number(time.match(/:(\d+)/)[1]);
        const AMPM = time.match(/(.{2})$/)[1];
        if(AMPM == "PM" && hours<12) hours = hours+12;
        if(AMPM == "AM" && hours==12) hours = hours-12;
        let sHours = hours.toString();
        let sMinutes = minutes.toString();
        if(hours<10) sHours = "0" + sHours;
        if(minutes<10) sMinutes = "0" + sMinutes;
        return (sHours + ":" + sMinutes);
    }
    let datePt = dateSt.split(" ");
    datePt[1] = datePt[1].substr(0,datePt[1].length-1);
    datePt.splice(3,1);
    datePt[3] = AMPMto24H(datePt[3]);
    const dateStNew = datePt.join(" ");
    return new Date(dateStNew);
}

exports.dateFormat = (date, format)=> {
  format = format.replace(/YYYY/, date.getFullYear());
  format = format.replace(/MM/, ('00' + date.getMonth() + 1).slice(-2));
  format = format.replace(/DD/, ('00' + date.getDate()).slice(-2));
  format = format.replace(/HH/, ('00' + date.getHours()).slice(-2));
  format = format.replace(/II/, ('00' + date.getMinutes()).slice(-2));
  format = format.replace(/SS/, ('00' + date.getSeconds()).slice(-2));
  return format;
}

exports.runGoglerPoint = async(id, point, name) =>{
  if(genkaiData[id] == null) genkaiData[id] = {};
  genkaiData[id].name = name;
  if(genkaiData[id].point == null) genkaiData[id].point = 0;
  if((genkaiData[id].point < 0)&&(point >= 0)) genkaiData[id].point = 0;
  genkaiData[id].point += point;
  await saveGenkaiData(genkaiData);
}

exports.checkMemberActivity = async() => {
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