import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
let socket;
const GroupSetting = ({ user }) => {
  const { groupid } = useParams();
  const [groupInfo, setGroupInfo] = useState({
    groupid: groupid,
    group_name: "",
    members: [],
    admins: [],
  });
  const [changeGroupName, setChangeGroupName] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [currentSelect, setCurrentSelect] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [addingMember, setAddingMember] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const history = useHistory();
  useEffect(() => {
    socket = io("127.0.0.1:3003", { transports: ["websocket"] });
  }, []);
  useEffect(() => {
    fetch("http://localhost:5005/allUsers")
      .then((response) => response.json())
      .then(({ users }) => setAllUsers(users));
  }, []);
  const fetchMember = () => {
    fetch("http://localhost:5005/group/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupid,
        user,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGroupInfo(data);
        setNewGroupName(data.group_name);
        console.log(data);
      })
      .catch((err) => {
        console.log(err.toString());
        if (err.toString().includes("401")) {
          history.push("/");
        }
      });
  };
  useEffect(() => {
    console.log(user);
    socket.emit("user_connected", {
      username: user,
    });
  }, []);
  useEffect(() => {
    fetchMember();
    console.log(groupInfo);
    socket.on("group-noti", (data) => {
      console.log(data);
      switch (data.type) {
        case "new message":
          alert(
            `${data.content.sender}  has sent new message in ${data.content.group_name} `
          );
          break;
        case "deleted member":
          console.log(data.content);
          setGroupInfo(data.content.newGroupInfo);
          console.log(groupInfo);
          break;
        case "changed position":
          setGroupInfo({
            ...groupInfo,
            members: data.content.members,
            admins: data.content.admins,
            group_name: data.content.group_name,
          });
          break;
        case "name changed":
          setGroupInfo({ ...groupInfo, group_name: data.content.new_name });
          break;
        case "left_group":
          history.push("/");
          break;
        case "new member":
          setGroupInfo({
            ...groupInfo,
            members: data.content.group.members,
            admins: data.content.group.admins,
          });
          setSelectedFriends([]);
          setAddingMember(false);
          setCurrentSelect("");
          break;
        default:
          break;
      }
    });
  }, []);
  const removeMemeber = (member, position) => {
    if (member === user) return;
    if (position !== "admins") {
      console.log("hello");
      socket.emit("remove-member", {
        memberName: member,
        position,
        username: user,
        groupid,
      });
    } else if (position === "admins" && groupInfo.admins.length > 1) {
      socket.emit("remove-member", {
        memberName: member,
        position,
        username: user,
        groupid,
      });
    }
  };
  const changePosition = (member, newPosition) => {
    socket.emit("change-position", {
      username: member,
      newPosition,
      groupid,
      user,
    });
  };
  const onGroupChange = () => {
    socket.emit("change-groupname", {
      groupid,
      group_name: newGroupName,
      username: user,
    });
  };
  const onLeaveGroup = () => {
    socket.emit("leave-group", {
      groupid,
      user,
    });
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
  const onAdd = () => {
    socket.emit("add-member", {
      newMembers: selectedFriends,
      groupid,
      username: user,
      group_name: groupInfo.group_name,
    });
  };
  useEffect(() => {
    console.log(groupInfo, "idjsiuhawihsia");
  }, [groupInfo]);
  return (
    <div className="">
      <h1>{groupInfo.group_name}</h1>

      {groupInfo.admins.length > 0 ? (
        groupInfo.admins.indexOf(user) !== -1 ? (
          <button onClick={() => setChangeGroupName(!changeGroupName)}>
            ✎
          </button>
        ) : null
      ) : null}

      {changeGroupName ? (
        <div className="">
          <input
            type="text"
            value={newGroupName}
            onChange={({ target }) => setNewGroupName(target.value)}
          />
          <button onClick={onGroupChange}>Change</button>
        </div>
      ) : null}
      {groupInfo.admins.length > 0
        ? groupInfo.admins.map((admin) => (
            <div className="">
              <h3>{admin === user ? "You" : admin}✔️ </h3>
              {groupInfo.admins.indexOf(user) !== -1 && admin !== user ? (
                <button
                  onClick={() =>
                    currentSelect === admin
                      ? setCurrentSelect("")
                      : setCurrentSelect(admin)
                  }
                >
                  {currentSelect === admin ? "☝" : "👇"}
                </button>
              ) : null}
              {currentSelect === admin &&
              groupInfo.admins.indexOf(user) !== -1 ? (
                <div className="">
                  <button onClick={() => removeMemeber(admin, "admins")}>
                    remove {admin}
                  </button>
                  <button onClick={() => changePosition(admin, "member")}>
                    {" "}
                    Change position to Member
                  </button>
                </div>
              ) : null}
            </div>
          ))
        : null}
      {groupInfo.members.length > 0
        ? groupInfo.members.map((member) => (
            <div className="">
              <h3>{member === user ? "you" : member}</h3>
              {groupInfo.admins.indexOf(user) !== -1 && member !== user ? (
                <button
                  onClick={() =>
                    currentSelect === member
                      ? setCurrentSelect("")
                      : setCurrentSelect(member)
                  }
                >
                  {currentSelect === member ? "☝" : "👇"}
                </button>
              ) : null}
              {currentSelect === member &&
              groupInfo.admins.indexOf(user) !== -1 ? (
                <div className="">
                  <button onClick={() => removeMemeber(member, "member")}>
                    remove {member}
                  </button>
                  <button onClick={() => changePosition(member, "admin")}>
                    {" "}
                    Change position to Admin
                  </button>
                </div>
              ) : null}
            </div>
          ))
        : null}

      <button onClick={() => setAddingMember(!addingMember)}>Add Member</button>
      {addingMember ? (
        <>
          {
            <>
              {allUsers.map((friend) => {
                return groupInfo.members.length > 0 ? (
                  groupInfo.members.indexOf(friend.username) === -1 &&
                  groupInfo.admins.indexOf(friend.username) === -1 ? (
                    <label>
                      {friend.username}:
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        onClick={() => onFriendSelected(friend.username)}
                      />
                    </label>
                  ) : null
                ) : null;
              })}
              <button onClick={onAdd}>Add</button>
            </>
          }
        </>
      ) : null}
      <button onClick={onLeaveGroup}>Leave Group</button>
    </div>
  );
};

export default GroupSetting;
