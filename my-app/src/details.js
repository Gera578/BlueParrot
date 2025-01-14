import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Details = () => {
  const { id } = useParams(); // Get the series ID from the URL
  const [serie, setSerie] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [visibleSeasons, setVisibleSeasons] = useState({});

  const [favorites, setFavorites] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY;
  useEffect(() => {
    const fetchSerieDetails = async () => {
      const serieUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`;
      try {
        const response = await axios.get(serieUrl);
        if (response.data.Response === "True") {
          setSerie(response.data);
          fetchSeasonsDetails(id);
        } else {
          console.error("Error fetching series details:", response.data.Error);
        }
      } catch (error) {
        console.error("Error fetching series details:", error);
      }
    };

    const fetchSeasonsDetails = async (serieId) => {
      const temporadaUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${serieId}&Season=1`;
      try {
        const response = await axios.get(temporadaUrl);

        if (response.data.Response === "True" && response.data.totalSeasons) {
          const totalSeasons = parseInt(response.data.totalSeasons);
          const temporadas = [];

          for (let i = 1; i <= totalSeasons; i++) {
            const temporada = await fetchSeasonDescription(serieId, i);
            if (temporada) {
              temporadas.push({
                season: i,
                Plot: temporada.Plot,
                Episodes: temporada.Episodes
              });
            }
          }
          setSeasons(temporadas);
        } else {
          console.error("Error fetching seasons details:", response.data.Error);
        }
      } catch (error) {
        console.error("Error fetching seasons details:", error);
      }
    };

    const fetchSeasonDescription = async (serieId, seasonNumber) => {
      const temporadaUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${serieId}&Season=${seasonNumber}`;
      try {
        const response = await axios.get(temporadaUrl);
        if (response.data.Response === "True") {
          const episodes = await Promise.all(
            response.data.Episodes.map(async (episode) => {
              const episodeUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${episode.imdbID}`;
              const episodeResponse = await axios.get(episodeUrl);
              return episodeResponse.data;
            })
          );
          return { ...response.data, Episodes: episodes };
        } else {
          console.error("Error fetching season description:", response.data.Error);
          return null;
        }
      } catch (error) {
        console.error("Error fetching season description:", error);
        return null;
      }
    };

    fetchSerieDetails();
  }, [id, apiKey]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (serieId) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(serieId)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== serieId);
    } else {
      updatedFavorites.push(serieId);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favoritos', JSON.stringify(updatedFavorites));
  };

  const toggleSeasonVisibility = (seasonNumber) => {
    setVisibleSeasons((prevVisibleSeasons) => ({
      ...prevVisibleSeasons,
      [seasonNumber]: !prevVisibleSeasons[seasonNumber],
    }));
  };

  if (!serie) {
    return <div>Loading...</div>;
  }

  return (

    
    <div>
      <a href="/" className="titulo">{serie.Title}</a>
      <div className="detalle-serie degradado">
        <div className="poster-container degradado">
        <img className="poster" src={serie.Poster} alt={serie.Title} />
        </div>

      <div className='favoritos'>

      <button className='favoritos-btn' onClick={() => toggleFavorite(id)}>
        {favorites.includes(id) ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
        <div className="serie-info">
            <h2>{serie.Title}</h2>
            <p>{serie.Plot}</p>
            </div>
        <div className='seasons'>
      <h2>Seasons</h2>
      {seasons.length > 0 ? (
        seasons.map((season) => (
          <div key={season.season}>
            <h3 onClick={() => toggleSeasonVisibility(season.season)}>
              Season {season.season}
            </h3>
            <div className={`episodes ${visibleSeasons[season.season] ? 'visible' : ''}`}>
              <p>{season.Plot}</p>
              <ul>
                {season.Episodes.map((episode) => (
                  <li key={episode.imdbID}>
                    {episode.Title} - {episode.Runtime}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p>No seasons available.</p>
      )}
      </div>
            
        <div className="information">
            <ul>
              <li><strong>Year:</strong> {serie.Year}</li>
              <li><strong>Genre:</strong> {serie.Genre}</li>
              <li><strong>Actors:</strong> {serie.Actors}</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Details;