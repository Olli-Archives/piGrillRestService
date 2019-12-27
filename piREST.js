const express = require('express');
const app = express()
const GpioDriver = require('./gpioDriver.ts')
const grillContorls = new GpioDriver

app.get('/', (req, res,)=>{
  res.send(`Welcome to pi REST service.  go to path /cook to
  send requests to this service
  `)
})

app.post('/grill', (req, res)=>{
  console.log('grill endpoint hit')
try{
  this.grillContorls.ignitionControl()
} catch(e) {
  res.send(e)
}
})

app.listen(3001, ()=>{
  console.log('listening on port 3001')
})

