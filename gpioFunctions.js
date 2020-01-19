const Gpio = require('onoff').Gpio;

const fan = new Gpio(14, 'in');
const igniter = new Gpio(15, 'in');
const auger = new Gpio(18, 'in');
const rando = new Gpio(25, 'in');

const gpioShutdown = ()=>{
  // TODO: check successfull writeSync
  // resolve with error if not
  return new Promise(resolve => {
    fan.writeSync(1);
    igniter.writeSync(0);
    auger.writeSync(0);
    setTimeout(resolve, 8000);
  });
}

const gpioGrill = ()=>{

  return new Promise(resolve => {
    fan.writeSync(1);
    igniter.writeSync(0);
    auger.writeSync(1);
    resolve('grillin');
  });
}

const gpioGrillOff = ()=>{

  return new Promise(resolve => {
    fan.writeSync(0);
    igniter.writeSync(0);
    auger.writeSync(0);
    resolve('grillin');
  });
}

const gpioAllOff = ()=>{
  console.log('all off called!!!!');

  return new Promise(resolve => {
    fan.writeSync(1);
    igniter.writeSync(1);
    auger.writeSync(1);
    rando.writeSync(1);
    resolve('grillin');
  });
}


class GpioDriver {
  


grillOn(res){
  rando.writeSync(1);
  res.send(`grill status: ${this.grillGpio.readSync()}`)
}

grillOff (res){
  rando.writeSync(0);
  res.send(`grill status: ${this.grillGpio.readSync()}`)
}

smokeOn(res){
  res.send('smoke status: smoke on')
}

smokeOff(res){
  res.send('smoke status: smoke off')
}
setTemp(temp, res){
  res.send(`setting temp to: ${temp}`)
}
}

module.exports = {
  gpioShutdown,
  GpioDriver,
  gpioGrill,
  gpioGrillOff,
  gpioAllOff,
}