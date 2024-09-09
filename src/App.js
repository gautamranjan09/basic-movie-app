import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies,setMovies]=useState([]);
  
  function fetchMoviesHandler() {
    fetch("https://swapi.dev/api/films/")
      .then((response) => {
        return response.json();
      })
      .then((data)=>{
        const transformedMovies = data.results.map(movieData=>{
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date,
          }
        })
        
        setMovies(transformedMovies);
      })
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) content = <MoviesList movies={movies} />;
  if (error) content = <p>{error}</p>;
  if (isLoading) content = <p>Loading...</p>;

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
