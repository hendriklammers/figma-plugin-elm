import convertToElm from 'html-elm'

// figma.showUI(__html__)
//
// figma.ui.onmessage = msg => {
//   if (msg.type === 'create-rectangles') {
//     const nodes = []
//
//     for (let i = 0; i < msg.count; i++) {
//       const rect = figma.createRectangle()
//       rect.x = i * 150
//       rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }]
//       figma.currentPage.appendChild(rect)
//       nodes.push(rect)
//     }
//
//     figma.currentPage.selection = nodes
//     figma.viewport.scrollAndZoomIntoView(nodes)
//   }
//
//   figma.closePlugin()
// }

const ab2str = (buffer: ArrayBuffer) =>
  String.fromCharCode.apply(null, new Uint16Array(buffer))

// Exit plugin when nothing is selected
if (figma.currentPage.selection.length < 1) {
  figma.closePlugin()
}

;(async () => {
  const selection = figma.currentPage.selection.map(async selected => {
    const buffer = await selected.exportAsync({ format: 'SVG' })
    return ab2str(buffer)
  })

  const arr = await Promise.all(selection)
  const elm = convertToElm(arr.join('\n'))
  console.log(elm)
})()

figma.closePlugin()

// selected.exportAsync({ format: 'SVG' }).then(svgCode => {
//   const svg = ab2str(svgCode)
//   console.log(svg)
// figma.showUI(__html__, { visible: false })
// figma.ui.postMessage({ type: 'networkRequest', data: svg })
// figma.ui.onmessage = async msg => {
//   figma.showUI(__html__, { visible: true })
//   figma.ui.postMessage({ type: 'show-ui', data: msg })
// }
// })
