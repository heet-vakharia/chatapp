const { uid } = require("uid");
const createGroup = async ({ db, io, data, socket }) => {
  const { group_name, username, members } = data;
  console.log("create group", data);

  const groupinfo = [
    {
      group_name,
      is_admin: true,
      member: username,
      groupid: uid(),
    },
  ];
  await db("user_chat").insert({
    username: username,
    receiverName: group_name,
    last_updated: db.fn.now(),
    groupid: groupinfo[0].groupid,
    type: "group",
  });
  console.log(members);
  for (let member of members) {
    groupinfo.push({
      group_name,
      is_admin: false,
      member,
      groupid: groupinfo[0].groupid,
    });
    await db("user_chat").insert({
      username: member,
      receiverName: group_name,
      last_updated: db.fn.now(),
      groupid: groupinfo[0].groupid,
      type: "group",
    });
  }
  await db("all_groups").insert({
    groupid: groupinfo[0].groupid,
    group_name,
    member: members.join(),
    admins: username,
  });

  await db("group_info").insert(groupinfo);
  const group = await db("all_groups").where({ groupid: groupinfo[0].groupid });
  // groupArr = {
  //     group_name,
  //     groupid:groupinfo[0].groupid,
  //     members:[],
  //     admins:[],
  //     created :
  // }
  console.log(group);

  const memberSocketIds = await db("socketids").whereIn("name", [
    ...members,
    username,
  ]);
  for (memberSocketId of memberSocketIds) {
    console.log(memberSocketId.id);
    io.to(memberSocketId.id).emit("group-noti", {
      type: "new group",
      content: {
        ...group[0],
        member: members,
        created_by: username,
      },
    });
  }
};
module.exports = createGroup;
