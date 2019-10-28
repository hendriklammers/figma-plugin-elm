import convertToElm from 'html-elm'

const ab2str = (buf: ArrayBuffer) =>
  String.fromCharCode.apply(null, new Uint16Array(buf))

// Exit plugin when nothing is selected
if (figma.currentPage.selection.length < 1) {
  figma.closePlugin()
}

// TODO: Only allow for 1 selected element?

;(async () => {
  try {
    const selection = figma.currentPage.selection.map(async element => {
      const buffer = await element.exportAsync({ format: 'SVG' })
      return ab2str(buffer)
    })

    const arr = await Promise.all(selection)
    const data = convertToElm(arr.join('\n'))
    figma.showUI(__html__)
    figma.ui.postMessage({ type: 'show-code', data })
  } catch (err) {
    console.error(err)
    figma.closePlugin()
  }
})()
