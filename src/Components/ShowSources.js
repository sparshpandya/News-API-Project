import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from './Loader';
import FetchCountries from './FetchCountries';
import FetchData from './FetchData';
const ShowSources = () => {
    const [showSources, setSources] = useState([]);
    const { countryCode } = useParams();
    const navigate = useNavigate();
    const [countries, updateCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, showMessage] = useState({ searchQuery: '', country: 'Canada' });
    // getting the API Key from the .env file
    const apiKey = process.env.REACT_APP_API_KEY;
    // API URL
    const apiUrl = `https://newsapi.org/v2/top-headlines/sources?country=${countryCode}&apiKey=${apiKey}`;

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

    // loading the source data when the page is loaded
    useEffect(() => {
        const showData = async () => {
            setLoading(true);
            const countryNames = await FetchCountries();
            updateCountries(countryNames);
            const data = await FetchData(apiUrl);
            if (data) {
                const allSources = data.sources;
                setSources(allSources);
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

    // loading the sources based on countries selected
    useEffect(() => {
        const showData = async () => {
            setLoading(true);
            const data = await FetchData(apiUrl);
            if (data) {
                const allSources = data.sources;
                setSources(allSources);
            }
        }
        showData();
    }, [countryCode]);

    // filtering the data based on the user input
    const showSourcesByTerm = async (evt) => {
        evt.preventDefault();
        setLoading(true);
        const data = await FetchData(apiUrl);
        if (data) {
            const allSources = data.sources;

            const searchTerm = evt.target.value.toLowerCase();
            const filteredSources = await allSources?.filter(source => {
                if (searchTerm === "") {
                    return allSources;
                } else {
                    const matchedSources = source.name.toLowerCase();
                    return matchedSources.includes(searchTerm);
                }
            });
            setSources(filteredSources);
        }

    }

    const showSourcesByCountry = (countryName) => {
        navigate(`/sources/${countryName}`);
    }

    return (
        <div className="App">
            <div className="container">
                <header className="my-4">
                    <h2>Explore Our Sources</h2>
                    <form className="form-inline my-4" name='searchSources'>
                        <select className='form-control' onChange={(evt) => { evt.preventDefault(); showSourcesByCountry(evt.target.value); showMsgForSelect(evt) }} value={countryCode} name='country' id='country'>
                            {countries.map((country, index) => {
                                const { common } = country.name;
                                const code = country.altSpellings[0].toLowerCase();
                                return (
                                    <option key={index} value={code}>{common}</option>
                                )
                            })}
                        </select>
                        <input
                            type="text"
                            name="searchQuery"
                            className="form-control mr-sm-2"
                            onChange={(evt) => { showSourcesByTerm(evt); showMsgForTerm(evt); }}
                            autoComplete='off'
                            placeholder="Search sources"
                            aria-label="Search"
                            autoFocus
                        />
                        <button type="submit" onClick={showSourcesByTerm} className="btn btn-outline-success my-2 my-sm-0">
                            Search
                        </button>
                    </form>
                </header>
                <h4>{
                    message.searchQuery ?
                        (`Showing Results For ${message.searchQuery} In ${message.country}`)
                        : (`Showing Results For ${message.country}`)}</h4>

                <div className="row">
                    {loading ? (
                        <Loader />
                    ) : showSources && showSources.length > 0 ? (
                        showSources.map((source, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card h-100 d-flex flex-column">
                                    <div className="card-body flex-grow-1 d-flex flex-column">
                                        <h5 className="card-title">{source.name || 'No Name'}</h5>
                                        <p className="card-text">{`Category: ${source.category}` || 'No Category'}</p>
                                        <p className="card-text">{source.description || 'No Description'}</p>
                                        <a
                                            href={source.url}
                                            className="btn btn-primary mt-auto"
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

export default ShowSources
