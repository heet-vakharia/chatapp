import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useHistory, useParams } from "react-router-dom";
import { uid } from "uid";
import { Link } from "react-router-dom";
let socket;
const PrivateChat = ({ group }) => {
  const { friend, groupid, type, user, group_name } = useParams();
  const [msgs, setMsgs] = useState([
    {
      sender: "",
      reciever: "",
      text: "",
    },
  ]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [deleteMsg, setDeleteMsg] = useState(false);
  const history = useHistory();
  const [isUserAllow, setIsUserAllow] = useState(true);
  const [currentMsg, setCurrentMsg] = useState("");
  const getAllMessages = () => {
    if (type === "dm") {
      fetch("http://localhost:5005/allPrivateMessages", {
        method: "GET",
        params: {
          user,
          friend,
        },
      })
        .then((response) => response.json())
        .then(({ data }) => {
          console.log(data);
          setMsgs(data);
        });
    } else if (type === "group") {
      fetch("http://localhost:5005/allGroupMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupid: groupid,
          username: user,
        }),
      })
        .then((response) => response.json())
        .then(({ data }) => {
          setMsgs(data.chats);
          if (data.left_date) {
            setIsUserAllow(false);
          }
        })
        .catch((err) => {
          if (err.toString().includes(401)) {
            setIsUserAllow(false);
            history.push("/chatdir");
          }
        });
    }
  };
  useEffect(() => {
    console.log(groupid, type);
    socket = io("127.0.0.1:3003", { transports: ["websocket"] });
  }, []);
  useEffect(() => {
    console.log(123);
    if (type === "group") {
      socket.emit("user_connected", {
        username: user,
        currentPosition: "group",
        id: groupid,
      });
      socket.emit("on-groupchat", {
        groupid,
        username: user,
      });
    } else if (type === "dm") {
      socket.emit("on-privatechat", {
        user,
        friend,
      });
      socket.emit("user_connected", {
        username: user,
        currentPosition: "private",
        id: friend,
      });
    }
    if (user) {
      console.log(friend, user);
    }
    getAllMessages();
    //return socket.disconnect()
  }, []);

  useEffect(() => {
    console.log("hello");
    socket.on("new-message", (data) => {
      console.log(data);
      if (data.sender === friend || data.sender === user) {
        getAllMessages();
        currentMsg === " " ? setCurrentMsg("") : setCurrentMsg(" ");
      } else {
        alert(`${data.sender} has send you a msg`);
      }
    });
    socket.on("group-noti", (data) => {
      console.log(data);
      switch (data.type) {
        case "new message":
          if (groupid === data.content.groupid) {
            getAllMessages();
          } else {
            alert(`${data.content.sender} has send a msg`);
          }
          break;
        case "delete member":
          if (groupid === data.content.groupid) {
            getAllMessages();
          }
          break;
        default:
          break;
      }
    });

    //return socket.close
  }, []);
  const onMessageSelect = (chatid) => {
    let arr = selectedMessages;
    if (arr.indexOf(chatid) === -1) {
      arr.push(chatid);
    } else {
      arr.splice(arr.indexOf(chatid), 1);
    }
    setSelectedMessages(arr);
  };
  const onDeleteMessage = () => {
    if (selectedMessages.length > 0) {
      fetch("http://localhost:5005/delete/specific", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatids: selectedMessages,
          username: user,
          type: type === "group" ? "group" : "private",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          getAllMessages();
          console.log(data);
          setSelectedMessages([]);
          setDeleteMsg(false);
        });
    }
  };
  const onClickHandle = () => {
    if (currentMsg.length > 0) {
      if (type === "dm") {
        const data = {
          sender: user,
          receiver: friend,
          text: currentMsg,
        };
        socket.emit("send-private", data);
        const msgArr = msgs;
        msgArr.push({
          ...data,
          Id: uid(),
          time: Date(),
        });
        setMsgs(msgArr);
        setCurrentMsg("");
      } else {
        const data = {
          sender: user,
          groupid,
          text: currentMsg,
        };
        socket.emit("send-group", data);
        const msgArr = msgs;
        msgArr.push({
          ...data,
          Id: uid(),
          time: Date(),
        });
        setMsgs(msgArr);
        setCurrentMsg("");
      }
    }
  };
  const setMsg = ({ target }) => {
    if (currentMsg === " ") {
      setCurrentMsg("");
    } else {
      setCurrentMsg(target.value);
    }
    return () => setCurrentMsg(currentMsg);
  };
  const onkeyPress = (e) => {
    if (e.key === "Enter") {
      onClickHandle();
    }
  };

  return (
    <div className="">
      <p>Click The Message to copy</p>
      <button
        onClick={() => {
          setDeleteMsg(!deleteMsg);
          setSelectedMessages([]);
        }}
      >
        {!deleteMsg ? "delete message" : "cancel"}
      </button>
      {msgs.map((msg) => {
        if (msg.type === "message" || type === "dm") {
          return (
            <div className="" key={msg.Id}>
              {msg.sender}:
              <span
                onClick={async () => {
                  await navigator.clipboard.writeText(msg.text);
                  alert(`${msg.text} copied`);
                }}
              >
                {msg.text}
              </span>
              {deleteMsg ? (
                <label key={uid()}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    key={uid()}
                    onClick={() => onMessageSelect(msg.chatid)}
                  />
                </label>
              ) : null}
            </div>
          );
        } else if (msg.type === "announcement")
          return (
            <div className="" key={msg.Id}>
              {msg.text}
            </div>
          );
      })}
      {/* <form action=""> */}
      {deleteMsg ? <button onClick={onDeleteMessage}>Delete</button> : null}
      <input
        type="text"
        onChange={isUserAllow ? setMsg : () => {}}
        value={currentMsg}
        onKeyDown={onkeyPress}
        placeholder={isUserAllow ? "Enter Message" : "You R Not allowed"}
        disabled={isUserAllow ? false : true}
      />
      <button onClick={onClickHandle}>Submit</button>
      <Link to="/chatdir"> back </Link>
      {/* </form> */}
      <Link to={`/${groupid}/edit/${user}`}>Setting</Link>
    </div>
  );
};

export default PrivateChat;
