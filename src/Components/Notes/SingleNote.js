import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStateValue } from "../../Context/StateProvider";
import Books from "../Books/Books";
import Linkify from "react-linkify";
import db from "../../Firebase/Firebase";
import swal from "sweetalert";
function SingleNote() {
  const [{ user }, dispatch] = useStateValue();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [justifyContentHandler, setJustifyContentHandler] = useState(false);

  const [showAddNote, setShowAddNote] = useState(false);

  const { username, bookname, chaptername, notename } = useParams();

  const [showEditNote, setShowEditNote] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const unsub = db
      .collection("users")
      .doc(username)
      .collection("books")
      .doc(bookname)
      .collection("chapters")
      .doc(chaptername)
      .collection("notes")
      .doc(notename)
      .onSnapshot((doc) => setNote(doc.data().note));

    return unsub();
  }, []);

  return (
    <div className="books single-note">
      <div className="books-header">
        <div className="books-header ">
          <div
            style={{
              position: `${showSearchBar ? "absolute" : ""}`,
              justifyContent: `${justifyContentHandler ? "center" : ""}`,
            }}
            className="users-header-search books-header-search"
          >
            <>
              <Link to="/">
                <div onClick={() => {}} className="users-header-search-icon">
                  <i class="fas fa-home    "></i>
                </div>
              </Link>
            </>

            <div
              style={{ display: `${showSearchBar ? "" : "none"}` }}
              onClick={() => {
                setShowSearchBar(false);
                setJustifyContentHandler(false);
              }}
              className="users-header-search-cancel"
            >
              <i class="fas fa-times    "></i>
            </div>
          </div>

          <div
            style={{ display: `${showSearchBar ? "none" : ""}` }}
            className="users-header-auth books-header-add"
          >
            {!showAddNote === true ? (
              <>
                <Link
                  to="/"
                  onClick={() => {
                    setShowAddNote(!showAddNote);
                  }}
                  style={{ display: `${!user ? "" : "none"}` }}
                  className="btn users-header-auth-login books-header-add-book"
                >
                  Login
                </Link>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div
        style={{ position: "relative" }}
        className="single-notes books-container"
      >
        <form
          style={{
            display: `${showEditNote ? "" : "none"}`,
            position: "absolute",
            left: "0",
            right: "0",
            top: "1rem",
            bottom: "3rem",
            margin: "auto",
            boxShadow: "-3px 4px 35px 8px var(--color-dark-1)   ",
          }}
          className={`${true ? "spcl" : ""} users-container-signin`}
        >
          <textarea
            className="input textarea"
            value={note}
            required={true}
            type="text"
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              db.collection("users")
                .doc(username)
                .collection("books")
                .doc(bookname)
                .collection("chapters")
                .doc(chaptername)
                .collection("notes")
                .doc(notename)
                .update({ note: note })
                .then(() => {
                  setShowEditNote(false);

                  swal("Alhamdulillah", "Updated", "success");
                })
                .catch((err) => swal("OOPS!", err.message, "error"));
            }}
            className="btn "
            type="submit"
          >
            SAVE
          </button>
          <button
            className="btn btn-del"
            onClick={(e) => {
              e.preventDefault();
              setShowEditNote(false);
            }}
          >
            Cancel
          </button>
        </form>

        <div className="single-note-s">
          <Linkify>{note}</Linkify>
          <div style={{ display: "flex", marginTop: "1rem" }}>
            <div
              onClick={() => setShowEditNote(true)}
              className="btn btn-edit btn-round"
            >
              <i class="fas fa-edit    "></i>
            </div>
            <div className="btn btn-del btn-round">
              <i class="fas fa-trash    "></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleNote;
