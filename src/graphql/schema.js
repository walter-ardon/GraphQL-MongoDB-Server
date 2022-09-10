const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLID,
    GraphQLList
} = require('graphql')
const Article = require('../models/article')
const Contributor = require('../models/contributor')


const ArticleType = new GraphQLObjectType({
    name: 'Article',
    description: 'This represents an article uploaded by a contributor',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        topic: { type: GraphQLString },
        date: { type: new GraphQLNonNull(GraphQLString) },
        contributorId: { type: new GraphQLNonNull(GraphQLID) },
        contributor: {
            type: new GraphQLNonNull(ContributorType),
            resolve: (parent, args) => Contributor.findOne({ iid: parent.contributorId })
        }
    })
})

const ContributorType = new GraphQLObjectType({
    name: 'Contributor',
    description: 'This represents a contributor of an article',
    fields: () => ({
        iid: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        url: { type: GraphQLString },
        major: { type: new GraphQLNonNull(GraphQLString) },
        articles: {
            type: new GraphQLList(ArticleType),
            resolve: (parent, args) => Article.find({ contributorId: parent.iid })
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
            resolve: (parent, args) => Article.findById(args.id)
        },
        articles: {
            type: new GraphQLList(ArticleType),
            description: 'List of Articles',
            resolve: () => Article.find({})
        },
        contributor: {
            type: new GraphQLNonNull(ContributorType),
            description: 'A Single Contributor',
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (parent, args) => Contributor.findById(args.id)
        },
        contributors: {
            type: new GraphQLList(ContributorType),
            description: 'List of Contributor',
            resolve: () => Contributor.find({})
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
                const article = new Article({ ...args })
                return article.save()
            }
        },
        addContributor: {
            type: ContributorType,
            description: 'Add a Contributor',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                url: { type: GraphQLString },
                major: { type: new GraphQLNonNull(GraphQLString) },
                iid: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const contributor = new Contributor({ ...args })
                return contributor.save()
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})