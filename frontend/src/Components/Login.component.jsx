import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  BTNPrimary,
  Container,
  LinkPrimary,
  InputPrimary,
  FormHeading,
} from "./Styles";
const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const history = useHistory();
  const onLogin = () => {
    // Checking if user is typed username and password before clicking btn
    console.log(credentials);
    if (!credentials.password || !credentials.username) {
      return;
    }
    fetch("http://localhost:5005/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(({ user }) => {
        console.log(user);
        // setting the main user
        setUser(user);
        //   pushing route to "/"
        history.push("/");
      });
  };
  return (
    <Container className="">
      <FormHeading>Login</FormHeading>
      <label>
        <InputPrimary
          type="text"
          onChange={({ target }) =>
            setCredentials({ ...credentials, username: target.value })
          }
          placeholder="Username"
        />
      </label>
      <label>
        <InputPrimary
          type="password"
          onChange={({ target }) =>
            setCredentials({ ...credentials, password: target.value })
          }
          placeholder="Password"
        />
      </label>
      <BTNPrimary onClick={onLogin}>Login</BTNPrimary>
      <LinkPrimary to={"/signup"}>
        Signup
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          width="20px"
          height="20px"
        >
          <defs>
            <clipPath>
              <path fill="#00f" fillOpacity=".514" d="m-7 1024.36h34v34h-34z" />
            </clipPath>
            <clipPath>
              <path
                fill="#aade87"
                fillOpacity=".472"
                d="m-6 1028.36h32v32h-32z"
              />
            </clipPath>
          </defs>
          <path
            d="m345.44 248.29l-194.29 194.28c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744l171.91-171.91-171.91-171.9c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.29 194.28c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373"
            transform="matrix(.03541-.00013.00013.03541 2.98 3.02)"
            fill="#4d4d4d"
          />
        </svg>
      </LinkPrimary>
    </Container>
  );
};

export default Login;
