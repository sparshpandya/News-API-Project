import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NewsContext, UpdateNewsContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
import Footer from './Footer';
import Loader from './Loader';
import FetchData from './FetchData';
import FetchCountries from './FetchCountries';
import FormatDate from './FormatDate';
const ShowHeadlines = () => {
  const showNews = useContext(NewsContext);
  const setNews = useContext(UpdateNewsContext);
  const navigate = useNavigate();
  const { countryCode, category } = useParams();
  const [loading, setLoading] = useState(false);
  const [countries, updateCountries] = useState([]);
  const [message, showMessage] = useState({ searchQuery: '', country: 'Canada', category: 'General' });

  const showMsgForSelect = async (evt) => {
    const { name } = evt.target;
    const value = evt.target.options[evt.target.selectedIndex].text
    showMessage(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const showMsgForTerm = async (evt) => {
    const { value } = evt.target;
    showMessage(prevState => ({
      ...prevState,
      searchQuery: value
    }))
  }

  // rendering the loader when true
  useEffect(() => {
    // if true, disabling the loader after 1 second
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [loading]);

  // loading the news data when the page is loaded
  useEffect(() => {
    const showData = async () => {
      setLoading(true);
      const countryNames = await FetchCountries();
      updateCountries(countryNames);
      const data = await FetchData(`https://newsapi.org/v2/top-headlines?country=${countryCode}&category=${category}&apiKey=f0ea0013bb014ec6b2cd5c42525f5c43`);
      if (data) {
        const allNews = data.articles;
        setNews(allNews);
      }
    }

    showData();
  }, []);

  // loading the news based on countries selected
  useEffect(() => {
    const showData = async () => {
      setLoading(true);
      const data = await FetchData(`https://newsapi.org/v2/top-headlines?country=${countryCode}&category=${category}&apiKey=f0ea0013bb014ec6b2cd5c42525f5c43`);
      if (data) {
        const allNews = data.articles;
        setNews(allNews);
      }
    }
    showData();
  }, [countryCode, category]);

  const showHeadlinesByCountry = (code) => {
    navigate(`/topHeadlines/${code}/${category}`);
  }

  const showHeadlinesByCategory = (categoryName) => {
    navigate(`/topHeadlines/${countryCode}/${categoryName}`);
  }

  // filtering the data based on the user input
  const showNewsByTerm = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    const data = await FetchData(`https://newsapi.org/v2/top-headlines?country=${countryCode}&category=${category}&apiKey=f0ea0013bb014ec6b2cd5c42525f5c43`);
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

  return (
    <div className="App">
      <div className="container">
        <header className="my-4">
          <h2>Explore Top Headlines</h2>
          <form className="form-inline my-4" name='searchNews'>
            <select className='form-control' onChange={(evt) => { evt.preventDefault(); showHeadlinesByCountry(evt.target.value); showMsgForSelect(evt) }} value={countryCode} name='country' id='country'>
              {countries.map((country, index) => {
                const { common } = country.name;
                const code = country.altSpellings[0].toLowerCase();
                return (
                  <option key={index} value={code}>{common}</option>
                )
              })}
            </select>
            <select className='form-control' onChange={(evt) => { evt.preventDefault(); showHeadlinesByCategory(evt.target.value); showMsgForSelect(evt) }} value={category} name='category' id='category'>

              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
              <option value="general">General</option>
              <option value="health">Health</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
            </select>
            <input
              type="text"
              name="searchQuery"
              className="form-control mr-sm-2"
              onChange={(evt) => { showNewsByTerm(evt); showMsgForTerm(evt) }}
              placeholder="Search news"
              aria-label="Search"
              autoComplete='off'
              autoFocus
            />
            <button type="submit" name='searchQuery' onClick={showNewsByTerm} className="btn btn-outline-success my-2 my-sm-0">
              Search
            </button>
          </form>
        </header>
        <h4>{
          message.searchQuery ?
            (`Showing Results For ${message.searchQuery} In ${message.country} For ${message.category} Category`)
            : (`Showing Results For ${message.country} For ${message.category} Category`)}</h4>
        <div className="row">
          {loading ? (<Loader />) : showNews && showNews.length > 0 ? (
            showNews?.map((article, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{article.title}</h5>
                    <p className="card-text">{article.description}</p>
                    <p className="card-text">{`Published On: ${FormatDate(article.publishedAt)}`}</p>
                    <a href={article.url} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
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

export default ShowHeadlines
