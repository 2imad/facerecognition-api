const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cors = require('cors')
const knex = require('knex')

const app = express()

const db =  knex({
    client : 'pg',
    connection :{
        host :'127.0.0.1',
        user : 'user',
        password :'',
        database :'smart-brain'
    }
})






const PORT = process.env.PORT || 3001 
app.use(cors())

const database = {
    users : [
        {
            id : '123',
            name : 'David',
            email: 'david',
            password : '123456',
            entries : 0,
            joined : new Date()
        },
        {
            id : '124',
            name : 'Elena',
            email: 'elena@gmail.com',
            password : 'banana',
            entries : 0,
            joined :  new Date()
        }
        ]
    }
    


app.use(bodyParser.json())
app.get('/' , (req , res) => {
 res.send(database.users) 
})


app.post('/signin' , (req , res) => {
    database.users.forEach( user => {

        if(req.body.email === user.email &&
           req.body.password === user.password){
               res.json(user)
            }
            // else{
            //     res.status(400).json('You blew it!')
            // }
    })
})


app.post('/register' , (req , res ) =>{
   const { email , name , password } = req.body 
   db('users')
   .returning('*')
   .insert({
       email : email,
       name : name ,
       joined : new Date(),

   })
   .then(user => {
       res.json(user[0])
    })
    .catch(err =>  res.json(err)) 
})



app.get('/profile/:id' , ( req , res ) =>{
    const { id } =  req.params
    let found = false;
      database.users.forEach( user =>{
        if ( user.id === id){
            found;
            return res.json('success')
        }
    }) 
    if(!found){
        res.status(400).json(' No User found')
    } 
})

app.put('/image' , (req , res) =>{
   const { id } = req.body
   let found = false
   database.users.forEach( user => {
     if ( user.id  === id ){
        found
        user.entries ++ 
        return  res.json(user.entries) 
     }
   })
   if(!found){
       res.status(400).res.json('No user and there is not such a thing as entries')
   }
})


app.listen(PORT , ()=>{
    console.log('App running on port' , PORT)
})