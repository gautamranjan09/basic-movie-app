import React, { useState, useRef, useCallback, useEffect } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";
import Form from "./components/Form";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const retryTimeoutId = useRef(null);
  const cancelRetryRef = useRef(false); // Ref to track cancel state

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRetrying(false);
    cancelRetryRef.current = false; // Resetting cancelRetry via ref

    try {
      const response = await fetch(
        "https://basic-movie-app-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong....");
      }
      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          releaseDate: data[key].releaseDate,
          openingText: data[key].openingText,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
      retryFetchMovies();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

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

  async function fromSubmitHandler(movie) {
    // setMovies((pervData)=>{
    //   return [...pervData, data];
    // })
    const response = await fetch(
      "https://basic-movie-app-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
  }

  async function deleteMovieHandler(movieId) {
    const response = await fetch(
      `https://basic-movie-app-default-rtdb.firebaseio.com/movies/${movieId}.json`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      // Filter out the deleted movie from the state to update the UI
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
    } else {
      setError("Failed to delete the movie.");
    }
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0)
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
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
      <Form onFromSubmit={fromSubmitHandler} />
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
