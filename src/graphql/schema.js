const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLID,
    GraphQLList
} = require('graphql')
const { articles, contributors } = require('../models/data')


const ArticleType = new GraphQLObjectType({
    name: 'Article',
    description: 'This represents an article uploaded by a contributor',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        topic: { type: GraphQLString },
        date: { type: new GraphQLNonNull(GraphQLString) },
        contributorId: { type: new GraphQLNonNull(GraphQLID) },
        contributor: {
            type: new GraphQLNonNull(ContributorType),
            resolve: (article) => contributors.find(contributor => contributor.id === article.contributorId)
        }
    })
})

const ContributorType = new GraphQLObjectType({
    name: 'Contributor',
    description: 'This represents a contributor of an article',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: GraphQLString },
        major: { type: new GraphQLNonNull(GraphQLString) },
        articles: {
            type: new GraphQLList(ArticleType),
            resolve: (contributor) => articles.filter(article => article.contributorId === contributor.id)
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        status: {
            type: GraphQLString,
            description: 'Status of GraphQL',
            resolve: () => 'Welcome to GraphQL'
        },
        article: {
            type: new GraphQLNonNull(ArticleType),
            description: 'A Single Article',
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (parent, args) => articles.find(article => article.contributorId === args.id)
        },
        articles: {
            type: new GraphQLList(ArticleType),
            description: 'List of Articles',
            resolve: () => articles
        },
        contributor: {
            type: new GraphQLNonNull(ContributorType),
            description: 'A Single Contributor',
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (parent, args) => contributors.find(contributor => contributor.id === args.id)
        },
        contributors: {
            type: new GraphQLList(ContributorType),
            description: 'List of Contributor',
            resolve: () => contributors
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addArticle: {
            type: ArticleType,
            description: 'Add an article',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                topic: { type: GraphQLString },
                date: { type: new GraphQLNonNull(GraphQLString) },
                contributorId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: (parent, args) => {
                const article = { id: articles.length + 1, ...args}
                articles.push(article)
                return article
            }
        },
        addContributor: {
            type: ContributorType,
            description: 'Add a Contributor',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                url: { type: GraphQLString },
                major: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const contributor = { id: contributors.length + 1, ...args }
                contributors.push(contributor)
                return contributor
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})