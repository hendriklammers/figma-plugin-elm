import htmlToElm, { Options } from 'html-elm'

const ab2str = (buf: ArrayBuffer) =>
  String.fromCharCode.apply(null, new Uint16Array(buf))

const convertToElm = async (options: Options) => {
  try {
    const selection = figma.currentPage.selection.map(async element => {
      const buffer = await element.exportAsync({ format: 'SVG' })
      return ab2str(buffer)
    })

    const arr = await Promise.all(selection)
    const data = await htmlToElm(arr.join('\n'), { imports: true, ...options })

    figma.ui.postMessage({ type: 'show-code', data })
  } catch (err) {
    console.error(err)
    figma.closePlugin()
  }
}

let options: Options

// Allow the plugin to run when only 1 element is selected
if (figma.currentPage.selection.length !== 1) {
  figma.closePlugin()
}

figma.showUI(__html__, { width: 600, height: 400 })

convertToElm(options)

// Convert again when user changes selection
figma.on('selectionchange', () => {
  if (figma.currentPage.selection.length === 1) {
    convertToElm(options)
  }
})

figma.ui.onmessage = msg => {
  switch (msg.type) {
    case 'cancel':
      figma.closePlugin()
      break
    case 'apply-settings':
      options = msg.options
      convertToElm(options)
      break
    default:
      console.error('Invalid message type')
      figma.closePlugin()
  }
}
