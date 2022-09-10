// import dependencies
const express = require('express')

// configure app
const app = express()
const port = 3000

// configure endpoints
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`App listening on port ${port}!`))