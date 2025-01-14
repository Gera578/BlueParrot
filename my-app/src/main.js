import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './app.js';
import Details from './details.js';
import SearchResults from './searchResults.js';

const Main = () => (
  <Router>
    <Routes>
    <Route path="/" element={<App />} />
    <Route path="/details/:id" element={<Details />} />
    <Route path="/search-results" element={<SearchResults />} />
    </Routes>
  </Router>
);

export default Main;