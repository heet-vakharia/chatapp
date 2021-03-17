const removeMember = async ({data ,io ,db }) => {
    const {memberName,position,username,groupid} = data;
    console.log(data,"hello")
    const userinfo = await db("group_info").where({groupid,member:username});
    if(userinfo[0].is_admin){
        await db("group_info").where({groupid,member:memberName}).update({left_date:db.fn.now()});
        const groupInfo= await db("all_groups").where({groupid});
        const arr = groupInfo[0][position].split(",");
        console.log(groupInfo)
        arr.splice(arr.indexOf(memberName),1);
        // db("group_info").where({groupid}).update({[position]:arr.join()});
        const members = groupInfo[0].member.split(",");
        members.push(...groupInfo[0].admins.split(","));
         await db("all_groups").where({groupid}).update({[position]:arr.join()})
        const memberSocketIds = await db("socketids").whereIn("name",members);
        const newGroupInfo = await db("all_groups").where({groupid});
        await db("group_chat").insert({
            type:"announcement",
            sender:null,
            groupid,
            chatid:uid(),
            accepted_by:members.join(),
            seen_by:username,
            text:`${username} kicked ${memberName}`
        })
    for(memberSocketId of memberSocketIds){
            io.to(memberSocketId.id).emit("group-noti",{
                type:"deleted member",
                content : {
                    deletedMember: memberName,
                    newGroupInfo:{
                        members:newGroupInfo[0].member.split(","),
                        admins:newGroupInfo[0].admins.split(","),
                        group_name:newGroupInfo[0].group_name,
                        groupid,
                    },
                    done_by:username
                }
            })
       
    }
    }
    else{
        io.to(socket.id).emit("group-noti",{
            type:"delete member",
            content:{
                err: "Not Authorized"
            }
        })
     }
   
}

module.exports = removeMember