import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import Users from "./Components/Users/Users";
import Books from "./Components/Books/Books";
import Chapters from "./Components/Chapters/Chapters";
import Notes from "./Components/Notes/Notes";
import Bookmark from "./Components/Bookmark/Bookmark";
import { useEffect } from "react";
import db, { auth } from "./Firebase/Firebase";
import { useStateValue } from "./Context/StateProvider";
import { actionTypes } from "./Context/Reducer";
import SingleNote from "./Components/Notes/SingleNote";
function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      dispatch({ type: actionTypes.SET_USER, user: user });
    });
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/">
          <Users />
        </Route>
        <Route exact path="/:username">
          <Books />
        </Route>
        <Route exact path="/:username/:bookname">
          <Chapters />
        </Route>
        <Route exact path="/:username/:bookname/:chaptername">
          <Notes />
        </Route>
        <Route exact path="/:username/:bookname/:chaptername/:notename">
          <SingleNote />
        </Route>

        <Route exact path="/main/user/collections/bookmark">
          <Bookmark />
        </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
