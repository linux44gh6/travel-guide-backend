const express = require('express');
const app=express()
const cors = require('cors');
const port=process.env.PORT||5000
//set the middleware

app.use(cors())
app.use(express.json())