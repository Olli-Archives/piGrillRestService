const xstate = require('xstate')

const stateMachine = xstate.Machine({
  context: {
    mode: 'grill'
  },
  initial: 'idle',
  states: {
    idle: {
      on:{
        START: 'start'
      }
    },
    start: {
      on: {
        '': {
          target: context.mode
        }
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
        GRILL_OFF: 'shutdown'
      }
    }, 
    shutdown: {
      on: {
        GRILL: 'grill',
        SMOKE: 'smoke'
      }
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