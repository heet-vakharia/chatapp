const privateChat = async ({data,io,db ,socket}) => {
    const {user,friend } = data;
    io.to(socket.id).emit("allPrivateMessages" ,messages);
}
module.exports = privateChat;