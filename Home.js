import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import BookCard from '../components/BookCard';
import axios from 'axios';

const Home = () => {
    const [name, setName] = useState('')
    const [genre, setGenre] = useState('');
    const [books, setBooks] = useState([]);
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    const savePreference = async () => {
        await addDoc(collection(db, 'userPreferences"'), {
            name, 
            genre,
            timestamp: new Date()
        });
    };

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get('https://openlibrary.org/subjects/${genre}.json?limit=5');
            const recommendBooks = response.data.works.map(book => ({
                title: book.title,
                summary: "Description not available.",
                link: 'https://openlibrary.org${book.key}'
            }));

            setBooks(recommendedBooks);
            
            //save preference and search
            await savePreference();
            await addDoc(collection(db, "searches"), {
                genre,
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    return (
        <div style = {{ padding: "2rem" }}>
            <h1> AI- Powered Book Reccomender</h1>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={{marginRight:'10px'}}
            />
            <input 
                type="text"
                value={genre}
                onChange={ (e) => setGenre(e.target.value.toLowerCase())}
                placeholder="Enter your favorite genre (e.g., fantasy)"
            />
                <button onClick={fetchRecommendations}>Recommend Books</button>
                <div>
                    {books.map((book, idx) => <BookCard key={idx} book={book} />)}
                </div>
        </div>
    );
};

export default Home;