const onPrivateChat = async ({ data, io, db }) => {
  const { user, friend } = data;
  console.log("daas");
  const allChat = await db("private_messages").where({
    sender: friend,
    receiver: user,
  });
  for (chat of allChat) {
    const seen_by = chat.seen_by.split(",");
    if (seen_by.indexOf(user) === -1) seen_by.push(user);
    await db("private_messages")
      .where({ chatid: chat.chatid })
      .update({ seen_by: seen_by.join() });
  }
};
module.exports = onPrivateChat;
