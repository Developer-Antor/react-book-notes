import React from "react";
import "./Bookmark.css";
import BookmarkC from "./BookmarkC";
import { Link } from "react-router-dom";

function Bookmark() {
  return (
    <div className="bookmarks books">
      <div className="bookmarks-header">
        <div className="btn btn-spcl">
          <span>
            <i class="fas fa-bookmark    "></i> Your Bookmarks
          </span>
        </div>
        <Link to="/">
          {" "}
          <div className="btn btn-round btn-visit">
            <i class="fas fa-home    "></i>
          </div>
        </Link>
      </div>
      <div className="bookmarks-container">
        <BookmarkC />
        <BookmarkC />
        <BookmarkC />
      </div>
    </div>
  );
}

export default Bookmark;
