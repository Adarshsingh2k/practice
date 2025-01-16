const pubsub = require("./pubsub");
// const { subscribe } = require("./pubsub");
const MOVIE_ADDED= `MOVIE_ADDED`
const movies = []; 
const genres = ["Action", "Drama", "Comedy", "Horror", "Sci-Fi"]; 

const resolvers = {
  Query: {
    movies: () => movies,
    movie: (_, { id }) => movies.find((movie) => movie.id === id),
    genres: () => genres,
  },
  Mutation: {
    addMovie: (_, { data }) => {
      const newMovie = { id: movies.length + 1, ...data };
      movies.push(newMovie);
      pubsub.publish(MOVIE_ADDED, { movieAdded: newMovie });
      return newMovie;
    },
    updateMovie: (_, { id, data }) => {
      const movieIndex = movies.findIndex((movie) => movie.id === id);
      if (movieIndex === -1) throw new Error("Movie not found");
      movies[movieIndex] = { ...movies[movieIndex], ...data };
      return movies[movieIndex];
    },
    deleteMovie: (_, { id }) => {
      const movieIndex = movies.findIndex((movie) => movie.id === id);
      if (movieIndex === -1) throw new Error("Movie not found");
      movies.splice(movieIndex, 1);
      return true;
    },
  },

  Subscription:{
    movieAdded:{
        subscribe:()=> pubsub.asyncIterableIterator([MOVIE_ADDED])
    }
  }

 
};

module.exports = resolvers;
