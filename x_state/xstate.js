const xstate = require('xstate');

const wait = require('./functions/shutdown');


const stateMachine = {
    initial: 'idle',
    states: {
      idle: {
        on:{
          START: 'startGrill',
        }
      },
      startGrill: {
        on: {
          '': 
          [
            {
              target: 'grill',
            },
            {
              target: 'smoke',
            },
          ],
        }
      },
      smoke: {
        on: {
          GRILL: 'grill',
          GRILL_OFF: 'shutdown',
        }
      },
      grill: {
        on: {
          SMOKE: 'smoke',
          GRILL_OFF:'shutdown' ,
        }
      }, 
      shutdown: {
        invoke: {
         id: 'wait',
          src: () => wait(),
        onDone: 'idle'
        },
      }
    }
  }

class StateService { 
 machine;


  startService() {
    this.machine = xstate.interpret(xstate.Machine(stateMachine));
    this.machine.start();
  }

  send(target) {
    this.machine.send(target);
  }
}

module.exports = StateService;