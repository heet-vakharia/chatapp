import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import io from "socket.io-client";
import { uid } from "uid";
import { NavBarPrimary } from "../Components/Styles";
let socket;
const ChatDir = ({ user }) => {
  const [groupName, setGroupName] = useState("");
  const [isCreate, setIsCreate] = useState(false);
  const [chats, setChat] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [deleteChat, setDeleteChat] = useState(false);
  const [friends, setFriends] = useState([]);
  const history = useHistory();
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [dmSearch, setDmSearch] = useState({
    search: "",
    suggestions: [],
  });
  useEffect(() => {
    socket = io("127.0.0.1:3003", { transports: ["websocket"] });
  }, []);

  const fetchChats = () => {
    if (user.username) {
      console.log(user);
      fetch(`http://localhost:5005/chatList?username=${user.username}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((user) => {
          setChat(user);
        });
    }
  };
  useEffect(() => {
    console.log(user, "uashi");
    fetch("http://localhost:5005/allUsers")
      .then((response) => response.json())
      .then(({ users }) => {
        setFriends(users);
        setDmSearch({ ...dmSearch, suggestions: users });
      });
    socket.emit("user_connected", {
      username: user.username,
      currentPosition: "chatdir",
      id: null,
    });

    fetchChats();
  }, []);
  useEffect(() => {
    socket.on("group-noti", (data) => {
      switch (data.type) {
        case "new group":
          console.log(data);
          history.push(`/group/${data.content.groupid}`);
          break;
        default:
          break;
      }

      console.log(data);
    });
    //return socket.close
  }, []);
  const onMessageSelect = (chat) => {
    let arr = selectedChats;
    if (arr.indexOf(chat) === -1) {
      arr.push({
        username: user.name,
        friend: chat.receiverName,
        last_updated: chat.last_updated,
        type: chat.type,
        groupid: chat.groupid,
      });
    } else {
      arr.splice(arr.indexOf(chat), 1);
    }
    setSelectedChats(arr);
    console.log(arr);
  };
  const onDeleteMessage = (chat) => {
    if (selectedChats.length > 0) {
      fetch("http://localhost:5005/delete/whole", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatrooms: selectedChats,
          username: user.username,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          fetchChats();
          console.log(data);
          setSelectedChats([]);
          setDeleteChat(false);
        });
    }
  };
  const createGroup = () => {
    if (isCreate && groupName && selectedFriends.length > 0) {
      const data = {
        members: selectedFriends,
        username: user.username,
        group_name: groupName,
      };
      socket.emit("create-group", data);
      setSelectedFriends([]);
      setIsCreate(false);
      setGroupName("");
    } else {
      alert("Sumaar");
    }
  };
  const onFriendSelected = (friend) => {
    let arr = selectedFriends;
    if (arr.indexOf(friend) === -1) {
      arr.push(friend);
    } else {
      arr.splice(arr.indexOf(friend), 1);
    }
    setSelectedFriends(arr);
  };
  return (
    <div className="">
      <NavBarPrimary>
        <div className="nav-items__right">
          {isCreate ? <button onClick={createGroup}>Submit</button> : null}
          {deleteChat ? (
            <button onClick={onDeleteMessage}>Delete</button>
          ) : null}
        </div>
        <div className="nav-items__left">
          <button onClick={() => setIsCreate(!isCreate)}>
            {!isCreate ? (
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="30px"
                height="30px"
                viewBox="0 0 612 612"
                style={{ enableBackground: "new 0 0 612 612" }}
                xmlSpace="preserve"
              >
                <g>
                  <g id="group-add">
                    <path
                      d="M204,267.75h-76.5v-76.5h-51v76.5H0v51h76.5v76.5h51v-76.5H204V267.75z M459,293.25c43.35,0,76.5-33.15,76.5-76.5
			s-33.15-76.5-76.5-76.5c-7.65,0-15.3,2.55-22.95,2.55c15.3,22.95,22.95,45.9,22.95,73.95s-7.65,51-22.95,73.95
			C443.7,290.7,451.35,293.25,459,293.25z M331.5,293.25c43.35,0,76.5-33.15,76.5-76.5s-33.15-76.5-76.5-76.5
			c-43.35,0-76.5,33.15-76.5,76.5S288.15,293.25,331.5,293.25z M499.8,349.35c20.4,17.851,35.7,43.351,35.7,71.4v51H612v-51
			C612,382.5,550.8,357,499.8,349.35z M331.5,344.25c-51,0-153,25.5-153,76.5v51h306v-51C484.5,369.75,382.5,344.25,331.5,344.25z"
                    />
                  </g>
                </g>
              </svg>
            ) : (
              "Cancel"
            )}
          </button>
          <button
            onClick={() => {
              setDeleteChat(!deleteChat);
              setSelectedChats([]);
            }}
          >
            {!deleteChat ? "delete Chat" : "cancel"}
          </button>
        </div>
      </NavBarPrimary>

      <div className="private_chat">
        <input
          type="text"
          value={dmSearch.search}
          onChange={({ target }) =>
            setDmSearch({ ...dmSearch, search: target.value })
          }
        />
        <div className="suggestion">
          {dmSearch.suggestions.map((suggestion) =>
            suggestion.username.toLowerCase().includes(dmSearch.search) &&
            suggestion.username !== user.username ? (
              <div className="" key={uid()}>
                <Link to={`/dm/${suggestion.username}`}>
                  {" "}
                  {suggestion.username}
                </Link>
              </div>
            ) : null
          )}
          <p>
            ----------------------------------------------------------------
          </p>
        </div>
      </div>
      <ul>
        {chats.map((chat) => {
          return (
            <li key={uid()}>
              <Link
                to={
                  chat.type === "private"
                    ? `/dm/${chat.receiverName}}`
                    : `/group/${chat.groupid}`
                }
                key={uid()}
              >
                {chat.receiverName}
              </Link>
              {deleteChat ? (
                <label key={uid()}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    key={uid()}
                    onClick={() => onMessageSelect(chat)}
                  />
                </label>
              ) : null}
            </li>
          );
        })}
      </ul>

      {isCreate ? (
        <div className="">
          <input
            type="text"
            name="createGroup"
            id=""
            list="friends"
            placeholder="groupname"
            onChange={({ target }) => setGroupName(target.value)}
            value={groupName}
          />
          <input
            type="text"
            value={friendSearch}
            onChange={({ target }) => setFriendSearch(target.value)}
          />
          {friends
            ? friends
                .filter(
                  (friend, i) =>
                    // Give suggestion on basis username search and does not show user itself
                    friend.username.toLowerCase().includes(friendSearch) &&
                    friend.username !== user.username
                )
                .map((friend) => (
                  <label>
                    {friend.username}
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      onClick={() => onFriendSelected(friend.username)}
                    />
                  </label>
                ))
            : null}
        </div>
      ) : null}
    </div>
  );
};

export default ChatDir;
