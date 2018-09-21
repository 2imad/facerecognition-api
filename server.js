const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const app = express()

const register = require('./controllers/register')
const login = require('./controllers/login')
const profile = require('./controllers/profile')
const image = require('./controllers/image')
const db = knex({
    client: 'pg',
    connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'user',
    database: 'smart-brain'
    }
})
app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => res.send(database.users))
app.post('/signin', (req , res ) => {login.onLogin(req, res, db, bcrypt)})
app.post('/register', (req,res) => {register.onRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res)=> {profile.onProfileRequest(req , res, db) })
app.put('/image'  , (req , res) => {image.onImageSubmit(req , res , db)})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('App running on port', PORT))