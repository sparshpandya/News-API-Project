import React from 'react'
import { Link, Routes, Route } from 'react-router-dom';
import ShowEverything from './ShowEverything';
import ShowHeadlines from './ShowHeadlines';
import PageNotFound from './PageNotFound';

const Navbar = () => {

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to='/'>Navbar</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <Link className="nav-link" to='/'>Home <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to='/topHeadlines'>Top Headlines <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to='/sources'>Sources <span className="sr-only">(current)</span></Link>
                        </li>
                    </ul>
                </div>
            </nav>
                {/* Routes for the navbar */}
                <Routes>
                    <Route path='/' element={<ShowEverything />}></Route>
                    <Route path='/topHeadlines' element={<ShowHeadlines />}></Route>
                    {/* <Route path='/sources' element={<ShowEverything />}></Route> */}
                    <Route path='*' element={<PageNotFound />}></Route>
                </Routes>
        </div>

    )
}

export default Navbar
