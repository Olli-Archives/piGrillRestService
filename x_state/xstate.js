const xstate = require('xstate');
const { gpioShutdown, gpioGrill, gpioGrillOff, gpioAllOff } = require('../gpioFunctions');

const stateMachine = {
    initial: 'idle',
    states: {
      idle: {
        on:{
          START: 'startGrill',
        }
      },
      startGrill: {
        initial: 'noError',
        context:{
          targetMode:""
        },
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
            entry: ['cacheMode']
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
     actions: {
        startGrill: () => gpioGrill(),
        allOff: () => gpioAllOff(),
        // cacheMode: xstate.assign((context, event) => {
        //   console.log('event in cacheMode', event, 'context in cacheMode:', context);
        //   return {
        //     targetMode: event.value
        //   }
        // })
        cacheMode: (context, event) => {
            console.log('cacheMode action event:', event);
            xstate.assign(()=>{
              return {
                targetMode: event.value
              }
            })
      
        }
      }
  };


// const actions = {
//   actions: {
//     startGrill: () => gpioGrill(),
//     endGrill: () => gpioAllOff(),

//   }
// }

class StateService { 
 machine;

  startService() {
    this.machine = xstate.interpret(xstate.Machine(stateMachine));
    this.machine.start();
  }

  send(target, value="") {
    this.machine.send(target, value);
  }
}

module.exports = StateService;