import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate} from 'react-router-dom';

const App = () => {
  const [series, setSeries] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteSeries, setFavoriteSeries] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const navigate = useNavigate();


  const seriesIds = useMemo(() => [
    'tt4574334', 
    'tt5753856',
    'tt0903747',
    'tt0898266',
    'tt7335184',
    'tt7366338',
    'tt2442560',
    'tt2306299',
    'tt11311302',
    'tt4158110',
    'tt13207736',
    'tt0944947'
  ], []);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_API_KEY;
    if (!apiKey) {
      console.error('API Key is missing. Please check your .env file.');
      return;
    }

    const fetchSeries = async () => {
      const seriesData = await Promise.all(
        seriesIds.map(async (imdbId) => {
          const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}`;
          const response = await axios.get(url);
          return response.data;
        })
      );
      setSeries(seriesData);
    };

    fetchSeries();
  }, [seriesIds]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavorites(storedFavorites);
  }, [setFavorites]);

  useEffect(() => {
    const fetchFavoriteSeries = async () => {
      const apiKey = process.env.REACT_APP_API_KEY;
      const favoriteSeriesData = await Promise.all(
        favorites.map(async (imdbId) => {
          const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}`;
          const response = await axios.get(url);
          console.log(JSON.stringify(response))

          return response.data;
        })
      );
      setFavoriteSeries(favoriteSeriesData);
    };

    if (favorites.length > 0) {
      fetchFavoriteSeries();
    }
  }, [favorites, setFavoriteSeries]);
  const buscarSerie = async () => {
    if (searchTitle.trim() !== "") {
      const apiKey = process.env.REACT_APP_API_KEY;
      const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchTitle)}`;
      try {
        const response = await axios.get(url);
        if (response.data.Response === "True") {
          setSearchResults(response.data.Search);
          navigate('/search-results', { state: { searchResults: response.data.Search, searchTitle, buscarSerie } });
        } else {
          setSearchResults([]);
          navigate('/search-results', { state: { searchResults: [], searchTitle, buscarSerie } });
        }
      } catch (error) {
        console.error("Error fetching series:", error);
        setSearchResults([]);
        navigate('/search-results', { state: { searchResults: [] } });
      }
    }
  };
  const redireccionarADetalles = (serieId) => {
    navigate(`/details/${serieId}`); // Use navigate to programmatically navigate
  };


  return (
    <div>
      <div className='fav'>

      <h1>Favorites:</h1>

      <div id="favoritos-container">
        {favoriteSeries.length > 0 ? (
          favoriteSeries.map((serie) => (
            <div className="favorito" key={serie.imdbID}>
              <Link to={`/details/${serie.imdbID}`} style={{ textDecoration: 'none', color: 'white' }}>
                <h3>{serie.Title}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p>No tienes series favoritas.</p>
        )}
      </div>
      </div>
      <div>
        <div className="container">
        <input
          type="text"
          value={searchTitle}
          id= "inputTitulo"
          onChange={(e) => setSearchTitle(e.target.value)}
          placeholder="Search serie"
        />
          <button className="boton" id="btnBuscar" onClick={buscarSerie}>Search</button>
        </div>
      </div>

      <h2 className="subtitulo">Popular series</h2>

      <div className="row" id="series">
        {series.map((serie) => (
          <div className="col-md-4" key={serie.imdbID}>
            <div className="text-center">
              <img src={serie.Poster} className="poster" alt={serie.Title} />
              <h5>{serie.Title}</h5>
              <h5>imdb Rating: {serie.imdbRating}</h5>
              <button
                className="btn-detalles btn-primary"
                onClick={() => redireccionarADetalles(serie.imdbID)}
              >
                Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
      <div id="resultados-series">
        {searchResults.map((serie) => (
          <div className="col-md-4" key={serie.imdbID}>
            <div className="text-center">
              <img src={serie.Poster} className="poster" alt={serie.Title} />
              <h5>{serie.Title}</h5>
              <Link to={`/details/${serie.imdbID}`} className="btn-detalles btn-primary">
                Detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;