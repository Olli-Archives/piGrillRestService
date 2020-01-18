const xstate = require('xstate');

const wait = require('./functions/shutdown');

const grillMode = (context, event)=>{
  return context.value === 'grill'
}

const stateMachine = (statusFunction)=>{
  return xstate.Machine({
    context: {
      mode: 'smoke',
      status: 'off',
    },
    initial: 'idle',
    states: {
      idle: {
        on:{
          START: 'startGrill',
          STATUS: {
            actions: (context)=>{
              statusFunction(context)
            }
          }
        }
      },
      startGrill: {
        on: {
          '': 
          [
            {
              target: 'grill',
              cond: grillMode,
              invoke: {
                src:  xstate.assign({mode: ()=> 'grill'})
              },
            },
            {
              target: 'smoke',
              invoke: {
                src:  xstate.assign({mode: ()=> 'smoke'})
              },
            },
          ],
          STATUS: {
            actions: (context)=>{
              statusFunction(context)
            }
          }
        }
      },
      smoke: {
        on: {
       
          GRILL: 'grill',
          GRILL_OFF: 'shutdown',
          STATUS: {
            actions: (context)=>{
              statusFunction(context)
            }
          }
        }
      },
      grill: {
        on: {
          SMOKE: 'smoke',
          GRILL_OFF:'shutdown' ,
          STATUS: {
            actions: (context)=>{
              statusFunction(context)
            }
          }
        }
      }, 
      shutdown: {
        invoke: {
         id: 'wait',
          src: () => wait(),
        onDone: 'idle'
        },
        on: {
          STATUS: {
            actions: (context)=>{
              statusFunction(context)
            }
          }
        }
      }
    }
  })
} 

class StateService { 
 machine;
 statusCallBack;

 constructor(callBack){
 this.statusCallBack = callBack
 }

  statusFunction = (callBack)=>{
    return (context)=>{
      callBack(context)}
  }

  startService() {
    this.machine = xstate.interpret(stateMachine(this.statusFunction(this.statusCallBack)));
    this.machine.start();
  }

  send(target) {
    this.machine.send(target);
  }
}

module.exports = StateService;