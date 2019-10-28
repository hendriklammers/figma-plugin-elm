import Clipboard from 'clipboard'
import './ui.css'

new Clipboard('#copy-button')

window.onmessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage
  if (msg && msg.type === 'show-code') {
    const codeElement = document.getElementById('code')
    codeElement.textContent = msg.data
  }
}
