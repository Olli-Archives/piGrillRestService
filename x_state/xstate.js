const xstate = require('xstate');
const { idle, ignite, grill, smoke, shutDown } = require('../gpioFunctions');

const stateMachine = {
    initial: 'idle',
    context:{
      targetMode:"",
      targetTemp:200
    },
    states: {
      idle: {
        invoke: {
          id: 'GPIO_IDLE',
          src: idle
        },
        on:{
          START: 'startGrill',
          UPDATE_TEMP:{
            actions: ['updateContext']
          }
        }
      },
      startGrill: {
        invoke:{
          id: 'GPIO_IGNITE',
          src: ignite,
          onDone: [
            {target: 'grill', cond: context => context.targetMode == 'grill'},
            {target: 'smoke'},
          ]
        },
        initial: 'noError',
        states: {
          noError: {},
          error: {
            inital: 'empty',
            states: {
              empty:{},
              failedIgnition:{}
            }
          }
        },
        on: {
          GRILL: {
            actions: ['updateContext']
          },
          SMOKE: {
            actions: ['updateContext']
          },
          GRILL_OFF: 'shutdown',
      },

    },
      smoke: {
        invoke: {
          id: 'GPIO_SMOKE',
          src: smoke
        },
        on: {
          GRILL: 'grill',
          GRILL_OFF: 'shutdown',
        }
      },
      grill: {
        invoke: {
          id: 'GPIO_GRILL',
          src: grill
        },
        on: {
          SMOKE: 'smoke',
          GRILL_OFF:'shutdown' ,
        }
      }, 
      shutdown: {
        invoke: {
        id: 'GPIO_SHUT_DOWN',
        src: shutDown,
        onDone: 'idle'
        },
      }
    },
  };

const actions = {
  actions: {
    updateContext: xstate.assign((context, value)=>{
      return {
        [value.contextField]:value.contextFieldContent
      }
    })
  }
}

class StateService { 
 machine;

  startService() {
    this.machine = xstate.interpret(xstate.Machine(stateMachine, actions));
    this.machine.start();
  }

  send(target, value="") {
    this.machine.send(target, value);
  }
}

module.exports = StateService;