import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NewsContext, UpdateNewsContext } from './App';
import { Audio } from 'react-loader-spinner';
import Footer from './Footer';
const ShowSources = () => {
    const showNews = useContext(NewsContext);
    const setNews = useContext(UpdateNewsContext);
    const [loading, setLoading] = useState(false);

    // function to fetch the data from the news API
    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await fetch("https://newsapi.org/v2/top-headlines/sources?apiKey=f0ea0013bb014ec6b2cd5c42525f5c43");
            const result = await response.json();
            if (result.sources) {
                // returning the news array
                return result.sources;
            } else {
                console.log("Oops! Something went wrong, please try again after some time!!");
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
                    <form className="form-inline my-4" name='searchNews'>
                        <input
                            type="text"
                            name="searchQuery"
                            className="form-control mr-sm-2"
                            onChange={showNewsByTerm}
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
                <div className="row">
                    {loading ? (<Audio
                        height="100"
                        width="100"
                        color="#4fa94d"
                        ariaLabel="audio-loading"
                        wrapperStyle={{}}
                        wrapperClass="wrapper-class"
                        visible={true}
                    />) : showNews && showNews.length > 0 ? (showNews?.map((source, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{source.name}</h5>
                                <p className="card-text">{`Category: ${source.category}`}</p>

                                <p className="card-text">{source.description}</p>
                                <a href={source.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                    Read more
                                </a>
                            </div>
                        </div>
                    </div>
                    ))) : (<div><h4 className='text-center text-dark m-2'>No Data Found For This Country. Please Try Again Later!!</h4></div>)}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ShowSources
