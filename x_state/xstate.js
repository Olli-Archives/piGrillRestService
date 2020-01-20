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
        invoke:{
          id: 'startGrill',
          src: (context, event) => { return new Promise((res, rej)=>{
            const done = ()=>res('done');
            setTimeout(done, 8000);
          })},
          onDone: [
            {targert: 'grill', cond: context => { console.log('context in cond',context); context.targetMode == 'grill'}},
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