// import dependencies
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./graphql/schema')

// configure app
const app = express()
const port = 3000

// configure endpoints
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(port, () => console.log(`App listening on port ${port}!`))