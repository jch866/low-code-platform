import { computed } from 'vue'
export default function useWatermarkBg(props) {
  return computed(() => {
    // 创建一个 canvas
    const canvas = document.createElement('canvas')
    //当前显示设备的物理像素分辨率和CSS像素分辨率之间的比率
    const devicePixelRatio = window.devicePixelRatio || 1
    // 设置字体大小
    const fontSize = props.fontSize * devicePixelRatio
    const font = fontSize + 'px serif'
    //绘制2D图形的上下文对象
    const textCanvas = canvas.getContext('2d')
    // 获取文字宽度
    textCanvas.font = font
    //返回一个包含文本宽度信息的对象
    const { width } = textCanvas.measureText(props.text)
    //确定Canvas元素的尺寸，确保在不同设备上绘制的内容具有一致的大小和比例。
    const canvasSize = Math.max(100, width) + props.gap * devicePixelRatio
    canvas.width = canvasSize
    canvas.height = canvasSize
    textCanvas.translate(canvas.width / 2, canvas.height / 2)
    // 旋转 45 度让文字变倾斜
    textCanvas.rotate((Math.PI / 180) * -45)
    textCanvas.fillStyle = 'rgba(0, 0, 0, 0.3)'
    textCanvas.font = font
    textCanvas.textAlign = 'center'
    textCanvas.textBaseline = 'middle'
    // 将文字画出来
    textCanvas.fillText(props.text, 0, 0)
    return {
      base64: canvas.toDataURL(),
      size: canvasSize,
      styleSize: canvasSize / devicePixelRatio
    }
  })
}
