import React from 'react';

const BookCard = ({ book }) => (
    <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem"}}>
        <h3>{book.title}</h3>
        <p>{book.summary}</p>
        <a href={book.link} target="_blank" rel="noopener noreferrer">Check it out</a>
    </div>
);

export default BookCard;