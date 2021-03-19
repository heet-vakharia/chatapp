import { Route, Switch, useHistory } from "react-router-dom";
import Chat from "./Components/Chat.component";
import { useState, useEffect } from "react";
import ChatDir from "./Pages/ChatDir.pages";
import Signup from "./Components/SignUp.component";
import Login from "./Components/Login.component";

function App() {
  const [user, setUser] = useState({});
  const history = useHistory();
  useEffect(() => {
    console.log(history);
    if (
      !user.username &&
      history.location.pathname !== "/login" &&
      history.location.pathname !== "/signup"
    ) {
      history.push("/signup");
    }
  });
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" render={() => <ChatDir user={user} />} />
        <Route path="/signup" render={() => <Signup setUser={setUser} />} />
        <Route path="/login" render={() => <Login setUser={setUser} />} />
        <Route
          path="/:type/@:groupid"
          render={() => <Chat user={user.username} />}
        />
        <Route
          path="/:type/@:friend"
          render={() => <Chat user={user.username} />}
        />
      </Switch>
    </div>
  );
}

export default App;
