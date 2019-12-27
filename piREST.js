const express = require('express');
const app = express()

app.get('/', (req, res,)=>{
  res.send(`Welcome to pi REST service.  go to path /cook to
  send requests to this service
  `)
})

app.post('/grill', (req, res)=>{
  const request = req.body;
  
})

app.listen(3001, ()=>{
  console.log('listening on port 3001')
})

