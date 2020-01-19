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
            const done = ()=>res.send('done');
            setTimeout(done, 8000);
          })},
          onDone: [
            {target: 'smoke', cond: context => context.targetMode === 'smoke'},
            {targert: 'grill', cond: context => context.targetMode == 'grill'},
            {target: 'startGrill.error'}
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
          SELECT_MODE: {
            actions: ['updateContext']
          }
      },

    },
    awatingMode:{

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