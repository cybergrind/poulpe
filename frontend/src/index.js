console.log("I'm loaded")  // eslint-disable-line

if (module.hot) {
  module.hot.accept('.', () => {
  })
}

