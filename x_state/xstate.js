const xstate = require('xstate');
const { gpioShutdown, gpioGrill, gpioGrillOff, gpioAllOff, ignite, grill } = require('../gpioFunctions');

const stateMachine = {
    initial: 'idle',
    context:{
      targetMode:""
    },
    states: {
      idle: {
        on:{
          START: 'startGrill',
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
          }
      },

    },
      smoke: {
        exit: ['allOff'],
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
         id: 'wait',
          src: () => gpioShutdown(),
        onDone: 'idle'
        },
      }
    },
  };

  // TODO: Do I need to make this a state machine??
  // ignitionMachine = xstate.Machine({
  //   id: 'igniter',
  //   initial: 'startIgnition',
  //   states: {
  //     startIgnition: {

  //     }
  //   }
  // })


const actions = {
  actions: {
    startGrill: () => gpioGrill(),
    allOff: () => gpioAllOff(),
    updateContext: xstate.assign((context, value)=>{
      console.log('context before update:', context);
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