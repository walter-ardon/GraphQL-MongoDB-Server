const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema
} = require('graphql')

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        status: {
            type: GraphQLString,
            description: 'Status of GraphQL',
            resolve: () => 'Welcome to GraphQL'
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQueryType
})