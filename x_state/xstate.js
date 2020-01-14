import * as xstate from 'xstate';

const stateMachine = xstate.Machine({
  initial: 'idle',
  states: {
    idle: {
      on:{
        GRILL_ON: 'ignition'
      }
    },
    ignition: { 
      // add guard for ignited 
      on: {
        SMOKE: 'smoke',
        GRILL: 'grill',
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

    }
  }
})