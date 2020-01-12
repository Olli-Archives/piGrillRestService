const Gpio = require('onoff').Gpio;

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
}

module.exports = GpioDriver