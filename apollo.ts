import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'YOUR_HASURA_GRAPHQL_ENDPOINT',
  headers: {
    'x-hasura-admin-secret': 'YOUR_HASURA_ADMIN_SECRET'
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});