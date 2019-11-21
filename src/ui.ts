import Clipboard from 'clipboard'
import { Options } from 'html-elm'
import './ui.scss'

// Use Clipboard.js lib to add Copy to Clipboard functionality
new Clipboard('#copy-button')

window.onmessage = (event: MessageEvent) => {
  const msg = event.data.pluginMessage
  if (msg?.type === 'show-code') {
    const codeElement = document.querySelector('#code-output')
    codeElement.textContent = msg.data
  }
}

document.querySelector('#cancel-button').addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
})

const applySettingsButton: HTMLButtonElement = document.querySelector(
  '#apply-settings-button'
)
const aliasSvgInput: HTMLInputElement = document.querySelector('#alias-svg')
const aliasSvgAttributeInput: HTMLInputElement = document.querySelector(
  '#alias-svg-attr'
)

let options: Options = {}

applySettingsButton.addEventListener('click', () => {
  if (options) {
    parent.postMessage(
      { pluginMessage: { type: 'apply-settings', options } },
      '*'
    )
    applySettingsButton.disabled = true
  }
})

document.querySelectorAll('#alias-svg, #alias-svg-attr').forEach(elem => {
  elem.addEventListener('input', () => {
    options = {
      svgAlias: aliasSvgInput.value,
      svgAttributeAlias: aliasSvgAttributeInput.value,
    }
    applySettingsButton.disabled = false
  })
})
