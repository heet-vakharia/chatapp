const changePosition = async ({data,db,io}) => { 
    const {newPosition,username , groupid,user} =data;
    const userInfo = await db("all_groups").where({groupid});
    const membersArr = userInfo[0].member.split(",");
    const adminsArr = userInfo[0].admins.split(",");
    const socketids = await db("socketids").whereIn("name",[...membersArr,...adminsArr]);

    if(newPosition === "member" && adminsArr.length > 1){
        console.log(newPosition,"if")
        await db("group_info").where({groupid}).update({is_admin:false});
        adminsArr.splice(adminsArr.indexOf(username),1);
        membersArr.push(username)
        await db("all_groups").where({groupid}).update({admins:adminsArr.join(),member:membersArr.join()});        
    }
    else{
        console.log(newPosition,"else")

       await db("group_info").where({groupid,member:username}).update({is_admin:true});
        membersArr.splice(membersArr.indexOf(username),1);
        adminsArr.push(username),

        await db("all_groups").where({groupid}).update({member:membersArr.join(),admins:adminsArr.join()}); 
    }
    for(let socketid of socketids) {
        io.to(socketid.id).emit("group-noti",{
            type:"changed position",
            content:{
                members:membersArr,
                admins:adminsArr,
                changed_by:user,
                groupid,
                group_name:userInfo[0].group_name
            }
        })
    }  
}
module.exports = changePosition;