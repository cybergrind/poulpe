const WS_SERVER = WS_SERVER_DEFINE // eslint-disable-line

class Connection {
  constructor() {
    this.connect()
  }

  connect = () => {
    this.s = new WebSocket(`${WS_SERVER}/ws`)
    this.s.addEventListener('message', this.processMessage)
    this.s.addEventListener('open', this.onopen)
    this.s.addEventListener('close', this.onclose)
    this.s.addEventListener('error', this.onerror)
    this.closing = false
  }

  onopen = () => {
    console.log('On open') // eslint-disable-line
    this.s.send(JSON.stringify({ msg_type: 'hello', body: 'hello' }))
  }

  onerror = (e) => {
    console.log(`On error ${e}`)
  }

  onclose = () => {
    console.log(`On close ${this.closing}`)
    if (!this.closing) {
      console.log('Reconnect')
      this.connect()
    }
  }

  processMessage = (m) => {
    console.log(`Message is: ${m.data}`)  // eslint-disable-line
    const msg = JSON.parse(m.data)
    console.log(`Msg type: ${msg.msg_type}`)  // eslint-disable-line
  }

  close = () => {
    this.closing = true
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
