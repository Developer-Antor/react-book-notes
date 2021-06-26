import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Book from "./Book";
import "./Books.css";
import Search from "../Search/Search";
import db from "../../Firebase/Firebase";
import swal from "sweetalert";
import { useStateValue } from "../../Context/StateProvider";
import { actionTypes } from "../../Context/Reducer";
function Books() {
  const [{ user }, dispatch] = useStateValue();
  const [width, setWidth] = useState(window.innerWidth);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [justifyContentHandler, setJustifyContentHandler] = useState(false);

  const [bookName, setBookName] = useState("");
  const [writerName, setWriterName] = useState("");

  const [showAddNote, setShowAddNote] = useState(false);

  const [searchTerm, setSearchTerm] = useState([]);

  const [isChange, setIsChange] = useState(false);

  const { username } = useParams();

  const [id, setId] = useState(username);

  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (id) {
      db.collection("users")
        .doc(id)
        .collection("books")
        .onSnapshot((snap) => {
          setBooks(
            snap.docs.map((doc) => ({
              bookname: doc.data().bookname,
              writername: doc.data().writername,
              id: doc.id,
            }))
          );
        });
    }
  }, [id]);

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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search a book"
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
                  style={{ display: `${user ? "" : "none"}` }}
                  className="btn users-header-auth-login books-header-add-book"
                >
                  Add Book
                </div>
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
      <div className="books-container">
        <form
          style={{ display: `${showAddNote ? "" : "none"}` }}
          className=" users-container-signin"
        >
          <input
            className="input"
            value={bookName}
            required={true}
            type="text"
            onChange={(e) => setBookName(e.target.value)}
            placeholder="Book Name?"
          />
          <input
            className="input"
            value={writerName}
            required={true}
            type="text"
            onChange={(e) => setWriterName(e.target.value)}
            placeholder="Writer Name?"
          />
          <button
            onClick={(e) => {
              e.preventDefault();

              if (id) {
                db.collection("users")
                  .doc(id)
                  .collection("books")
                  .add({
                    username: username,
                    bookname: bookName,
                    writername: writerName,
                  })
                  .then(() => {
                    swal("Alhamdulillah", "Book Added", "success");
                    setShowAddNote(false);
                  })
                  .catch((err) => swal("OOPS!", err.message, "error"));
              }
            }}
            className="btn"
            type="submit"
          >
            ADD BOOK
          </button>
        </form>
        {/*  */}
        {/*  */}{" "}
        <Search
          users={books.length > 0 ? books : []}
          isChange={isChange}
          noMargin={true}
          term={searchTerm}
          isBooks={true}
        />
        <div className="books-books-container">
          {books.map((book) => {
            return (
              <Book
                key={book?.id}
                name={book?.bookname}
                author={book?.writername}
                icon={"fa-book"}
                isBook={true}
                bookid={book?.id}
                userid={id}
                username={username}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Books;
