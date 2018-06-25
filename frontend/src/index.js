import connect from 'connection'

console.log("I'm loaded")  // eslint-disable-line

console.log(process.env)  // eslint-disable-line
let cs = connect()

if (module.hot) {
  module.hot.accept(['connection', '.'], () => {
    cs.close()
    cs = connect()
  })
}
