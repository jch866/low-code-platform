/**
 * 用于流程控制的json样例
 */
/**
 * Created by dcpho on 2017/1/17.
 *
 */
/**
 id v   code    name    dealType nodeservicename    nodeType    remark  isdel   creatrTime  midifieDateTime
 1	1	start	开始节点	1	startNodeBusinessProvider	1	开始节点	0	2017-01-11 00:00:00	2017-01-11 00:00:00
 2	1	end	结束节点	1	endNodeBusinessProvider	2	结束节点	0	2017-01-11 00:00:00	2017-01-11 00:00:00
 3	1	simpleCode1	节点1	2	recvNodeBusinessProvider	3	普通任务节点	0	2017-01-11 00:00:00	2017-01-11 00:00:00
 4	1	choiceNode	节点4	1	tranNodeBusinessProvider	4	普通选择节点	0	2017-01-11 00:00:00	2017-01-11 00:00:00
 5	1	simpleCode2	节点2	1	tranNodeBusinessProvider	3	普通任务节点	0	2017-01-11 00:00:00	2017-01-11 00:00:00
 6	1	simpleCode3	节点3	1	recvNodeBusinessProvider	3	普通任务节点	0	2017-01-11 00:00:00	2017-01-11 00:00:00
 * @type {[*]}
 */
const jsonIn = [
  {
    id: 1, flowId: 1, nodeId: 1, nodeSequence: 1, nextSequenceTrue: null, nextSequenceFalse: null, nextSequence: 2
  },
  {
    id: 2, flowId: 1, nodeId: 3, nodeSequence: 2, nextSequenceTrue: null, nextSequenceFalse: null, nextSequence: 3
  },
  {
    id: 3, flowId: 1, nodeId: 4, nodeSequence: 3, nextSequenceTrue: 5, nextSequenceFalse: 4, nextSequence: null
  },
  {
    id: 4, flowId: 1, nodeId: 5, nodeSequence: 4, nextSequenceTrue: null, nextSequenceFalse: null, nextSequence: 5
  },
  {
    id: 5, flowId: 1, nodeId: 6, nodeSequence: 5, nextSequenceTrue: null, nextSequenceFalse: null, nextSequence: 6
  },
  {
    id: 6, flowId: 1, nodeId: 2, nodeSequence: 6, nextSequenceTrue: null, nextSequenceFalse: null, nextSequence: null
  }
];
