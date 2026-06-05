import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://relevant-humpback-83.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': 'nLBpxnW7WK6ToRl0vZn7RVZlUI7mxHHRfEQOE5ZbzX6b5x837FIwscboqACincMa'
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});