const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const app = express()

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'user',
        database: 'smart-brain'
    }
})


const PORT = process.env.PORT || 3001
app.use(cors())

app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send(database.users)
})


app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(404).json('Unable to get user'))
            } else {
                res.json('Wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Unable to connect user'))
})


app.post('/register', (req, res) => {
    const { email, name, password } = req.body
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date(),

                    })
                    .then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.json('Cannot register user '))
})



app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    db.select('*').from('users').where({ id }).then(user => {

        if (user.length) {
            res.json(user[0])
        } else {
            res.status(404).json('User Not found')
        }
    }).catch(err => {
        res.json('Error loading Profile ')
    })
})


app.put('/image', (req, res) => {
    const { id } = req.body
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries =>
            res.json(entries[0])
        ).catch(err => res.json(' Error updating the entries'))
})


app.listen(PORT, () => {
    console.log('App running on port', PORT)
})