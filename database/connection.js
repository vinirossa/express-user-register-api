var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'q1w2e3r4@',
        database: 'apiusers'
    }
});

module.exports = knex