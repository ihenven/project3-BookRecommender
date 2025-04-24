import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import BookCard from '../components/BookCard';
import axios from 'axios';
import { getBookSummary } from '../services/openai';

const Home = () => {
    const [name, setName] = useState('')
    const [genre, setGenre] = useState('');
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const savePreference = async () => {
        await addDoc(collection(db, 'userPreferences'), {
            name, 
            genre,
            timestamp: new Date()
        });
    };

    const fetchRecommendations = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`https://openlibrary.org/subjects/${genre}.json?limit=5`);
            const rawBooks = response.data.works;

            const recommendBooks = await Promise.all(
                rawBooks.map(async (book) => {
                    const summary = awari getBookSummary(book.title);
                    return{
                        title: book.title,
                        summary,
                        link: `https://openlibrary.org${book.key}`,
                    };
                })
            );
        

            setRecommendedBooks(recommendBooks);
            console.log(recommendBooks);
            
            //save preference and search
            await savePreference();
            await addDoc(collection(db, "searches"), {
                genre,
                timestamp: new Date()
            });
            setRecommendedBooks(recommendBooks);
        }
        catch (error) {
            console.error("Error fetching recommendations:", error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style = {{ padding: "2rem" }}>
            <h1>AI-Powered Book Reccomender</h1>
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
                {loading && <p>Loading recommendations...</p>}
                <div>
                    {books.map((book, idx) => <BookCard key={idx} book={book} />)}
                </div>
        </div>
    );
};

export default Home;
