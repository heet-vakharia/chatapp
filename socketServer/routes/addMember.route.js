const addMember = async ({ data, db, io }) => {
  const { groupid, username, newMembers, group_name } = data;
  for (let member of newMembers) {
    await db("group_info").insert({
      groupid,
      member,
      group_name,
      is_admin: false,
    });
  }
  const groupInfo = await db("all_groups").where({ groupid });
  const members = groupInfo[0].member.split(",");
  await db("all_groups")
    .where({ groupid })
    .update({ member: [...members, ...newMembers].join() });
  members.push(...groupInfo[0].admins.split(","));
  const memberSocketIds = await db("socketids").whereIn("name", [
    ...members,
    newMembers,
  ]);
  for (memberSocketId of memberSocketIds) {
    io.to(memberSocketId.id).emit("group-noti", {
      type: "new member",
      content: {
        members: newMembers,
        added_by: username,
        on: Date(),
      },
    });
  }
};
module.exports = addMember;
