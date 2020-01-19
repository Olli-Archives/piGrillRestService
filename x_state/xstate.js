const xstate = require('xstate');
const { gpioShutdown, gpioGrill, gpioGrillOff } = require('../gpioFunctions');

const stateMachine = ({
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
        // invoke: {
        //   id: 'grill',
        //    src: () => gpioGrill(),
        //  },
        entry: ['startGrill'],
        exit: ['endGrill'],
        on: {
          SMOKE: 'smoke',
          GRILL_OFF:'shutdown' ,
        }
      }, 
      shutdown: {
        invoke: {
         id: 'wait',
          src: () => gpioShutdown(),
        onDone: 'idle'
        },
      }
    }
  },
  {
    actions: {
      startGrill: () => gpioGrill,
      endGrill: () => gpioGrillOff
    }
  })

const actions = {
  actions: {
    startGrill: () => gpioGrill,
    endGrill: () => gpioGrillOff
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