/**
 * @authow Defferson.Cheng
 * 用于流程图的编辑。
 */
import i18n from '../../src/language/index'
import { EPMessage } from '../../@eigpay/com/package/message/index'

const t = i18n.global.t

export function nodeload() {
  const flowControl = (window.flowControl = { isChanged: false })
  /**    样式以及配置开始      */

  // 连接线基本样式
  const defaultcolor = '#7fb82d'
  const falsecolor = '#fe883a'
  const truecolor = '#fe883a'
  const startendcolor = '#2ea1f0'
  const outlinecolor = '#fbfbfb'
  const connectorBaseStyle = {
    lineWidth: 2,
    strokeStyle: defaultcolor,
    joinStyle: 'round',
    outlineColor: outlinecolor,
    outlineWidth: 0
  }
  const connectorStartEndStyle = $.extend($.extend({}, connectorBaseStyle), {
    strokeStyle: startendcolor
  })
  const connectorTrueStyle = $.extend($.extend({}, connectorBaseStyle), {
    strokeStyle: truecolor
  })
  const connectorFalseStyle = $.extend($.extend({}, connectorBaseStyle), {
    strokeStyle: falsecolor
  })
  // 鼠标悬浮在连接线上的样式
  const connectorHoverStyle = {
    lineWidth: 3
  }

  const paintBaseStyle = {
    strokeStyle: defaultcolor,
    fillStyle: defaultcolor,
    radius: 2,
    lineWidth: 2
  }
  const paintStartEndStyle = $.extend($.extend({}, paintBaseStyle), {
    strokeStyle: startendcolor,
    fillStyle: startendcolor
  })

  const paintTrueStyle = $.extend($.extend({}, paintBaseStyle), {
    strokeStyle: truecolor,
    fillStyle: truecolor
  })
  const paintFalseStyle = $.extend($.extend({}, paintBaseStyle), {
    strokeStyle: falsecolor,
    fillStyle: falsecolor
  }) // 端点的色彩样式
  const baseArrowOverlay = [['Arrow', { width: 10, length: 10, location: 1 }]]
  const connector = [
    'Flowchart',
    {
      stub: [5, 15],
      gap: 4,
      cornerRadius: 5,
      alwaysRespectStubs: true
    }
  ] // 连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]

  const baseStyleSet = {
    endpoint: ['Dot', { radius: 1 }], // 端点的外形
    connectorStyle: connectorBaseStyle, // 连接线的色彩,大小样式
    connectorHoverStyle,
    paintStyle: paintBaseStyle, // 端点的色彩样式
    // anchor: "AutoDefault",
    isSource: true, // 是否可以拖动(作为连线出发点)
    connector,
    isTarget: true, // 是否可以放置(连线终点)
    maxConnections: -1, // 设置连接点最多可以连接几条线
    connectorOverlays: baseArrowOverlay
  }
  const startEndSet = $.extend($.extend({}, baseStyleSet), {
    connectorStyle: connectorStartEndStyle, // 连接线的色彩,大小样式
    paintStyle: paintStartEndStyle // 端点的色彩样式
  })
  const trueStyleSet = $.extend($.extend({}, baseStyleSet), {
    connectorStyle: connectorTrueStyle, // 连接线的色彩,大小样式
    paintStyle: paintTrueStyle, // 端点的色彩样式
    customerType: 'TRUE'
  })
  const falseStyleSet = $.extend($.extend({}, baseStyleSet), {
    connectorStyle: connectorFalseStyle, // 连接线的色彩,大小样式
    paintStyle: paintFalseStyle, // 端点的色彩样式
    customerType: 'FALSE'
  })
  const dragGrid = [10, 10]
  /**    样式以及配置结束      */
  const nodeIdPrefix = 'node-' // NodeDOMID 前缀
  const nodeIdSuffix = '-from-seq' // NodeDOMID 后缀
  const defaultOffestLeft = 50
  //    var defaultLineHeight=180;
  const defaultGridHeight = 180
  const defaultGridWidth = 180
  /**  */
  const bindLinkNode = function (nodeType, nodeId) {
    // 用jsPlumb添加锚点
    if (nodeType == 1) {
      jsPlumb.addEndpoint(
        nodeId,
        { anchors: 'BottomCenter' },
        $.extend($.extend({}, startEndSet), {
          isTarget: false,
          maxConnections: 1
        })
      )
    } else if (nodeType == 2) {
      jsPlumb.addEndpoint(
        nodeId,
        { anchors: 'TopCenter' },
        $.extend($.extend({}, startEndSet), {
          isSource: false
        })
      )
    } else if (nodeType != 4) {
      jsPlumb.addEndpoint(
        nodeId,
        { anchors: 'TopCenter' },
        $.extend($.extend({}, baseStyleSet), {
          isSource: false
        })
      )
      jsPlumb.addEndpoint(
        nodeId,
        { anchors: 'BottomCenter' },
        $.extend($.extend({}, baseStyleSet), {
          isTarget: false,
          maxConnections: 1
        })
      )
    } else {
      jsPlumb.addEndpoint(
        nodeId,
        { anchors: 'TopCenter' },
        $.extend($.extend({}, baseStyleSet), {
          isSource: false
        })
      )
      jsPlumb.addEndpoint(
        nodeId,
        { anchors: 'RightMiddle' },
        $.extend($.extend({}, falseStyleSet), {
          isTarget: false,
          maxConnections: 1
        })
      )
      jsPlumb.addEndpoint(
        nodeId,
        { anchors: 'BottomCenter' },
        $.extend($.extend({}, trueStyleSet), {
          isTarget: false,
          maxConnections: 1
        })
      )
    }
    jsPlumb.draggable(nodeId)
  }
  let idIndex = 0
  $(document).ready(() => {
    // 添加图片图标
    // DONE 添加每一个节点的icon图标

    $('.node-list>.node[nodecode]').each(function () {
      const imageUrl = new URL(
        `../assets/img/flowcontrol/${$(this).attr('nodeicon')}.png`,
        import.meta.url
      ).href
      $(this).prepend($(`<img class="ico" src="${imageUrl}"/>`))
    })
    // 添加判断节点的菱形背景（使用正方形旋转45得到，有可能导致一定的浏览器兼容问题。
    // 可以尝试使用svg画板来定义菱形。
    $('.node[nodetype="4"]').prepend($('<div class="bg"></div>'))
    // 添加可拖动的效果

    $('.node-list')
      .children()
      .draggable({
        // revert: "valid",//拖动之后原路返回
        helper: 'clone', // 复制自身
        grid: dragGrid, // 拖动的网格（类似于吸附）
        scope: 'dragflag', // droppable标识
        start(e, ui) {
          // 用于对抗拖出窗口不可见的情况 根源来于overflow auto 和overflow visible 两种属性的绝对冲突。
          ui.helper.addClass('in-board').appendTo(ui.helper.parent().parent())
          const nodeType = $(this).attr('nodetype')
          if (nodeType == 1 || nodeType == 2) ui.helper.find('img.ico').remove()
        }
      })
    const $container = $('#flowEditPanel')
    // 添加拖动完成的放置play
    $container.droppable({
      accept: '.node', // 只接受来自类.dragable的元素
      activeClass: 'drop-active', // 开始拖动时放置区域显示
      scope: 'dragflag',
      drop(event, ui) {
        idIndex += 1
        // 落点坐标
        const position = {
          left: parseInt(ui.offset.left - $(this).offset().left),
          top:
            parseInt(ui.offset.top - $(this).offset().top) +
            $container.scrollTop(),
          position: 'absolute'
        }
        const newId = `${'node' + '-'}${idIndex}`

        // 在div内append元素
        const nodeType = $(ui.helper).attr('nodeType')
        // 使用clone导致不可拖拽。
        /* var $newShape=ui.helper.clone().attr("id",newId).appendTo($container);*/
        const $newShape = $(
          `<div class="node in-board" >${$(ui.helper).html()}</div>`
        )
          .attr('nodetype', nodeType)
          .attr('nodeid', $(ui.helper).attr('nodeid'))
          .css(position)
          .attr('id', newId)
          .appendTo(this)
        bindLinkNode(nodeType, newId)
        $newShape.draggable({
          grid: dragGrid,
          containment: 'parent',
          stop(event, ui) {
            flowControl.isChanged = true
          }
        })
        flowControl.isChanged = true
      }
    })

    // 添加删除图标
    $container.on('mouseenter', '.node', function () {
      const imageUrl = new URL(
        `../assets/img/flowcontrol/delete.png`,
        import.meta.url
      ).href
      const $img = $(
        '<img class=\'delete\' style=" z-index: 10;position:absolute;width:24px; "/>'
      )
        .attr('src', imageUrl)
        .appendTo(this)
      const nodeType = $(this).attr('nodetype')
      // 因为流程图的形状不一样,所以要获取特定的流程图名称来指定删除按钮的位置
      if (nodeType == 1 || nodeType == 2) {
        $img.css('right', -0).css('top', 0)
      } else if (nodeType == 4) {
        $img.css('right', 0).css('top', 0)
      } else {
        $img.css('right', -0).css('top', 0)
      }
    })
    $container.on('mouseleave', '.node', () => {
      $('img.delete').remove()
    })
    $container.on('click', 'img.delete', function () {
      // 要先保存父元素的DOM,因为出现确认对话框之后(this)会消失
      const $p = $(this).parent()
      const pId = $p.attr('id')
      jsPlumb.removeAllEndpoints(pId)
      $p.remove()
      flowControl.isChanged = true
    })
    // 删除连接线
    jsPlumb.bind('dblclick', (conn /*, originalEvent*/) => {
      jsPlumb.detach(conn)
      flowControl.isChanged = true
    })
    jsPlumb.bind('connection', (conn) => {
      flowControl.isChanged = true
    })
  })
  flowControl.clearEditBoard = function () {
    // 以下5行用于清空画板上的node以及锚点。
    const $container = $('#flowEditPanel')
    $container.children('.node').each(function () {
      jsPlumb.removeAllEndpoints($(this))
    })
    // 清除锚点也可以用以下的语句实现：
    $('#flowEditPanel')
      .children('.node')
      .each(function () {
        jsPlumb.removeAllEndpoints($(this))
      })
    const conns = jsPlumb.getAllConnections().jsPlumb_DefaultScope // 默认的jsplumb命名空间（scope），如果不是这个可以修改短，
    if (conns) conns.splice(0, conns.length)
    $container.empty()
    return $container
  }
  /**
   * 说明：方法作用 加载JSON串或者对象进行反序列化
   * JSON格式请参照webapp/adminStatic/js/flowcontrol/flowcontrol-json-demo.js下的demo
   * 调用方法：window.flowControl.loadJSON(jsonStr:string|FlowNodeMiddle[]);
   *
   * 修改规则，数据中连接字段next_sequence[_true|_false]改为序号 node_sequence-2017年2月8日17:34:38
   *
   */
  flowControl.loadJSON = function (jsonStr, autoLayout) {
    flowControl.isLoadSuccess = false
    const $container = flowControl.clearEditBoard()

    if (autoLayout == null) autoLayout = true

    const list = typeof jsonStr == 'string' ? $.parseJSON(jsonStr) : jsonStr
    // 先排序--修改逻辑使得排序变得没有必要 2017年2月9日17:28:09
    /* for(var i=0;i<list.length;i++){
        	for(var j=i+1;j<list.length;j++){
        		if (list[j].nextSequence==list[i].id||list[j].nextSequenceFalse==list[i].id||list[j].nextSequenceTrue==list[i].id){
        			var t=list[j];
        			list[j]=list[i];
        			list[i]=t;
        		}
        	}
        }*/
    // 寻找节点类型
    for (var i = 0; i < list.length; i++) {
      var nodeId = list[i].nodeId
      const $node = $(`.node-list>.node[nodeId='${nodeId}']`)
      if ($node.length == 0)
        throw new Error(`未定义的节点类型：node.id=${nodeId}`)
      const nodeType = $node.attr('nodetype')
      list[i].nodeType = nodeType
      list[i].title = $node.attr('title')
      list[i].name = $node.html()
    }

    const connList = []
    // noinspection JSDuplicatedDeclaration

    const lineMax = parseInt($container.width() / defaultGridWidth)
    let lineIndex = 0
    let isRevent = false
    for (var i = 0; i < list.length; i++) {
      const nodeObj = list[i]
      var nodeId = nodeObj.nodeId
      const nodeDOMId = nodeIdPrefix + nodeObj.nodeSequence + nodeIdSuffix
      const position = { position: 'absolute' }
      if (autoLayout) {
        // 落点坐标
        let nodeOffsetTop =
          (defaultGridHeight - (nodeObj.nodeType == 4 ? 120 : 54)) / 2
        var nodeOffsetLeft
        nodeOffsetTop += lineIndex * defaultGridHeight
        if (!isRevent) {
          nodeOffsetLeft = (i % lineMax) * defaultGridWidth + defaultOffestLeft
        } else {
          nodeOffsetLeft =
            (lineMax - (i % lineMax) - 1) * defaultGridWidth + defaultOffestLeft
        }
        position.left = nodeOffsetLeft
        position.top = nodeOffsetTop
        if ((i + 1) % lineMax == 0) {
          lineIndex++
          isRevent = !isRevent
        }
      } else {
        position.left = nodeObj.axisX
        position.top = nodeObj.axisY
      }
      {
        // 在div内append元素
        // 使用clone导致不可拖拽。
        /* var $newShape=ui.helper.clone().attr("id",newId).appendTo($container);*/
        const $newShape = $(`<div class="node in-board" >${nodeObj.name}</div>`)
          .attr('nodetype', nodeObj.nodeType)
          .attr('nodeid', nodeId)
          .css(position)
          .attr('title', nodeObj.title)
          .attr('id', nodeDOMId)
          .appendTo($container)
          .attr('objId', nodeObj.id)
        if (nodeObj.nodeType == 1 || nodeObj.nodeType == 2)
          $newShape.find('img.ico').remove()
        bindLinkNode(nodeObj.nodeType, nodeDOMId)
        $newShape.draggable({
          grid: dragGrid,
          containment: 'parent',
          stop(event, ui) {
            flowControl.isChanged = true
          }
        })
      }
      // 添加链接
      if (nodeObj.nodeType == 1 || nodeObj.nodeType == 2) {
        if (nodeObj.nextSequence) {
          connList.push({
            targetIds: {
              source: nodeDOMId,
              target: nodeIdPrefix + nodeObj.nextSequence + nodeIdSuffix
            },
            options: $.extend($.extend({}, startEndSet), {
              anchors: ['BottomCenter', 'TopCenter'],
              endpoint: 'Blank',
              overlays: baseArrowOverlay
            })
          })
        }
      } else if (nodeObj.nodeType != 4) {
        // 正常节点
        if (nodeObj.nextSequence) {
          connList.push({
            targetIds: {
              source: nodeDOMId,
              target: nodeIdPrefix + nodeObj.nextSequence + nodeIdSuffix
            },
            options: $.extend($.extend({}, baseStyleSet), {
              anchors: ['BottomCenter', 'TopCenter'],
              endpoint: 'Blank',
              overlays: baseArrowOverlay
            })
          })
        }
      } else {
        // 判断节点
        if (nodeObj.nextSequenceTrue) {
          connList.push({
            targetIds: {
              source: nodeDOMId,
              target: nodeIdPrefix + nodeObj.nextSequenceTrue + nodeIdSuffix
            },
            options: $.extend($.extend({}, trueStyleSet), {
              anchors: ['BottomCenter', 'TopCenter'],
              endpoint: 'Blank',
              overlays: baseArrowOverlay
            })
          })
        }
        if (nodeObj.nextSequenceFalse) {
          connList.push({
            targetIds: {
              source: nodeDOMId,
              target: nodeIdPrefix + nodeObj.nextSequenceFalse + nodeIdSuffix
            },
            options: $.extend($.extend({}, falseStyleSet), {
              anchors: ['RightMiddle', 'TopCenter'],
              endpoint: 'Blank',
              overlays: baseArrowOverlay
            })
          })
        }
      }
    }
    // noinspection JSDuplicatedDeclaration
    for (var i = 0; i < connList.length; i++) {
      jsPlumb.connect(connList[i].targetIds, connList[i].options)
    }
    flowControl.isChanged = false // 刷新是否更改标志
    flowControl.isLoadSuccess = true
  }
  /**
   * 序列化流程图
   * 顺便会校验
   * 其中校验失败的结果为抛出异常，如需要判断异常信息可以修改其中扔出的异常，添加异常代码。
   * 修改规则，数据中连接字段next_sequence[_true|_false]改为序号 node_sequence-2017年2月8日17:34:38
   * @return (An Object extends FlowNodeMiddle)[]
   * 注：返回的id不是数据库中的主外键id 以及nextsequence以及nextSequenceTrue以及nextSequenceFalse为nodeSequence字段
   * 这里倒是可以保证这四个字段的值为数字
   */
  flowControl.serialize = function () {
    const nodes = [] // 队列 返回值
    const $container = $('#flowEditPanel')
    const $nodes = $container.children('.node')
    // 获取所有连接
    const connections = (function () {
      const res = []
      const connections = jsPlumb.getAllConnections()
      for (const i in connections) {
        // i="jsPlumb_DefaultScope"
        // noinspection JSUnfilteredForInLoop
        for (let j = 0; j < connections[i].length; j++) {
          // noinspection JSUnfilteredForInLoop
          const connection = connections[i][j] // jsPlumb.Connection
          res.push({
            customerType: connection.customerType,
            sourceId: connection.sourceId,
            targetId: connection.targetId
          })
        }
      }
      return res
    })()
    // 判断一个节点是否存在于当前队列中
    const isExistInSeq = function (nodeDOMId) {
      for (const i in nodes) {
        if (nodes[i].domId == nodeDOMId) return true
      }
      return false
    }
    let index = 0
    // 定义添加节点的方法，该方法顺便做了点校验，做了寻找该节点下一个的处理。
    function pushNode($node) {
      const nodeType = $node.attr('nodetype')
      const nodeDOMId = $node.attr('id')
      let next = null
      let nextT = null
      let nextF = null
      let isFoundNext = false
      for (let i = 0; i < connections.length; i++) {
        if (connections[i].sourceId == nodeDOMId) {
          isFoundNext = true
          if (nodeType == 4) {
            // 判断
            if (connections[i].customerType == 'TRUE') {
              if (nextT != null)
                throw EPMessage.error(flowControl.errorTable['01'])
              nextT = connections[i].targetId
            } else if (connections[i].customerType == 'FALSE') {
              if (nextF != null)
                throw EPMessage.error(flowControl.errorTable['02'])
              nextF = connections[i].targetId
            } else throw EPMessage.error(flowControl.errorTable['03'])
          } else if (nodeType == 2) {
            // 结束
            throw EPMessage.error(flowControl.errorTable['04']) // 结束节点不能有出口
          } else {
            if (next != null)
              throw EPMessage.error(flowControl.errorTable['05'])
            next = connections[i].targetId
          }
        }
      }
      if (!isFoundNext && nodeType != 2)
        throw EPMessage.error(flowControl.errorTable['17']) // 没有出口
      // 同一个节点不能同时有两个入口的校验
      /* for(var i=0;i<nodes.length;i++){
                  if (nodes[i].nextSequenceTrueDOMId!=null&&null!=next&&nodes[i].nextSequenceTrueDOMId==next
                      ||nodes[i].nextSequenceTrueDOMId!=null&&nextT!=null&&nodes[i].nextSequenceTrueDOMId==nextT
                      ||nodes[i].nextSequenceTrueDOMId!=null&&nextF!=null&&nodes[i].nextSequenceTrueDOMId==nextF
                      ||nodes[i].nextSequenceDOMId!=null&&next!=null&&nodes[i].nextSequenceDOMId==next
                      ||nodes[i].nextSequenceDOMId!=null&&nextT!=null&&nodes[i].nextSequenceDOMId==nextT
                      ||nodes[i].nextSequenceDOMId!=null&&nextF!=null&&nodes[i].nextSequenceDOMId==nextF
                      ||nodes[i].nextSequenceFalseDOMId!=null&&next!=null&&nodes[i].nextSequenceFalseDOMId==next
                      ||nodes[i].nextSequenceFalseDOMId!=null&&nextT!=null&&nodes[i].nextSequenceFalseDOMId==nextT
                      ||nodes[i].nextSequenceFalseDOMId!=null&&nextF!=null&&nodes[i].nextSequenceFalseDOMId==nextF
                      )
                    throw EPMessage.error(flowControl.errorTable['16'])
                }*/
      nodes.push({
        id: $node.attr('id').split('-')[1],
        domId: $node.attr('id'),
        oId: $node.attr('objId'),
        nodeId: $node.attr('nodeid'),
        nodeType: $node.attr('nodetype'),
        nodeSequence: index++,
        nextSequenceTrueDOMId: nextT == null ? null : nextT,
        nextSequenceFalseDOMId: nextF == null ? null : nextF,
        nextSequenceDOMId: next == null ? null : next,
        axisX: $node.css('left').replace('px', ''),
        axisY: $node.css('top').replace('px', '')
      })
      return nodes
    } // pushNode-End
    let currentIndex = 0
    let isEndNodeFound = false
    // 类似于宽度优先搜索，使用队列nodes，指针currentIndex
    // 使用此种算法的理由为该算法得出的顺序接近实际的流程顺序。
    const findNext = function () {
      if (currentIndex == 0 && nodes.length == 0) {
        // 第一次进入循环
        const firstNodeId = (function findFirstNodeDomId() {
          let resNodeId = null
          // 寻找没有作为结束标记的节点
          for (let i = 0; i < $nodes.length; i++) {
            let isnotbeenend = true
            let isbeenstart = false
            const $node = $nodes.eq(i)
            const nodeId = $node.attr('id')
            for (let j = 0; j < connections.length; j++) {
              if (connections[j].targetId == nodeId) {
                isnotbeenend = false
              } else if (connections[j].sourceId == nodeId) {
                isbeenstart = true
              }
            }
            if (isnotbeenend && isbeenstart) {
              if ($node.attr('nodeType') != '1')
                throw EPMessage.error(flowControl.errorTable['10'])
              if (resNodeId != null)
                throw EPMessage.error(flowControl.errorTable['11'])
              resNodeId = nodeId
            }
          }
          if (resNodeId == null)
            throw EPMessage.error(flowControl.errorTable['13'])
          else return resNodeId
        })()
        pushNode($nodes.filter(`#${firstNodeId}`))
      } else {
        // 不是第一次
        const currNode = nodes[currentIndex]
        if (currNode.nodeType == 4) {
          // 判断
          if (!isExistInSeq(currNode.nextSequenceFalseDOMId))
            pushNode($nodes.filter(`#${currNode.nextSequenceFalseDOMId}`))
          if (!isExistInSeq(currNode.nextSequenceTrueDOMId))
            pushNode($nodes.filter(`#${currNode.nextSequenceTrueDOMId}`))
        } else if (currNode.nodeType == 2) {
          // 结束
          isEndNodeFound = true
          // 结束节点没有下一个。
        } else {
          // 正常节点
          if (!isExistInSeq(currNode.nextSequenceDOMId))
            pushNode($nodes.filter(`#${currNode.nextSequenceDOMId}`))
        }
        currentIndex++
      }
    } // findNext() end
    do findNext()
    while (currentIndex < nodes.length)
    if (!isEndNodeFound) throw EPMessage.error(flowControl.errorTable['12'])
    // 孤岛校验
    $nodes.each(function () {
      const nodeDOMId = $(this).attr('id')
      if (!isExistInSeq(nodeDOMId))
        throw EPMessage.error(flowControl.errorTable['15'])
    })
    // 返回nodes之前要把DOMid变成nodeSequence
    const result = []
    for (const i in nodes) {
      let nextSequenceTrue = null
      let nextSequenceFalse = null
      let nextSequence = null
      if (nodes[i].nextSequenceTrueDOMId) {
        for (var j in nodes) {
          if (nodes[j].domId == nodes[i].nextSequenceTrueDOMId) {
            nextSequenceTrue = nodes[j].nodeSequence
            break
          }
        }
      }
      if (nodes[i].nextSequenceFalseDOMId) {
        for (var j in nodes) {
          if (nodes[j].domId == nodes[i].nextSequenceFalseDOMId) {
            nextSequenceFalse = nodes[j].nodeSequence
            break
          }
        }
      }
      if (nodes[i].nextSequenceDOMId) {
        for (var j in nodes) {
          if (nodes[j].domId == nodes[i].nextSequenceDOMId) {
            nextSequence = nodes[j].nodeSequence
            break
          }
        }
      }
      result.push({
        // id: nodes[i].id,
        nodeId: nodes[i].nodeId,
        nodeType: nodes[i].nodeType,
        nodeSequence: nodes[i].nodeSequence,
        nextSequenceTrue,
        nextSequenceFalse,
        nextSequence,
        axisX: nodes[i].axisX,
        axisY: nodes[i].axisY
      })
    }
    return result
  }
  flowControl.serializeJSON = function () {
    return JSON.stringify(this.serialize())
  }
  flowControl.formatNodes = function () {
    this.loadJSON(this.serialize())
    this.isChanged = true
  }
  flowControl.errorTable = {
    '01': t('itConfiguration.IT0367'),
    '02': t('itConfiguration.IT0368'),
    '03': t('itConfiguration.IT0369'),
    '04': t('itConfiguration.IT0370'),
    '05': t('itConfiguration.IT0371'),
    '06': t('itConfiguration.IT0372'),
    '07': t('itConfiguration.IT0373'),
    '09': t('itConfiguration.IT0374'),
    10: t('itConfiguration.IT0375'),
    11: t('itConfiguration.IT0376'),
    12: t('itConfiguration.IT0377'),
    13: t('itConfiguration.IT0378'),
    14: t('itConfiguration.IT0379'), // 该错误作废
    15: t('itConfiguration.IT0380'),
    16: t('itConfiguration.IT0381'), // 这个规则由业务决定
    17: t('itConfiguration.IT0382') // 补充
  }
}
