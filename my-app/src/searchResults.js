import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { searchResults, searchTitle, buscarSerie } = location.state || { searchResults: [], searchTitle: '', buscarSerie: () => {} };

  return (
    <div>
      <div className='container'>
        <input
          type="text"
          value={searchTitle}
          id="inputTitulo"
          onChange={(e) => buscarSerie(e.target.value)}
          placeholder="Search serie"
        />
        <button className="boton" id="btnBuscar" onClick={buscarSerie}>Search</button>
      </div>
      <div className="row" id="resultados-series">
        {searchResults.length > 0 ? (
          searchResults.map((serie) => (
            <div className="col-md-4" key={serie.imdbID}>
              <div className="text-center">
                <img src={serie.Poster} className="poster" alt={serie.Title} />
                <h5>{serie.Title}</h5>
                <Link to={`/details/${serie.imdbID}`} className="btn-detalles btn-primary">
                  Detalles
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;