import { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const history = useHistory();
  const onLogin = () => {
    fetch("http://localhost:5005/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((user) => {
        console.log(user);
        //   pushing route to "/"
        history.push("/");
      });
  };
  return (
    <div className="">
      <label>
        <input
          type="text"
          onChange={({ target }) =>
            setCredentials({ ...credentials, username: target.value })
          }
          placeholder="Username"
        />
      </label>
      <label>
        <input
          type="password"
          onChange={({ target }) =>
            setCredentials({ ...credentials, password: target.value })
          }
          placeholder="Password"
        />
      </label>
      <button onClick={onLogin}>login</button>
    </div>
  );
};

export default Login;
