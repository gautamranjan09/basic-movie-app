import React, { useState, useRef } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [cancelRetry, setCancelRetry] = useState(false);

  const retryTimeoutId = useRef(null);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    setRetrying(false);
    setCancelRetry(false);
    console.log("fetch1");

    try {
      const response = await fetch("https://swapi.dev/api/film/");
      if (!response.ok) {
        throw new Error("Something went wrong....");
      }
      const data = await response.json();
      console.log("fetch2");
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
      console.log("fetch3");
      
      retryFetchMovies();
    }
    setIsLoading(false);
  }
console.log("cancelretry "+cancelRetry,  "retrying "+ retrying);

  function retryFetchMovies() {
    console.log("fetch 4");
    console.log("cancelretry "+cancelRetry,  "retrying "+ retrying);
    
    if (cancelRetry) return; // Avoid scheduling retry if canceled
    setRetrying(true);
    retryTimeoutId.current = setTimeout(async () => {
      if (!cancelRetry) {
        await fetchMoviesHandler();
      }
    }, 5000);
  }

  function cancelRetryHandler() {
    setCancelRetry(true);
    clearTimeout(retryTimeoutId.current); // Clear the scheduled retry
    setRetrying(false);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) content = <MoviesList movies={movies} />;
  if (error)
    content = (
      <div>
        <p>{error}</p>
        {retrying ? (
          <p>Retrying...</p>
        ) : (
          <button onClick={fetchMoviesHandler}>Retry</button>
        )}
        <button onClick={cancelRetryHandler}>Cancel Retry</button>
      </div>
    );
  if (isLoading) content = <p>Loading...</p>;

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
