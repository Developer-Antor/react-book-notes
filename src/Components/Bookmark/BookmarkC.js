import React from "react";
import Linkify from "react-linkify";

function BookmarkC() {
  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="bookmark">
        <div title="Book" className="bookmark-book">
          <span>
            <i class="fas fa-book-open    "></i> Chintaoporadh
          </span>
        </div>
        <div title="Writer" className="bookmark-writer">
          <span>
            <i class="fas fa-pencil-alt    "></i> Asif Adnan
          </span>
        </div>
        <div title="Author" className="bookmark-author">
          <span>
            <i class="fas fa-at    "></i> Md Abrar Zahin
          </span>
        </div>
        <div title="Note" className="bookmark-note">
          <Linkify>
            {`https://github.com/remarkjs/react-markdown

              রাজধানীর কদমতলীতে মা,বাবা ও বোনকে হত্যার অভিযোগে পরিবারটির আরেক মেয়ে মেহজাবিন ইসলাম ও
              তাঁর স্বামী শফিকুল'`}
          </Linkify>
        </div>
        <div className="bookmark-btn-cntnr">
          <div className="btn-del btn btn-round">
            <i class="fas fa-trash    "></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookmarkC;
