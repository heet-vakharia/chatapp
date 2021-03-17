const onGroupChat = async ({ db, io, data }) => {
  const { groupid, username } = data;
  const allChats = await db("group_chat").where({ groupid });
  for (let chat of allChats) {
    const seen_by = chat.seen_by.split(",");
    if (seen_by.indexOf(username) === -1) seen_by.push(username);
    await db("group_chat")
      .where({ groupid, chatid: chat.chatid })
      .update({ seen_by: seen_by.join() });
    //- jaskjal
  }
};
module.exports = onGroupChat;
