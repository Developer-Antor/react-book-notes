import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Search.css";

function Search({
  users,
  isBooks,
  isUsers,
  isChapters,
  isChange,
  noMargin,
  isNote,
  term,
}) {
  const [display, setDisplay] = useState(false);

  const [matches, setMatches] = useState([]);

  const { username, bookname, chaptername } = useParams();

  useEffect(() => {
    if (users !== null && users?.length > 0) {
      let matches = users?.filter((user) => {
        const regex = new RegExp(`${term}`, "gi");
        if (isUsers) {
          return (
            user?.fullname.match(regex) ||
            user?.username.match(regex) ||
            user?.favbook.match(regex)
          );
        }

        if (isBooks) {
          return user?.bookname.match(regex) || user?.writername.match(regex);
        }
        if (isChapters) {
          return user?.chaptername.match(regex);
        }
        if (isNote) {
          return user?.note.match(regex);
        }
      });
      setMatches(matches);
    }
  }, [term]);

  return (
    <div
      style={{
        display: isChange && term !== "" ? "" : "none",
      }}
      className="search"
    >
      <ul
        style={{
          marginTop: `${noMargin ? "0" : "70px"}`,
        }}
      >
        {isUsers
          ? matches?.map((match) => (
              <li>
                <Link to={`/${match?.username}`}>
                  <div className="search-name"> {match.fullname}</div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: "normal",
                      whiteSpace: "pre-line",
                    }}
                    className="search-username"
                  >
                    {" "}
                    <i class="fas fa-user-tie    "></i> {match.username}
                  </div>
                  <div
                    style={{
                      whiteSpace: "pre-line",
                      fontSize: "1rem",
                      fontWeight: "normal",
                    }}
                    className="search-username"
                  >
                    {" "}
                    <i class="fas fa-book-open    "></i> {match.favbook}
                  </div>
                </Link>
              </li>
            ))
          : ""}
        {isBooks
          ? matches?.map((match) => (
              <li>
                <Link to={`/${match?.username}`}>
                  <div className="search-name"> {match?.bookname}</div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: "normal",
                      whiteSpace: "pre-line",
                    }}
                    className="search-username"
                  >
                    {" "}
                    <i class="fas fa-pencil-alt    "></i> {match?.writername}
                  </div>
                </Link>
              </li>
            ))
          : ""}
        {isChapters
          ? matches?.map((match) => (
              <li key={`/${match?.username}/${match?.bookname}/${match?.id}`}>
                <Link
                  to={`/${match?.username}/${match?.bookname}/${match?.id}`}
                >
                  <div className="search-name">
                    {" "}
                    <i class="fas fa-book-reader    "></i> {match?.chaptername}
                  </div>
                </Link>
              </li>
            ))
          : ""}
        {isNote
          ? matches?.map((match) => (
              <li key={match?.id}>
                <Link
                  to={`/${username}/${bookname}/${chaptername}/${match.id}`}
                >
                  <div
                    style={{
                      border: "1px solid #fff",
                      backgroundColor: "#f4f4f4",
                      color: "#050505",
                      fontWeight: "normal",
                      padding: "1rem",
                      borderRadius: "3px",
                      width: "300px",
                      whiteSpace: "pre-line",
                      wordBreak: "break-word",
                    }}
                    className="search-name"
                  >
                    <i class="fas fas-book-reader    "></i> {match?.note}
                  </div>
                </Link>
              </li>
            ))
          : ""}
      </ul>
    </div>
  );
}

export default Search;
