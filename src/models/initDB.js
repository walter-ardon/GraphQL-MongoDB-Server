const Article = require('./article')
const Contributor = require('./contributor')
const { articles, contributors } = require('./data')

const initDB = () => {
    articles.forEach(item => {
        delete item.id
        const article = new Article({ ...item })
        article.save()
    })

    contributors.forEach(item => {
        item['iid'] = item.id
        delete item.id
        const contributor = new Contributor({ ...item })
        contributor.save()
    })
}

module.exports = initDB