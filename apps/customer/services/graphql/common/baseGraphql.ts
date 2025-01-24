import {ApolloClient, InMemoryCache, ApolloProvider, gql, ApolloLink} from '@apollo/client';

const authMiddleWare = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            authorization: ''
        }
    })
    return forward(operation)
});

const apolloClient = new ApolloClient({
    uri: '',
    cache: new InMemoryCache(),
    link: authMiddleWare
});
