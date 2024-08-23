import React, { createContext, useContext, useEffect, useState } from 'react';
import { NewsContext, UpdateNewsContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
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
  // getting the API Key from the .env file
  const apiKey = process.env.REACT_APP_API_KEY;
  // API URL
  const apiUrl = `https://newsapi.org/v2/top-headlines?country=${countryCode}&category=${category}&apiKey=${apiKey}`;

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
      const data = await FetchData(apiUrl);
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
      const data = await FetchData(apiUrl);
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
          {loading ? (
            <Loader />
          ) : showNews && showNews.length > 0 ? (
            showNews.map((article, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 d-flex flex-column">
                  <div className="card-body flex-grow-1 d-flex flex-column">
                    <h5 className="card-title">{article.title || 'No Title'}</h5>
                    <p className="card-text">{article.description || 'No Description'}</p>
                    <p className="card-text mt-auto">{`Published On: ${FormatDate(article.publishedAt)}` || 'No Date Specified'}</p>
                    <a
                      href={article.url}
                      className="btn btn-primary mt-3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              <h4 className="text-center text-dark m-2">
                No Data Found For This Country. Please Try Again Later!!
              </h4>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default ShowHeadlines
