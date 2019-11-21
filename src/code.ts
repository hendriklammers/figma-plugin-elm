import htmlToElm, { Options } from 'html-elm'

const ab2str = (buf: ArrayBuffer) =>
  String.fromCharCode.apply(null, new Uint16Array(buf))

const convertToElm = async (options: Options = { imports: true }) => {
  try {
    const selection = figma.currentPage.selection.map(async element => {
      const buffer = await element.exportAsync({ format: 'SVG' })
      return ab2str(buffer)
    })

    const arr = await Promise.all(selection)
    const data = await htmlToElm(arr.join('\n'), options)

    figma.ui.postMessage({ type: 'show-code', data })
  } catch (err) {
    console.error(err)
    figma.closePlugin()
  }
}

// Allow the plugin to run when only 1 element is selected
// TODO: Show warning in ui?
if (figma.currentPage.selection.length !== 1) {
  figma.closePlugin()
}

figma.showUI(__html__, { width: 600, height: 400 })

convertToElm()

figma.ui.onmessage = msg => {
  switch (msg.type) {
    case 'cancel':
      figma.closePlugin()
      break
    case 'apply-settings':
      convertToElm({ imports: true, ...msg.options })
      break
    default:
      console.error('Invalid message type')
      figma.closePlugin()
  }
}

