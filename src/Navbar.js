import React from 'react'
import { Link, Routes, Route } from 'react-router-dom';
import ShowEverything from './ShowEverything';
import ShowHeadlines from './ShowHeadlines';
import PageNotFound from './PageNotFound';
import ShowSources from './ShowSources';

const Navbar = () => {

    return (
        <div>
            <nav id='nav' className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                <Link className="navbar-brand" to='/'>Awesome News</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <Link className="nav-link" to='/'>Home <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to='/topHeadlines/ca/general'>Top Headlines <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to='/sources'>Sources <span className="sr-only">(current)</span></Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <h1 className="display-4 text-center">Welcome To Awesome News</h1>
                {/* Routes for the navbar */}
                <Routes>
                    <Route path='/' element={<ShowEverything />}></Route>
                    <Route path='/topHeadlines/:countryCode/:category' element={<ShowHeadlines />}></Route>
                    <Route path='/sources' element={<ShowSources />}></Route>
                    <Route path='*' element={<PageNotFound />}></Route>
                </Routes>
        </div>

    )
}

export default Navbar
