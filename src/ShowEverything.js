import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NewsContext, UpdateNewsContext } from './App';
const ShowEverything = () => {
    const showNews = useContext(NewsContext);
    const setNews = useContext(UpdateNewsContext);

    // function to fetch the data from the news API
    const fetchNews = async () => {
        try {
            const response = await fetch("https://newsapi.org/v2/everything?q=keyword&apiKey=f0ea0013bb014ec6b2cd5c42525f5c43");
            const result = await response.json();
            if (result.articles) {
                // returning the news array
                return result.articles;
            } else {
                toast("Oops! Something went wrong, please try again after some time!!");
            }
        } catch (e) {
            console.error(e);
        }
    }

    // loading the news data when the page is loaded
    useEffect(() => {
        const showData = async () => {
            const allNews = await fetchNews();
            setNews(allNews);
        }

        showData();
    }, []);

    // filtering the data based on the user input
    const showNewsByTerm = async (evt) => {
        evt.preventDefault();
        const allNews = await fetchNews();
        const form = document.forms.searchNews;
        const searchTerm = form.searchQuery.value.toLowerCase();
        const filteredNews = await allNews?.filter(news => {
            if (searchTerm === "") {
                return allNews;
            } else {
                const matchedNews = news.title.toLowerCase();
                return matchedNews.includes(searchTerm);
            }
        });

        setNews(filteredNews);
    }

    // date function to show the readable date string
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="App">
            <div className="container">
                <header className="my-4">
                    <h1 className="display-4">News App</h1>
                    <form className="form-inline my-4" name='searchNews'>
                        <input
                            type="text"
                            name="searchQuery"
                            className="form-control mr-sm-2"
                            onChange={showNewsByTerm}
                            placeholder="Search news"
                            aria-label="Search"
                            autoFocus
                        />
                        <button type="submit" onClick={showNewsByTerm} className="btn btn-outline-success my-2 my-sm-0">
                            Search
                        </button>
                    </form>
                </header>
                <div className="row">
                    {showNews?.map((article, index) => (
                        <div className="col-md-4 mb-4" key={index}>
                            <div className="card">
                                <img src={article.urlToImage} className="card-img-top" alt={article.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{article.title}</h5>
                                    <p className="card-text">{article.description}</p>
                                    <p className="card-text">{`Published On: ${formatDate(article.publishedAt)}`}</p>
                                    <a href={article.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                        Read more
                                    </a>
                                </div>
                            </div>
                        </div>
                    )) ?? <h4>Something Went Wrong</h4>}
                </div>
            </div>
        </div>
    );
}

export default ShowEverything
