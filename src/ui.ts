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

// document.getElementById('create').onclick = () => {
//   const textbox = document.getElementById('count') as HTMLInputElement
//   const count = parseInt(textbox.value, 10)
//   parent.postMessage(
//     { pluginMessage: { type: 'create-rectangles', count } },
//     '*'
//   )
// }
//
// document.getElementById('cancel').onclick = () => {
//   parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
// }
