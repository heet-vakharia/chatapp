const { uid } = require("uid/secure");
const sendGroupMsg = async ({ data, io, db, users }) => {
  const { groupid, sender, text } = data;
  const groupInfo = await db("all_groups").where({ groupid });
  const members = groupInfo[0].member.split(",");
  members.push(...groupInfo[0].admins.split(","));
  const memberSocketIds = await db("socketids").whereIn("name", members);
  const arr = await db("user_chat")
    .whereIn("username", members)
    .andWhere({ groupid });
  let membersNotInList = [];
  let memberInList = [];
  //console.log(groupInfo);
  if (arr.length <= members.length) {
    for (let item of arr) {
      for (let member of members) {
        if (item.username === member) {
          memberInList.push(member);
          await db("user_chat")
            .where({ groupid, username: member })
            .update({ last_updated: db.fn.now() });
        } else if (
          item.username !== member &&
          membersNotInList.indexOf(member) === -1 &&
          memberInList.indexOf(member) === -1
        ) {
          membersNotInList.push(member);
        }
        if (
          membersNotInList.indexOf(member) > -1 &&
          memberInList.indexOf(member) > -1
        ) {
          membersNotInList.splice(membersNotInList.indexOf(member), 1);
        }
      }
    }
  }
  if (arr.length === 0) {
    members.map(async (member) => {
      await db("user_chat").insert({
        username: member,
        receiverName: groupInfo[0].group_name,
        last_updated: db.fn.now(),
        type: "group",
        groupid,
      });
    });
  }

  membersNotInList.map(async (member) => {
    await db("user_chat").insert({
      username: member,
      receiverName: groupInfo[0].group_name,
      last_updated: db.fn.now(),
      type: "group",
      groupid,
    });
  });
  const seen_by = [sender];
  console.log(users);
  console.log(seen_by, "edhsoiaheosi", members);
  for (let memberSocketId of memberSocketIds) {
    for (let member of members) {
      if (
        users[memberSocketId.id] !== undefined &&
        seen_by.indexOf(member) === -1
      ) {
        console.log(seen_by, "sjaiojd");
        if (
          users[memberSocketId.id].currentPosition === "group" &&
          users[memberSocketId.id].locationid === groupInfo[0].groupid &&
          users[memberSocketId.id].username === member
        ) {
          console.log(member, seen_by);
          seen_by.push(member);
        }
      }
    }
  }
  console.log(seen_by, "jewiqj");
  await db("group_chat").insert({
    groupid,
    sender,
    text,
    chatid: uid(),
    type: "message",
    accepted_by: members.join(),
    seen_by: seen_by.join(),
  });

  for (let memberSocketId of memberSocketIds) {
    io.to(memberSocketId.id).emit("group-noti", {
      type: "new message",
      content: {
        sender,
        text,
        groupid,
        created_at: Date(),
        group_name: groupInfo[0].group_name,
      },
    });
  }
};
module.exports = sendGroupMsg;
