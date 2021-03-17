import { useState } from "react";
import { useHistory } from "react-router-dom";
const SignUp = () => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({});
  const onSignUp = () => {
    fetch("http://localhost:5005/signup", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((user) => {
        history.push("/");
      });
  };
  return (
    <div className="">
      <label>
        <input
          type="text"
          placeholder={"email"}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, email: target.value })
          }
        />
      </label>
      <label>
        <input
          type="password"
          placeholder={"password"}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, password: target.value })
          }
        />
      </label>
      <label>
        <input
          type="text"
          placeholder={"username"}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, username: target.value })
          }
        />
      </label>
      <button onClick={onSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
