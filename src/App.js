import React, { useState, useRef } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const retryTimeoutId = useRef(null);
  const cancelRetryRef = useRef(false); // Ref to track cancel state

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);
    setRetrying(false);
    cancelRetryRef.current = false; // Resetting cancelRetry via ref

    try {
      const response = await fetch("https://swapi.dev/api/film/");
      if (!response.ok) {
        throw new Error("Something went wrong....");
      }
      const data = await response.json();
      console.log("fetch2");
      const transformedMovies = data.results.map((movieData) => ({
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      }));
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
      retryFetchMovies();
    }
    setIsLoading(false);
  }

  function retryFetchMovies() {
    if (cancelRetryRef.current) return; // Avoid scheduling retry if canceled

    setRetrying(true);
    retryTimeoutId.current = setTimeout(() => {
      if (!cancelRetryRef.current) {
        fetchMoviesHandler(); // Retry fetching if not canceled
      }
    }, 5000);
  }

  function cancelRetryHandler() {
    cancelRetryRef.current = true; // Immediately cancel retry
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
