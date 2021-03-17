const express = require("express");
const { uid } = require("uid/secure");
const wrapper = (db) => {
  const router = express.Router();

  class DeleteChat {
    async specific(req, res) {
      const { chatids, username, type } = req.body;
      console.log(req.body);
      const chats = await db(
        type === "group" ? `group_chat` : "private_messages"
      ).whereIn("chatid", chatids);
      const newAccepted_By = [];
      console.log(chats);
      for (let chat of chats) {
        const accepted_by = chat.accepted_by.split(",");
        if (accepted_by.indexOf(username) !== -1) {
          accepted_by.splice(accepted_by.indexOf(username), 1);
          await db(type === "group" ? `group_chat` : "private_messages")
            .where({ chatid: chat.chatid })
            .update({ accepted_by: accepted_by.join() });
        } else if (accepted_by.indexOf(username) === -1) {
          res.json({ err: "Already deleted" });
        }
        if (accepted_by.length === 0) {
          await db(type === "group" ? `group_chat` : "private_messages")
            .where({ chatid: chat.chatid })
            .del();
        }

        newAccepted_By.push(accepted_by);
      }

      console.log(newAccepted_By);
      res.json({ newAccepted_By, chats });
    }
    // async deleteWhole(req,res) {
    //     const {chats,user} = req.body;
    //     for(let chat of chat) {
    //         if(chat.type === "group"){
    //                     await db("user_chat").where({groupid,type:"group"}).del()
    //                     const allMsgs = []
    //                     const chats = await db("group_chat").where({groupid});
    //                         const updatedChat = []
    //                         for(let chat of chats){
    //                             const accepted_by = chat.accepted_by.split(",");
    //                             if(accepted_by.indexOf(user) !== -1){
    //                                 accepted_by.splice(accepted_by.indexOf(user),1)
    //                                 chat.accepted_by = accepted_by.join()
    //                                 console.log(accepted_by)
    //                                 updatedChat.push(chat);
    //                                 await db("group_chat").where({groupid,chatid:chat.chatid}).update({accepted_by:accepted_by.join()});
    //                                 if(accepted_by.length === 0 ){
    //                                     await db("group_chat").where({chatid:chat.chatid}).del();
    //                                 }
    //                             }

    //                         }

    //                     res.json(allMsgs)

    //                 }
    //         else if(chat.type === "private"){
    //                     const allMsgs = []
    //                 await db("user_chat").where({receiverName:friend , type:"private"}).del()
    //                     for(let friend of friends){
    //                         const chats = await await db("private_messages").where({sender:user,receiver:friend}).orWhere({sender:friend,receiver:user});
    //                         const updatedChat = []
    //                         for(let chat of chats){
    //                             const accepted_by = chat.accepted_by.split(",");
    //                             if(accepted_by.indexOf(user) !== -1){
    //                                 accepted_by.splice(accepted_by.indexOf(user),1)
    //                                 chat.accepted_by = accepted_by.join()
    //                                 updatedChat.push(chat);

    //                                 if(accepted_by.length === 0 ){
    //                                     await db("private_messages").where({chatid:chat.chatid}).del();
    //                                 }
    //                             }

    //                         }
    //                         allMsgs.push(updatedChat)
    //                     }
    //                     res.json(allMsgs)
    //                 }
    //     }

    // }
    async deleteWhole(req, res) {
      const { chatrooms, username: user } = req.body;
      //console.log(chatrooms);
      const allMsgs = [];
      for (let chatroom of chatrooms) {
        const { groupid, type, friend } = chatroom;
        console.log(groupid, "jiewjoi");
        //console.log(chatroom);
        if (groupid !== null) {
          // Delete Group from Table: user_chat
          await db("user_chat").where({ groupid, type, username: user }).del();
          // Getting All Messages sent in the Group
          const allChats = await db("group_chat").where({ groupid });
          // Store Chat all removing user from accepted_by
          const updatedChat = [];
          // Loops in All Chats of a Specific Group
          for (let chat of allChats) {
            // Removing User from accepted_by Column and then saving to the Database
            const accepted_by = chat.accepted_by.split(",");
            if (accepted_by.indexOf(user) !== -1) {
              accepted_by.splice(accepted_by.indexOf(user), 1);
              chat.accepted_by = accepted_by.join();
              console.log(accepted_by);
              updatedChat.push(chat);
              await db("group_chat")
                .where({ groupid, chatid: chat.chatid })
                .update({ accepted_by: accepted_by.join() });
              if (accepted_by.length === 0) {
                await db("group_chat").where({ chatid: chat.chatid }).del();
              }
            }
          }
          console.log(updatedChat, chatroom);
        } else {
          // Delete Friend Chat from Table: user_chat
          console.log(friend, user);
          console.log("Hwjoij");
          await db("user_chat")
            .where({
              type: "private",
              username: user,
              receiverName: friend,
            })
            .del();
          // Getting All Messages sent between user and that user
          const allChats = await db("private_messages")
            .where({ sender: user, receiver: friend })
            .orWhere({ sender: friend, receiver: user });

          // Store new ChatInfo after all removing user from accepted_by
          const updatedChat = [];
          // Loops in All Chats of a Specific Group
          for (let chat of allChats) {
            // Removing User from accepted_by Column and then saving to the Database
            const accepted_by = chat.accepted_by.split(",");
            if (accepted_by.indexOf(user) !== -1) {
              accepted_by.splice(accepted_by.indexOf(user), 1);
              chat.accepted_by = accepted_by.join();
              updatedChat.push(chat);
              await db("private_messages")
                .where({ chatid: chat.chatid })
                .update({ accepted_by: accepted_by.join() });
              // Deleting whole row if accepted by is empty
              if (accepted_by.length === 0) {
                await db("private_messages")
                  .where({ chatid: chat.chatid })
                  .del();
              }
            }
          }
        }
      }
      res.json(allMsgs);
    }
  }

  router.delete("/specific", new DeleteChat().specific);
  router.delete("/whole", new DeleteChat().deleteWhole);
  return router;
};

module.exports = wrapper;
