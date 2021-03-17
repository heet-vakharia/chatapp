const leaveGroup = async ({ data, db, io }) => {
  const { user, groupid } = data;
  const userInfo = await db("group_info").where({ groupid, member: user });
  const groupInfo = await db("all_groups").where({ groupid });

  let members = groupInfo[0].member.split(",");
  const admins = groupInfo[0].admins.split(",");
  console.log(userInfo);
  if (!userInfo[0].left_date) {
    if (members.indexOf(user) !== -1) {
      members.splice(members.indexOf(user), 1);
    } else if (admins.length > 1) {
      admins.splice(admins.indexOf(user), 1);
    }
    await db("all_groups")
      .where({ groupid })
      .update({ member: members.join(), admins: admins.join() });
    members.push(user);
  }

  await db("group_info").where({ groupid, member: user }).del();
  const socketids = await db("socketids").whereIn("name", [
    ...members,
    ...admins,
  ]);
  console.log(socketids);
  for (let socketid of socketids) {
    console.log(socketid.id);
    io.to(socketid.id).emit("group-noti", {
      type: "left_group",
      content: {
        member_left: "hskjaw",
      },
    });
  }
};
module.exports = leaveGroup;
