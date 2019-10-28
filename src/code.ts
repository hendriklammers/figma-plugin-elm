import convertToElm from 'html-elm'

const ab2str = (buf: ArrayBuffer) =>
  String.fromCharCode.apply(null, new Uint16Array(buf))

// Allow the plugin to run when only 1 element is selected
if (figma.currentPage.selection.length !== 1) {
  figma.closePlugin()
}

;(async () => {
  try {
    const selection = figma.currentPage.selection.map(async element => {
      const buffer = await element.exportAsync({ format: 'SVG' })
      return ab2str(buffer)
    })

    const arr = await Promise.all(selection)
    const data = convertToElm(arr.join('\n'))
    figma.showUI(__html__, { width: 600, height: 400 })
    figma.ui.postMessage({ type: 'show-code', data })
  } catch (err) {
    console.error(err)
    figma.closePlugin()
  }
})()
