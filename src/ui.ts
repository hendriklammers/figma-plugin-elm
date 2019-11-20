import Clipboard from 'clipboard'
import './ui.scss'

new Clipboard('#copy-button')

window.onmessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage

  if (msg?.type === 'show-code') {
    const codeElement = document.getElementById('code-output')
    codeElement.textContent = msg.data
  }
}
