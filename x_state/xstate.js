const xstate = require('xstate');

const wait = require('./functions/shutdown');



const grillMode = (context, event)=>{
  return context.value === 'grill'
}

const stateMachine = xstate.Machine({
  context: {
    mode: 'smoke',
  },
  initial: 'idle',
  states: {
    idle: {
      on:{
        START: 'startGrill'
      }
    },
    startGrill: {
      on: {
        '': 
        [
          {
            target: 'grill',
            cond: grillMode
          },
          {
            target: 'smoke',
          },
        ]
      }
    },
    smoke: {
      on: {
        GRILL: 'grill',
        GRILL_OFF: 'shutdown'
      }
    },
    grill: {
      on: {
        SMOKE: 'smoke',
        GRILL_OFF:'shutdown' 
      }
    }, 
    shutdown: {
 
      invoke: {
       id: 'wait',
        src: () => wait(8000),
      onDone: 'idle'
      },
    }
  }
})

class StateService { 
 machine;

 

  startService() {
    this.machine = xstate.interpret(stateMachine);
    this.machine.start();
  }

  send(target) {
    this.machine.send(target);
  }

}

module.exports = StateService;