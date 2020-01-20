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

// Because ignite doesn't need any event listeners from parent machine, it can be a promise 
const ignite = (context, event) => { return new Promise((res, rej)=>{

  const resolve = ()=>{
    igniter.writeSync(off);
    res('done')};

  const augerOff = ()=>auger.writeSync(off);

  fan.writeSync(on);
  auger.writeSync(on);
  igniter.writeSync(on);

  setTimeout(augerOff, 4000);
  setTimeout(resolve, 8000);
})}

// Because Grill needs onReceive to listed from parent when to resolve, it needs to be a callback
const grill = (context, event) => (callback, onReceive) => {
  let targetTemp
  const toggleAuger = ()=>{
    auger.writeSync(on)
    setTimeout(()=>auger.writeSync(off), 500)
  }

  // Set all GPIO to grill mode
  fan.writeSync(on);
  igniter.writeSync(off);

  // Togle auget to simulate PID conrolling temp
  // unused targetTemp will be used to controll PID in future
  const intervalHandle = setInterval(toggleAuger, 1000)

  // Update target temp which is received from parent machine
  // if user decides to update target temp
  onReveice(e=>{
      targetTemp = e.type
  })
  
  // Perform cleanup
  return () => clearInterval(intervalHandle);

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
  ignite
}