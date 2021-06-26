import React, { useEffect, useRef, useState } from "react";
import Linkify from "react-linkify";
import { Editor, EditorState } from "draft-js";
import db from "../../Firebase/Firebase";
import swal from "sweetalert";
import { useStateValue } from "../../Context/StateProvider";
import { Link } from "react-router-dom";

function Book({
  writername,
  userid,
  bookid,
  name,
  author,
  icon,
  isBook,
  isChapter,
  isNote,
  username,
  chapterid,
  noteid,
  showwritername,
  iconAuthor,
  color,
  noteWriter,
}) {
  const [{ user }, dispatch] = useStateValue();
  const [showAddNote, setShowAddNote] = useState(false);
  const [showEditNote, setShowEditNote] = useState(false);

  const [bookName, setBookName] = useState(name);
  const [writerName, setWriterName] = useState(author);
  const [note, setNote] = useState(name);

  useEffect(() => {
    console.log(username, bookid, chapterid, noteid);
  }, [username, bookid, chapterid, noteid]);

  return (
    <div
      style={{ gridTemplateColumns: `${!icon ? "1fr" : ""}` }}
      className="book note user"
    >
      <form
        style={{ display: `${showEditNote ? "" : "none"}` }}
        className={`${isNote ? "spcl" : ""} users-container-signin`}
      >
        {isNote ? (
          <textarea
            className="input textarea"
            value={note}
            required={true}
            type="text"
            onChange={(e) => setNote(e.target.value)}
          />
        ) : (
          <input
            className="input"
            value={bookName}
            required={true}
            type="email"
            onChange={(e) => setBookName(e.target.value)}
            placeholder={isChapter ? "Chapter Name?" : "Book Name?"}
          />
        )}

        {!isChapter && showwritername ? (
          <input
            className="input"
            value={writerName}
            required={true}
            type="text"
            onChange={(e) => setWriterName(e.target.value)}
            placeholder="Writer Name?"
          />
        ) : (
          ""
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            if (isBook) {
              db.collection("users")
                .doc(userid)
                .collection("books")
                .doc(bookid)
                .set({
                  bookname: bookName,
                  writername: writerName,
                })
                .then(() => {
                  setShowEditNote(false);
                  swal("Alhamdulillah", "Content Updated", "success");
                })
                .catch((err) => swal("OOPS!", err.message, "errors"));
            }
            if (isChapter && !isNote) {
              db.collection("users")
                .doc(username)
                .collection("books")
                .doc(bookid)
                .collection("chapters")
                .doc(chapterid)
                .update({ chaptername: bookName })
                .then(() => {
                  setShowEditNote(false);
                  swal("Alhamdulillah", "Content Updated", "success");
                })
                .catch((err) => swal("OOPS!", err.message, "errors"));
            }
            if (isNote) {
              db.collection("users")
                .doc(username)
                .collection("books")
                .doc(bookid)
                .collection("chapters")
                .doc(chapterid)
                .collection("notes")
                .doc(noteid)
                .update({ note: note })
                .then(() => {
                  setShowEditNote(false);
                  setBookName(note);
                  setNote(null);
                  swal("Alhamdulillah", "Content Updated", "success");
                })
                .catch((err) => swal("OOPS!", err.message, "error"));
            }
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

      {icon ? (
        <div className="book-icon user-icon">
          <i className={`fas ${icon}    `}></i>
        </div>
      ) : (
        ""
      )}

      <div className="user-info">
        {isNote ? (
          <div
            style={{ wordBreak: "break-word" }}
            className="user-info-username"
          >
            <div
              style={{
                width: "100%",
                wordBreak: "break-word",
                whiteSpace: "pre-line",
              }}
            >
              <Linkify>{bookName}</Linkify>
            </div>
          </div>
        ) : (
          <div className="user-info-username"> {name}</div>
        )}

        {author ? (
          <div
            style={{
              marginTop: isNote ? "1rem" : "",
              color: color ? color : "",
            }}
            className="user-info-total-books"
          >
            <i class={iconAuthor ? iconAuthor : "fas fa-pen    "}></i> {author}
          </div>
        ) : (
          ""
        )}
        {writername ? (
          <div
            style={{ color: color ? color : "" }}
            className="user-info-total-books"
          >
            <i class={"fas fa-pen    "}></i> {writername}
          </div>
        ) : (
          ""
        )}
        {noteWriter ? (
          <div
            style={{ color: color ? color : "" }}
            className="user-info-total-books"
          >
            <i class="fas fa-at    "></i> {noteWriter}
          </div>
        ) : (
          ""
        )}
        <div className="book-info-btn ">
          <Link
            to={
              chapterid
                ? `/${username}/${bookid}/${chapterid}`
                : `/${username}/${bookid}`
            }
            className="btn btn-visit"
          >
            <i class="fas fa-eye    "></i>
          </Link>
          <div onClick={() => setShowEditNote(true)} className="btn btn-edit">
            <i class="fas fa-edit    "></i>
          </div>
          <div
            onClick={() => {
              if (user && bookid && !chapterid) {
                db.collection("users")
                  .doc(userid)
                  .collection("books")
                  .doc(bookid)
                  .delete()
                  .then(swal("Alhamdulillah", "Content Deleted", "success"))
                  .catch((err) => swal("OOPS!", err.message, "error"));
              }
              if (user && chapterid && !noteid) {
                console.log("/" + username + "/" + bookid + "/" + chapterid);
                db.collection("users")
                  .doc(username)
                  .collection("books")
                  .doc(bookid)
                  .collection("chapters")
                  .doc(chapterid)
                  .delete()
                  .then(swal("Alhamdulillah", "Chapter Deleted", "success"))
                  .catch((err) => swal("OOPS!", err.message, "error"));
              }
              if (user && chapterid && noteid) {
                db.collection("users")
                  .doc(username)
                  .collection("books")
                  .doc(bookid)
                  .collection("chapters")
                  .doc(chapterid)
                  .collection("notes")
                  .doc(noteid)
                  .delete()
                  .then(swal("Alhamdulillah", "Chapter Deleted", "success"))
                  .catch((err) => swal("OOPS!", err.message, "error"));
              }
            }}
            className="btn btn-del"
          >
            <i class="fas fa-trash    "></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Book;
