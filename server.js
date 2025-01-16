// const { ApolloServer } = require('apollo-server');
// const typeDefs = require('./schema');
// const resolvers = require('./resolver');

// const server = new ApolloServer({ typeDefs, resolvers });

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });


const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');

async function startServer() {
  const app = express();

  // Create schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Create Apollo Server instance
  const server = new ApolloServer({
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          },
        };
      },
    }],
  });

  await server.start(); // Ensure Apollo Server is started before applying middleware
  server.applyMiddleware({ app });

  // Create HTTP server for WebSocket support
  const httpServer = createServer(app);

  // Set up the WebSocket for subscriptions
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  // Start the HTTP server
  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:4000${server.graphqlPath}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start the server:', error);
});

