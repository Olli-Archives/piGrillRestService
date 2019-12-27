const Gpio = require("pi-gpio"); var gpioPin = 7;

class GpioDriver {
  fan
  ignitor
  auger

  constructor() {
    this.fan = new Gpio(25)
    this.ignitor = new Gpio(8)
    this.auger = new Gpio(7)
  }

  pinStatus = (err, val) => {
    if (val) {
      console.log(val)
    } else {
      console.log(err)
    }

  }

  ignitionControl() {
    this.ignitor.writeSync(turnOn())
    this.ignitor.read(this.pinStatus)
  }
}

module.exports.GpioDriver