const express = require("express");
const { uid } = require("uid/secure");
const wrapper = (db) => {
  const router = express.Router();

  class Group {
    async find(req, res) {
      const { username } = req.query;
      const data = await db("group_info").where("member", username);
      res.json(data);
    }
    async groupInfo(req, res) {
      const { groupid, user } = req.body;

      const userValid = await db("group_info")
        .where({ groupid, member: user })
        .select("member");
      if (userValid.length === 0) {
        res.status(401).json({ err: "Not Authorize" });
      }
      const data = await db("group_info").where("groupid", groupid);

      let group_info = {
        groupid: groupid,
        group_name: data[0].group_name,
        members: [],
        admins: [],
      };
      //console.log(data)
      for (let dat of data) {
        if (!dat.left_date) {
          if (!dat.is_admin) {
            group_info.members.push(dat.member);
          } else {
            group_info.admins.push(dat.member);
          }
        }
      }
      res.json(group_info);
    }
    async allMessages(req, res) {
      const { groupid, username } = req.body;
      // console.log(req.body,"all")
      if (!groupid || !username) {
        return res.status(400).json({ err: "invalid details" });
      }
      const userInfo = await db("group_info")
        .where({ groupid, member: username })
        .select("left_date");

      if (userInfo.length === 0) {
        return res.status(401).json({ message: "Not Authoried" });
      }
      const chats = await db("group_chat").where({ groupid });
      var allMsgs = [];
      for (let chat of chats) {
        const members = chat.accepted_by.split(",");
        for (let member of members) {
          if (member === username) {
            allMsgs.push(chat);
          }
        }
      }
      // console.log(allMsgs)
      res.status(200).json({
        chats: allMsgs,
        left_date: userInfo[0].left_date,
      });
    }
  }
  router.get("/all", new Group().find);
  router.post("/info", new Group().groupInfo);
  router.post("/allGroupMessages", new Group().allMessages);
  return router;
};

module.exports = wrapper;
