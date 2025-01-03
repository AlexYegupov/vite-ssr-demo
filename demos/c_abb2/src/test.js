console.log(`importing test`)

export const data = {d:'TEST DATA5'}

//export function myfunc() {

const l = import('underscore').then(() => {console.log(`l`, l)})



// if (import.meta.hot) {
//   import.meta.hot.accept(() => {
//     console.log('Test module updated');
//   });
// }
