// import dependencies
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const schema = require('./graphql/schema')


// configure app
const app = express()
const port = 3000

const connectMongoDB = async () => {
    const mongoServer = new MongoMemoryServer()
    await mongoServer.start()
    const mongoServerURL = mongoServer.getUri()
    mongoose.connect(mongoServerURL, {
        useNewURLParser: true,
        useUnifiedTopology: true
    })
    mongoose.connection.once('open', () => {
        console.log('Connected to MongoDB')
    })
}

connectMongoDB()

// configure endpoints
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(port, () => console.log(`App listening on port ${port}!`))