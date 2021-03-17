const changeGroupName = async ({data,io,db}) => {
    const {groupid,group_name ,username} = data;
    console.log(data)
    await db("group_info").where({groupid}).update({group_name});
    await db("all_groups").where({groupid}).update({group_name});
    const groupInfo = await db("all_groups").where({groupid});
    console.log(groupInfo)
     const members = groupInfo[0].member.split(",");
    members.push(...groupInfo[0].admins.split(","));
    const memberSocketIds = await db("socketids").whereIn("name",members) 
    for(memberSocketId of memberSocketIds){
        io.to(memberSocketId.id).emit("group-noti",{
            type:"name changed",
            content:{
                new_name:group_name,
                changed_by:username,
                on:Date()
            }
        })
    }
}
module.exports = changeGroupName