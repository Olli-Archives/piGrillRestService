const express = require('express');
const app = express()
const GpioDriver = require('./gpioDriver.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const grillControls = new GpioDriver()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res,)=>{
  res.send(`Welcome to pi REST service.  go to path /cook to
  send requests to this service
  `)
})

app.post('/grill-state', (req, res)=>{
  if(req.body.state === "on"){
    try{
      grillControls.grillOn(res)
    } catch(e){
      res.send(`failed: ${e}`)
    }
  } else if(req.body.state === "off"){
    try{
      grillControls.grillOff(res)
    } catch(e){
      res.send(`failed: ${e}`)
    }
  } else {
    res.send('invalid request')
  }
}) 

app.post('/grill-mode', (req, res)=>{
  if(req.body.smoke == "on"){
    try{
      grillControls.smokeOn(res)
    } catch(e){
      res.send(`failed: ${e}`)
      
    }
    }else if( req.body.smoke == "off"){
      try{
        grillControls.smokeOff(res)
      } catch(e){
        res.send(`failed: ${e}`)
      }
    }
})


app.listen(3001, ()=>{
  console.log('listening on port 3001')
})

