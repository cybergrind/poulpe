const WS_SERVER = WS_SERVER_DEFINE // eslint-disable-line

class Connection {
  constructor() {
    this.connect()
  }

  connect = () => {
    this.s = new WebSocket(`${WS_SERVER}/ws`)
    this.s.onmessage = this.processMessage
    this.s.onopen = this.onopen
  }

  onopen = () => {
    console.log('On open') // eslint-disable-line
    this.s.send(JSON.stringify({ msg_type: 'hello', body: 'hello' }))
  }

  processMessage = (m) => {
    console.log(`Message is: ${m.data}`)  // eslint-disable-line
    const msg = JSON.parse(m.data)
    console.log(`Msg type: ${msg.msg_type}`)  // eslint-disable-line
  }

  close = () => {
    console.log('Closing socket')
    this.s.close()
    console.log('Closed socket')
  }
}

let connectionSingletone

function connect() {
  if (connectionSingletone) {
    connectionSingletone.close()
  }
  connectionSingletone = new Connection()
  return connectionSingletone
}

export default connect
