const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const database = {
    users : [
        {
            id : '123',
            name : 'David',
            email: 'david@gmail.com',
            password : '123456',
            entries : 0,
            joined : new Date()
        },
        {
            id : '124',
            name : 'Elena',
            email: 'Elena@gmail.com',
            password : '123987',
            entries : 0,
            joined : new Date()}
    ]
}


app.get('/' , (req , res) => {
 res.send('This is working') 
})
app.post('/signing' , (req , res) => {
    if(req.body.email === database.users[0].email &&
       req.body.password === database.users[0].password){
           res.json('succes')
        }else{
            res.status(400).json('You blew it! ')
        }
})
app.post('/register' , (req , res ) =>{
   const { email , name , password } = req.body 
   database.users.push({
       id : '123',
       name : name,
       email : email,
       password : password,
       joined : new Date()
   })
   res.json(database.users[database.users.length - 1])
})
app.get('/profile/:id' , ( req , res ) =>{
    const { id } =  req.params
    let found = false;
      database.users.forEach( user =>{
        if ( user.id === id){
            found;
            return res.json(user)
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
        res.json(user.entries) 
     }
   })
   if(!found){
       res.status(400).res.json('No user and there is not such a thing as entries')
   }
})


app.listen(3000 , ()=>{
    console.log('App running on port 3000 ')
})