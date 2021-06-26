import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStateValue } from "../../Context/StateProvider";
import db from "../../Firebase/Firebase";
import Book from "../Books/Book";
import Search from "../Search/Search";
import firebase from "firebase";
import swal from "sweetalert";

function Chapters() {
  const [width, setWidth] = useState(window.innerWidth);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [justifyContentHandler, setJustifyContentHandler] = useState(false);

  const [chapterName, setChapterName] = useState("");

  const [showAddNote, setShowAddNote] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isChange, setIsChange] = useState(false);

  const { username, bookname } = useParams();
  const [id, setId] = useState(username);

  const [bookName, setBookName] = useState("");
  const [chapters, setChapters] = useState([]);

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

    if (username && bookname) {
      db.collection("users")
        .doc(username)
        .collection("books")
        .doc(bookname)
        .collection("chapters")
        .orderBy("timestamp", "desc")
        .onSnapshot((snap) => {
          setChapters(
            snap.docs.map((doc) => ({
              id: doc.id,
              chaptername: doc.data().chaptername,
            }))
          );
        });
    }
  }, []);

  return (
    <div className="books">
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
                  placeholder="Search a chapter"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={() => setIsChange(true)}
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
                setIsChange(false);
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
                  Add Chapter
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
      <Search
        users={chapters}
        isChapters={true}
        isChange={isChange}
        term={searchTerm}
        bookname={bookname}
      />

      <div className="books-container">
        <form
          style={{ display: `${showAddNote ? "" : "none"}` }}
          className=" users-container-signin"
        >
          <input
            className="input"
            value={chapterName}
            required={true}
            type="text"
            onChange={(e) => setChapterName(e.target.value)}
            placeholder="Chapter Name?"
          />

          <button
            onClick={(e) => {
              e.preventDefault();

              db.collection("users")
                .doc(id)
                .collection("books")
                .doc(bookname)
                .collection("chapters")
                .add({
                  chaptername: chapterName,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                  swal("Alhamdulillah", `${chapterName} Added`, "success");
                  setShowAddNote(false);
                })
                .catch((err) => swal("OOPS!", err.message, "error"));
            }}
            className="btn"
            type="submit"
          >
            Add Chapter
          </button>
        </form>

        {/*  */}
        {/*  */}
        <div className="books-books-container">
          {chapters?.map((chapter) => (
            <Book
              key={chapter.id}
              chapterid={chapter.id}
              name={chapter?.chaptername}
              icon="fa-book-reader"
              username={username}
              bookid={bookname}
              author={bookName}
              iconAuthor={"fas fa-book"}
              writername={writerName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chapters;
