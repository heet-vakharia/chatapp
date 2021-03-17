const http = require("http").createServer();

const db = require("knex")({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "1234567890",
    database: "chat_app",
    port: 3306,
  },
});
//*
//* Routes
//*
//!Private Chat
const sendPrivateMsg = require("./routes/sendPrivateMsg.route");
const onPrivateChat = require("./routes/onPrivateChat.route");
// !Group Chat
const createGroup = require("./routes/createGroup.route");
const addMember = require("./routes/addMember.route");
const changePosition = require("./routes/changePosition.route");
const changeGroupName = require("./routes/changeGroupName.route");
const removeMember = require("./routes/removeMember.route");
const sendGroupMsg = require("./routes/sendGroupMsg.route");
const leaveGroup = require("./routes/leaveGroup.route");
const onGroupChat = require("./routes/onGroupChat.route");

const io = require("socket.io")(http, {
  reconnect: true,
});
var client;
const users = {};
const group = {};

io.on("connection", (socket) => {
  console.log("hello");

  socket.on("user_connected", async (data) => {
    const { username, currentPosition, id } = data;
    users[socket.id] = {
      id: socket.id,
      username,
      currentPosition,
      locationid: id,
    };
    const userInfo = await db("socketids").where("name", username);
    if (userInfo.length === 0) {
      await db("socketids").insert([{ name: username, id: socket.id }]);
    } else {
      await db("socketids").where({ name: username }).update("id", socket.id);
    }
  });
  // socket.on("private_chat",(data) => privateChat(data,db,io))
  socket.on("send-private", (data) =>
    sendPrivateMsg({ data, db, io, socket, users })
  );
  socket.on("create-group", (data) => createGroup({ data, db, io, socket }));
  socket.on("change-groupname", (data) => changeGroupName({ data, db, io }));
  socket.on("remove-member", (data) => removeMember({ data, db, io, socket }));
  socket.on("add-member", (data) => addMember({ data, db, io }));
  socket.on("send-group", (data) => sendGroupMsg({ data, db, io, users }));
  socket.on("leave-group", (data) => leaveGroup({ data, io, db }));
  socket.on("change-position", (data) => changePosition({ data, db, io }));
  socket.on("on-privatechat", (data) => onPrivateChat({ db, io, data }));
  socket.on("on-groupchat", (data) => onGroupChat({ db, io, data }));
  //socket.on("create-group",new Gr(db,io).create)
  socket.on("disconnect", function () {
    if (users[socket.id]) {
      console.log(`${users[socket.id].username} disconnected`);
    }
    // remove saved socket from users object
    delete users[socket.id];
  });
});

const port = process.env.PORT || 3003;

http.listen(port, () => console.log(`Server running on port ${port} 🔥`));
