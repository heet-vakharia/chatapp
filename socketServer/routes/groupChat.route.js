const groupChat = async ({data,io,db ,socket}) => {
    const {groupid,username} = data;
    const userInfo = await db("group_info").where({groupid,member:username})
    const messages = await db("group_chat").where({groupid}).having("created" ,">=" ,userInfo[0].in_date);
    io.to(socket.id).emit("allGroupMessages" ,messages);
}
module.exports = groupChat;