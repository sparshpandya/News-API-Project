import React, { createContext, useContext, useEffect, useState } from 'react';
import { NewsContext, UpdateNewsContext } from '../App';
import Footer from './Footer';
import Loader from './Loader';
import FetchData from './FetchData';
import FormatDate from './FormatDate';
const ShowEverything = () => {
    const showNews = useContext(NewsContext);
    const setNews = useContext(UpdateNewsContext);
    const [loading, setLoading] = useState(false);
    const [message, showMessage] = useState('');
    // getting the API Key from the .env file
    const apiKey = process.env.REACT_APP_API_KEY;
    // API URL
    const apiUrl = `https://newsapi.org/v2/everything?q=keyword&apiKey=${apiKey}`;
    const fallBackImg = 'https://via.placeholder.com/300x200/000000/FFFFFF?text=No+Image+Available';


    // loading the news data when the page is loaded
    useEffect(() => {
        const showData = async () => {
            setLoading(true);
            const data = await FetchData(apiUrl);
            if (data) {
                const allNews = data.articles;
                setNews(allNews);
            }
        }

        showData();
    }, []);

    // rendering the loader when true
    useEffect(() => {
        // if true, disabling the loader after 1 second
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [loading]);

    // filtering the data based on the user input
    const showNewsByTerm = async (evt) => {
        evt.preventDefault();
        setLoading(true);
        const data = await FetchData(apiUrl);
        if (data) {
            const allNews = data.articles;
            const searchTerm = evt.target.value.toLowerCase();
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
    }

    // showing user friendly message
    const showMsgForTerm = async (evt) => {
        const { value } = evt.target;
        showMessage(value);
    }

    return (
        <div className="App">
            <div className="container">
                <header className="my-4">
                    <h2>Explore News From All Over The World</h2>
                    <form className="form-inline my-4" name='searchNews'>
                        <input
                            type="text"
                            name="searchQuery"
                            className="form-control mr-sm-2"
                            onChange={(evt) => { showNewsByTerm(evt); showMsgForTerm(evt); }}
                            autoComplete='off'
                            placeholder="Search news"
                            aria-label="Search"
                            autoFocus
                        />
                        <button type="submit" onClick={showNewsByTerm} className="btn btn-outline-success my-2 my-sm-0">
                            Search
                        </button>
                    </form>
                </header>
                <h4>{
                    message ?
                        (`Showing Results For ${message}`)
                        : ''}</h4>
                <div className="row">
                    {loading ? (
                        <Loader />
                    ) : showNews && showNews.length > 0 ? (
                        showNews?.map((article, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card h-100 d-flex flex-column">
                                    <img src={article.urlToImage || fallBackImg}
                                    className="card-img-top" alt={article.title || 'No Title'} style={{ height: '200px', objectFit: 'cover' }} />
                                    <div className="card-body flex-grow-1 d-flex flex-column">
                                        <h5 className="card-title">{article.title}</h5>
                                        <p className="card-text">{article.description || 'No Description'}</p>
                                        <p className="card-text mt-auto">{`Published On: ${FormatDate(article.publishedAt)}` || 'No Date Specified'}</p>
                                        <a href={article.url} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">
                                            Read more
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <h4 className="text-center text-dark m-2">No Data Found. Please Try Again Later!!</h4>
                        </div>
                    )}
                </div>

            </div>
            <Footer />
        </div>
    );
}

export default ShowEverything
