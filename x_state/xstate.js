const xstate = require('xstate');
const { gpioShutdown, gpioGrill, gpioGrillOff, gpioAllOff } = require('../gpioFunctions');

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
          SELECT_MODE: {
            actions: ['cacheMode']
          }
      },
    },
      smoke: {
            entry: ['startGrill'],
        exit: ['allOff'],
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
        exit: ['allOff'],
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


const actions = {
  actions: {
    startGrill: () => gpioGrill(),
    allOff: () => gpioAllOff(),
    // cacheMode: xstate.assign((context, event) => {
    //   console.log('event in cacheMode', event, 'context in cacheMode:', context);
    //   return {
    //     targetMode: event.value
    //   }
    // })
    cacheMode: xstate.assign((context, value)=>{
      console.log('context before update:', context);
      return {
        [value.contextField]:value.contextFieldContent
      }
      console.log(
        'in assign context:', context,
        'in assign value: ', value
      )
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