const Gpio = require('onoff').Gpio;

const fan = new Gpio(14, 'high');
const igniter = new Gpio(15, 'high');
const auger = new Gpio(18, 'high');
const rando = new Gpio(25, 'high');
const on = 0;
const off = 1;

const gpioShutdown = ()=>{
  // TODO: check successfull writeSync
  // resolve with error if not
  return new Promise(resolve => {
    fan.writeSync(on);
    igniter.writeSync(off);
    auger.writeSync(off);
    setTimeout(resolve, 8000);
  });
}

const gpioGrill = ()=>{

  return new Promise(resolve => {
    fan.writeSync(on);
    igniter.writeSync(off);
    auger.writeSync(on);
    resolve('grillin');
  });
}

const gpioGrillOff = ()=>{

  return new Promise(resolve => {
    fan.writeSync(off);
    igniter.writeSync(off);
    auger.writeSync(off);
    resolve('grillin');
  });
}

const gpioAllOff = ()=>{
  console.log('all off called!!!!');

  return new Promise(resolve => {
    fan.writeSync(off);
    igniter.writeSync(off);
    auger.writeSync(off);
    rando.writeSync(off);
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