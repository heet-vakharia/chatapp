import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Container,
  InputPrimary,
  FormHeading,
  BTNPrimary,
  LinkPrimary,
} from "./Styles";
const SignUp = ({ setUser }) => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({});
  const onSignUp = () => {
    if (!userInfo.username || !userInfo.password || !userInfo.email) {
      return;
    }
    fetch("http://localhost:5005/signup", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(({ user }) => {
        history.push("/");
        setUser(user);
      });
  };
  return (
    <Container className="">
      <FormHeading>Sign Up</FormHeading>
      <label>
        <InputPrimary
          type="text"
          placeholder="Email"
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, email: target.value })
          }
        />
      </label>
      <label>
        <InputPrimary
          type="password"
          placeholder="Password"
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, password: target.value })
          }
        />
      </label>
      <label>
        <InputPrimary
          type="text"
          placeholder="Username"
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, username: target.value })
          }
        />
      </label>
      <BTNPrimary onClick={onSignUp}>Sign Up</BTNPrimary>
      <LinkPrimary to={"/login"}>
        Login
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

export default SignUp;
