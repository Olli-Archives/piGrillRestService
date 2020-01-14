const xstate = require('xstate')

const grillMode = (context, event)=>{
  console.log('context', context);

  return context.value === 'grill'
}

const stateMachine = xstate.Machine({
  context: {
    mode: 'smoke'
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
        GRILL_OFF: 'shutdown'
      }
    }, 
    shutdown: {
      on: {
        START: 'startGrill'
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