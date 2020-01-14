const express = require('express');
const app = express();
const GpioDriver = require('./gpioDriver.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const grillControls = new GpioDriver();
const  StateService  = require('./x_state/xstate');
const stateService = new StateService();

stateService.startService();
stateService.machine.onTransition(state=>{console.log(state.value)});


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
      stateService.send('START')
      res.sendStatus(200)
    } catch(e){
      res.send(`failed:`)
    }
  } else if(req.body.state === "off"){
    try{
      stateService.send('GRILL_OFF')
      res.sendStatus(200)
    } catch(e){
      res.send(`failed:`)
    }
  } else {
    res.send('invalid request')
  }
}) 

app.post('/grill-mode', (req, res)=>{
  if(req.body.smoke == "on"){
    console.log('sending smoke')
    try{
      stateService.send('SMOKE')
      res.sendStatus(200)
    } catch(e){
      res.send(`failed:`)
    }
    }else if( req.body.smoke == "off"){
      console.log('sending grill')
      try{
        stateService.send('GRILL')
        res.sendStatus(200)
      } catch(e){
        res.send(`failed: ${e}`)
      }
    }
})

app.post('/grill-temp', (req, res)=>{
  if(req.body.temp){
    try{
      grillControls.setTemp(req.body.temp, res)
      res.sendStatus(200)
    } catch(e){
      res.send(`failed: ${e}`)
    }
  }
})


app.listen(3001, ()=>{
  console.log('listening on port 3001')
})

