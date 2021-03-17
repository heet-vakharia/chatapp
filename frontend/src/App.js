import { Route, Switch } from "react-router-dom";
import PrivateChat from "./Components/Chat.component";
import ChatDir from "./Components/ChatDir.pages";
import Signup from "./Components/SignUp.component";
import Login from "./Components/Login.component";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" render={() => <ChatDir />} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
