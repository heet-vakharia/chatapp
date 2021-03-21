const { uid } = require("uid/secure");

const sendPrivateMsg = async ({ data, db, io, socket, users }) => {
  const { sender, receiver, text } = data;
  console.log("eijsijae");
  console.log(data, "jsafasjfdo");
  const receiverData = await db("socketids").where({ name: receiver });
  const seen_by = [sender];
  if (users[receiverData[0].id]) {
    //console.log(users[receiverData[0].id], receiver, "jawojois");
    if (
      users[receiverData[0].id].currentPosition === "private" &&
      users[receiverData[0].id].locationid === sender
    ) {
      seen_by.push(users[receiverData[0].id].username);
    }
  }
  if (!sender || !receiver || !text) {
    throw error("Invalid details");
  }
  // console.log(seen_by);
  await db("private_messages").insert({
    ...data,
    chatid: uid(),
    seen_by: seen_by.join(),
    accepted_by: [sender, receiver].join(),
  });
  const arr = await db("user_chat").where({
    receiverName: receiver,
    username: sender,
    type: "private",
  });
  const arr1 = await db("user_chat").where({
    receiverName: sender,
    username: receiver,
    type: "private",
  });
  console.log(arr);
  if (arr.length === 0 && arr1.length === 0) {
    await db("user_chat").insert({
      username: sender,
      receiverName: receiver,
      last_updated: db.fn.now(),
      type: "private",
      groupid: null,
    });
    await db("user_chat").insert({
      username: receiver,
      receiverName: sender,
      last_updated: db.fn.now(),
      type: "private",
      groupid: null,
    });
  }
  if (arr.length === 0 || arr1.length === 0) {
    await db("user_chat").insert({
      username: arr.length === 0 ? sender : receiver,
      receiverName: arr.length === 0 ? receiver : sender,
      last_updated: db.fn.now(),
      type: "private",
      groupid: null,
    });
  } else {
    await db("user_chat")
      .where({ receiverName: receiver, type: "private" })
      .update({ last_updated: db.fn.now() });
  }

  io.to(receiverData[0].id).emit("new-message", {
    ...data,
    type: "private",
  });
};
module.exports = sendPrivateMsg;
