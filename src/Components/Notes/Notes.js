import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import db from "../../Firebase/Firebase";
import Book from "../Books/Book";
import "./Notes.css";
import firebase from "firebase";

import swal from "sweetalert";
import Search from "../Search/Search";
import { useStateValue } from "../../Context/StateProvider";

function Notes() {
  const [width, setWidth] = useState(window.innerWidth);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [justifyContentHandler, setJustifyContentHandler] = useState(false);
  const [{ user }, dispatch] = useStateValue();
  const [chapterName, setChapterName] = useState("");

  const [showAddNote, setShowAddNote] = useState(false);

  const { username, bookname, chaptername } = useParams();

  const [notes, setNotes] = useState([]);

  const [term, setTerm] = useState("");

  const [isChange, setIsChange] = useState(false);
  const [bookName, setBookName] = useState("");

  const [writerName, setWriterName] = useState("");
  useEffect(() => {
    db.collection("users")
      .doc(username)
      .collection("books")
      .doc(bookname)
      .onSnapshot((doc) => {
        setBookName(doc.data().bookname);
        setWriterName(doc.data().writername);
      });

    const unsubscribe = db
      .collection("users")
      .doc(username)
      .collection("books")
      .doc(bookname)
      .collection("chapters")
      .doc(chaptername)
      .collection("notes")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        setNotes(
          snap.docs.map((doc) => ({
            id: doc.id,
            note: doc.data().note,
          }))
        );
      });
    return () => unsubscribe();
  }, []);

  return (
    <div className=" notes books">
      <Search
        users={notes}
        isChange={isChange}
        term={term}
        bookname={bookname}
        isNote={true}
      />
      <div className="books-header">
        <div className="books-header ">
          <div
            style={{
              position: `${showSearchBar ? "absolute" : ""}`,
              justifyContent: `${justifyContentHandler ? "center" : ""}`,
            }}
            className="users-header-search books-header-search"
          >
            {width > 500 || showSearchBar ? (
              <>
                <input
                  style={{
                    borderRadius: `${showSearchBar ? "3px" : "3px 0 0 3px"}`,
                  }}
                  onChange={(e) => setTerm(e.target.value)}
                  onClick={() => setIsChange(true)}
                  placeholder="Search a note"
                />

                <div
                  style={{
                    display: `${showSearchBar ? "none" : ""}`,
                    backgroundColor: "var(--color-dark-3)",
                  }}
                  className="users-header-search-icon books-header-search-icon alt"
                >
                  <i class="fas fa-search    "></i>
                </div>
              </>
            ) : (
              <>
                <Link to="/">
                  <div onClick={() => {}} className="users-header-search-icon">
                    <i class="fas fa-home    "></i>
                  </div>
                </Link>
                <div
                  onClick={() => {
                    setShowSearchBar(true);
                    setJustifyContentHandler(true);
                  }}
                  className="users-header-search-icon"
                >
                  <i class="fas fa-search    "></i>
                </div>
              </>
            )}
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
                <div
                  onClick={() => {
                    setShowAddNote(!showAddNote);
                  }}
                  className="btn users-header-auth-login books-header-add-book"
                >
                  Add Note
                </div>
              </>
            ) : (
              <div
                onClick={() => {
                  setShowAddNote(false);
                }}
                className=" users-header-edit-container"
              >
                <div className="btn users-header-edit">Cancel</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="notes-parent-container books-container">
        <form
          style={{ display: `${showAddNote ? "" : "none"}` }}
          className=" users-container-signin"
        >
          <textarea
            className="input textarea"
            value={chapterName}
            required={true}
            type="text"
            onChange={(e) => setChapterName(e.target.value)}
            style={{ minHeight: "300px" }}
            placeholder="Write Your Note..."
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              if (chapterName.length > 0) {
                db.collection("users")
                  .doc(username)
                  .collection("books")
                  .doc(bookname)
                  .collection("chapters")
                  .doc(chaptername)
                  .collection("notes")
                  .add({
                    note: chapterName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  })
                  .then(() => {
                    setShowAddNote(!showAddNote);
                    swal("Alhamdulillah", "Note Added", "success");
                  })
                  .catch((err) => swal("OOPS!", err.message, "error"));
              }
            }}
            className="btn"
            type="submit"
          >
            Add Note
          </button>
        </form>

        {/*  */}
        {/*  */}
        <div className="notes-container">
          {notes?.map((note) => (
            <Book
              key={note.id}
              isNote={true}
              name={note?.note}
              noteid={note.id}
              username={username}
              bookid={bookname}
              chapterid={chaptername}
              showwritername={false}
              bookname={bookName}
              author={bookName}
              writername={writerName}
              color={"#050505"}
              iconAuthor={"fas fa-book"}
              noteWriter={user?.displayName}
            />
          ))}
        </div>

        <></>
      </div>
    </div>
  );
}

export default Notes;
