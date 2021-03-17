import { useState } from "react";
const SignUp = () => {
  const [userInfo, setUserInfo] = useState({});
  const onSignUp = () => {};
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
