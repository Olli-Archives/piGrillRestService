const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const  StateService  = require('./x_state/xstate');


updateStatus = (context)=>{
  status = context
}
const stateService = new StateService(updateStatus);

stateService.startService();
stateService.machine.onTransition(state=>{console.log('on transition state value:', state.value)});


app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res,)=>{
  res.send(`Welcome to pi REST service.  go to path /cook to
  send requests to this service
  `)
})

app.get('/status', (req, res) =>{
  res.send(stateService.machine.state);
})

app.post('/grill-state', (req, res)=>{
  if(req.body.state){
      const targetState = req.body.state;
      const value = req.body.value;
      console.log('sending target state to x-state:', targetState, 'value is:', value);
      stateService.send(targetState, value ? {valueString: value} : {valueString: value});
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
      res.sendStatus(200)
    } catch(e){
      res.send(`failed: ${e}`)
    }
  }
})

app.listen(3001, ()=>{
  console.log('listening on port 3001')
})

