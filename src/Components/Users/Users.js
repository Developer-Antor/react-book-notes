import React, { useState, useEffect } from "react";
import "./Users.css";
import Search from "../Search/Search";
import { useStateValue } from "../../Context/StateProvider";
import db, { auth } from "../../Firebase/Firebase";
import swal from "sweetalert";
import { Link } from "react-router-dom";

function User() {
  const [{ user }, dispatch] = useStateValue();

  const [width, setWidth] = useState(window.innerWidth);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [justifyContentHandler, setJustifyContentHandler] = useState(false);

  const [isExist, setIsExist] = useState(false);

  const style = {
    show: { opacity: "1", pointerEvents: "visible" },
    hide: { opacity: "0", pointerEvents: "none" },
  };

  const [emailSignin, setEmailSignin] = useState("");
  const [passSignin, setPassSignin] = useState("");

  const [emailSignup, setEmailSignup] = useState("");
  const [passSignup, setPassSignup] = useState("");
  const [username, setUsername] = useState("");
  const [favBook, setFavBook] = useState("");
  const [fullName, setFullName] = useState("");

  const [showSignin, setShowSignin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [isChange, setisChange] = useState(false);

  const [isUsernameM, setIsUsernameM] = useState(false);

  const [users, setUsers] = useState([]);

  const [editPersonalNoteID, setEditPersonalNoteID] = useState("");

  const [usersLoading, setUsersLoading] = useState(true);
  const [unamep, setUnamep] = useState("");

  useEffect(() => {
    if (users.length > 0) {
      setUsersLoading(false);
    }
  }, [users]);

  useEffect(() => {
    if (user) {
      setEditPersonalNoteID(user?.displayName);

      // db.collection('users').doc()
      // db.collection("users")
      //   .doc(user.uid)
      //   .onSnapshot((doc) => setEditPersonalNoteID(doc.data()?.username));
    }
  }, [user]);

  useEffect(() => {
    let regex = new RegExp(
      "^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$",
      "g"
    );
    let exist = regex.test(username);

    setIsExist(exist);
  }, [username]);

  useEffect(() => {
    const unsub = db
      .collection("users")
      .orderBy("fullname")
      .onSnapshot((snapshot) => {
        setUsers(
          snapshot.docs.map((user) => ({
            username: user.data()?.username,
            favbook: user.data().favbook,
            fullname: user.data().fullname,
            totalbooks: user.data().totalbooks,
            uid: user.data().uid,
          }))
        );
      });

    return () => {
      unsub();
    };
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();

    if (isExist && !isUsernameM) {
      auth
        .createUserWithEmailAndPassword(emailSignup, passSignup)
        .then((result) => {
          auth.currentUser.updateProfile({
            displayName: username,
          });

          setShowSignup(false);
          db.collection("users")
            .doc(username)
            .set({
              favbook: favBook,
              username: username,
              fullname: fullName,
              email: result.user.email,
              uid: result.user.uid,
              totalbooks: 0,
            })
            .then(() => {
              swal("Alhamdulillah", "Signed Up", "success");
              setEmailSignup("");
              setPassSignup("");
              setFavBook("");
              setUsername("");
              setFullName("");
            })
            .catch((err) => {
              swal("OOPS!", err.message, "error");
            });
        })
        .catch((err) => {
          swal("OOPS!", err.message, "error");
        });
    }
  };

  useEffect(() => {
    db.collection("users")
      .get()
      .then((snapshot) => {
        const match = snapshot.docs.filter((doc) => {
          return doc.id === username;
        });

        if (match.length > 0) {
          setIsUsernameM(true);
        } else {
          setIsUsernameM(false);
        }
      });

    let regex = /^(?=[a-zA-Z0-9._]{8,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    let isExist = regex.test(username);
    setIsExist(isExist);
  }, [username]);

  useEffect(() => {
    console.log(isExist);
  }, [isExist]);

  return (
    <div
      style={{ gridTemplateRows: `${user ? "70px auto" : "70px 50px auto"}` }}
      className="users"
    >
      {/* <div className="sidebar">
        <ul>
          <li>Antor</li>
          <li>Antor</li>
          <li>Antor</li>
        </ul>
      </div> */}

      <div className="users-header">
        <div
          style={{
            position: `${showSearchBar ? "absolute" : ""}`,
            justifyContent: `${justifyContentHandler ? "center" : ""}`,
          }}
          className="users-header-search"
        >
          {width > 500 || showSearchBar ? (
            <>
              <input
                style={{
                  borderRadius: `${showSearchBar ? "3px" : "3px 0 0 3px"}`,
                }}
                onChange={(e) => setSearchTerm(e.target.value.trim())}
                placeholder="Really! Wanna Search"
                onClick={() => setisChange(true)}
              />
              <div
                style={{
                  display: `${showSearchBar ? "none" : ""}`,
                  backgroundColor: "var(--color-dark-3)",
                }}
                className="users-header-search-icon alt"
              >
                <i class="fas fa-search    "></i>
              </div>
            </>
          ) : (
            <div
              onClick={() => {
                setShowSearchBar(true);
                setJustifyContentHandler(true);
              }}
              className="users-header-search-icon"
            >
              <i class="fas fa-search    "></i>
            </div>
          )}

          <div
            style={{ display: `${showSearchBar ? "" : "none"}` }}
            onClick={() => {
              setShowSearchBar(false);
              setJustifyContentHandler(false);
              setisChange(false);
            }}
            className="users-header-search-cancel"
          >
            <i class="fas fa-times    "></i>
          </div>
        </div>
        <Search
          isUsers={true}
          users={users}
          isChange={isChange}
          term={searchTerm}
        />
        <div
          style={{ display: `${showSearchBar ? "none" : ""}` }}
          className="users-header-auth"
        >
          {!user ? (
            <>
              {showSignin ? (
                <div
                  onClick={() => {
                    setShowSignup(false);
                    setShowSignin(false);
                  }}
                  className="btn users-header-auth-login"
                >
                  Cancel
                </div>
              ) : (
                <div
                  onClick={() => {
                    setShowSignup(false);
                    setShowSignin(true);
                  }}
                  className="btn users-header-auth-login"
                >
                  Sign In
                </div>
              )}

              {showSignup ? (
                <div
                  onClick={() => {
                    setShowSignup(false);
                    setShowSignin(false);
                  }}
                  className="btn users-header-auth-login"
                >
                  Cancel
                </div>
              ) : (
                <div
                  onClick={() => {
                    setShowSignin(false);
                    setShowSignup(true);
                  }}
                  className="btn users-header-auth-signup"
                >
                  Sign Up
                </div>
              )}
            </>
          ) : (
            <>
              <div onClick={() => {}} className=" users-header-edit-container">
                <Link
                  to={`${editPersonalNoteID ? editPersonalNoteID : "/"}`}
                  className="btn users-header-edit"
                >
                  {" "}
                  Your Notes
                </Link>
              </div>
              <div onClick={() => {}} className="user-bars">
                <div className="btn btn-bars ">
                  <i class="fas fa-bookmark    "></i>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        style={{ display: `${user ? "none" : ""}` }}
        className="users-container-note"
      >
        <div>
          Wanna Create Notes?
          <u style={{ cursor: "pointer" }} onClick={() => setShowSignin(true)}>
            {" "}
            Signin Now!
          </u>
        </div>
        <div>
          Not Have An Account?
          <u style={{ cursor: "pointer" }} onClick={() => setShowSignup(true)}>
            {" "}
            Create Now!
          </u>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: `${
            showSignin === false && showSignup === false ? "none" : "flex"
          }`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          style={{ display: `${showSignup ? "" : "none"}` }}
          className="users-container-signup"
        >
          {" "}
          <input
            className="input"
            value={fullName}
            required={true}
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name?"
          />
          <input
            className="input"
            value={unamep}
            required={true}
            type="text"
            onChange={(e) => setUnamep(e.target.value)}
            onBlur={(e) => setUsername(unamep)}
            placeholder="Username? (Atleast 8 Characters) "
          />
          <input
            className="input"
            value={favBook}
            required={true}
            type="text"
            onChange={(e) => setFavBook(e.target.value)}
            placeholder="Favourite Book?"
          />
          <input
            className="input"
            value={emailSignup}
            required={true}
            type="email"
            onChange={(e) => setEmailSignup(e.target.value)}
            placeholder="Email?"
          />
          <input
            className="input"
            value={passSignup}
            required={true}
            type="password"
            onChange={(e) => setPassSignup(e.target.value)}
            placeholder="Password?"
          />
          <button
            onClick={(e) => handleSignup(e)}
            className="btn"
            type="submit"
          >
            SIGN UP
          </button>
          <button
            style={{
              display: `${username ? "" : "none"}`,
              textTransform: "capitalize",
              pointerEvents: "none",
            }}
            disabled={true}
            className={`btn btn-err ${
              isExist && !isUsernameM ? "btn-visit" : "btn-del"
            } `}
          >
            {!isUsernameM && isExist ? (
              <> Username Available</>
            ) : (
              <>Username Not Available!</>
            )}
          </button>
        </form>
        <form
          style={{ display: `${showSignin ? "" : "none"}` }}
          className="users-container-signin"
        >
          <input
            className="input"
            value={emailSignin}
            required={true}
            type="email"
            onChange={(e) => setEmailSignin(e.target.value)}
            placeholder="Email?"
          />
          <input
            className="input"
            value={passSignin}
            required={true}
            type="password"
            onChange={(e) => setPassSignin(e.target.value)}
            placeholder="Password?"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              auth
                .signInWithEmailAndPassword(emailSignin, passSignin)
                .then(() => {
                  setShowSignin(false);
                  setEmailSignin("");
                  setPassSignin("");
                })
                .catch((err) => {
                  swal("OOPS!", err.message, "error");
                });
            }}
            className="btn"
            type="submit"
          >
            SIGN IN
          </button>
        </form>
      </div>
      <div style={{ position: "relative" }} className="users-container">
        {usersLoading ? (
          <>
            <div className="loading">
              <div class="lds-ripple">
                <div></div>
                <div></div>
              </div>
            </div>
          </>
        ) : (
          <>
            {" "}
            {users?.map((user) => {
              return (
                <div
                  key={user.uid}
                  style={{ backgroundColor: "var(--color-dark-1)" }}
                  className="user"
                >
                  <div className="user-icon">
                    <i class="fas fa-user-alt    "></i>
                  </div>
                  <div className="user-info">
                    <div className="user-info-username">{user.fullname}</div>
                    <div className="user-info-username-main">
                      {" "}
                      <i class="fas fa-user-tie    "></i> {user.username}
                    </div>
                    <div className="user-info-fav-book">
                      {" "}
                      <i class="fas fa-book-open    "></i> Fav.Book:{" "}
                      {user.favbook}
                    </div>
                    <div className="user-info-total-books">
                      <i class="fas fa-pencil-alt    "></i> Total Books:{" "}
                      {user.totalbooks}
                    </div>

                    <Link
                      to={`/${user.username}`}
                      className="user-info-btn btn"
                    >
                      <span>Visit Books</span>
                      <i class="fas fa-arrow-right    "></i>{" "}
                    </Link>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <div
        onClick={() => auth.signOut()}
        style={{ display: `${user ? "" : "none"}` }}
        className="logout btn"
      >
        Log Out
      </div>
    </div>
  );
}

export default User;
