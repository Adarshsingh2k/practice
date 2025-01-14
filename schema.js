const {gql} = require('apollo-server')
const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    director: String!
    releaseYear: Int!
    genres: [String!]!
  }

  type Query {
    movies: [Movie!]!
    movie(id: ID!): Movie
    genres: [String!]!
  }

  input MovieInput {
    id: ID!
    title: String!
    director: String!
    releaseYear: Int!
    genres: [String!]!
  }

  type Mutation {
    addMovie(data: MovieInput!): Movie!
    updateMovie(id: ID!, data: MovieInput!): Movie!
    deleteMovie(id: ID!): Boolean!
  }

`;

module.exports = typeDefs;
