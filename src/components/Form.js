import React from "react";
import "./Form.css";

const Form = (props) => {
  const handleFromSubmit = (event) => {
    event.preventDefault();
    props.onFromSubmit({
      id: Math.random(),
      title: event.target.title.value,
      openingText: event.target.openingText.value,
      releaseDate: event.target.releaseDate.value,
    });
  };
  return (
    <section>
      <form onSubmit={handleFromSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="opening-text">Opening Text</label>
        <input type="text" id="opening-text" name="openingText" />
        <label htmlFor="release-date">Release Date</label>
        <input type="date" id="release-date" name="releaseDate" />
        <button type="submit">Add Movies</button>
      </form>
    </section>
  );
};

export default Form;
