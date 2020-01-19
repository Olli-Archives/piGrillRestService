const Gpio = require('onoff').Gpio;

const fan = new Gpio(14, 'out');
const igniter = new Gpio(15, 'out');
const auger = new Gpio(18, 'out');

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
  console.log('invoked grill')
  return new Promise(resolve => {
    fan.writeSync(1);
    igniter.writeSync(0);
    auger.writeSync(1);
    resolve('grillin');
  });
}


class GpioDriver {
  
  constructor(){
    this.grillGpio = new Gpio(25, 'out');
  }

grillOn(res){
  this.grillGpio.writeSync(1);
  res.send(`grill status: ${this.grillGpio.readSync()}`)
}

grillOff (res){
  this.grillGpio.writeSync(0);
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
  gpioGrill
}