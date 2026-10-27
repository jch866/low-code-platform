<template>
  <ep-tree
    ref="treeRef"
    :data="data"
    show-checkbox
    node-key="menuId"
    highlight-current
    :props="defaultProps"
  />
</template>

<script setup>
import { ref } from 'vue'

const treeRef = ref()

const defaultProps = {
  children: 'children',
  label: 'menuName'
}

const data = [
  {
    language: 'zh_cn',
    menuId: '340000000000836292003',
    menuName: '商户平台',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000836293002',
        menuName: '查询中心',
        parentMenuId: '340000000000836292003',
        disabled: true,
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836294005',
            menuName: '商户管理',
            parentMenuId: '340000000000836293002'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836295004',
            menuName: '分店管理',
            parentMenuId: '340000000000836293002'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836296007',
            menuName: '大特店管理',
            parentMenuId: '340000000000836293002'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836297006',
            menuName: '次特店管理',
            parentMenuId: '340000000000836293002'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000836298009',
        menuName: '进件中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836300009',
            menuName: '分店进件管理',
            parentMenuId: '340000000000836298009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836302001',
            menuName: '大特店进件管理',
            parentMenuId: '340000000000836298009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836303000',
            menuName: '次特店进件管理',
            parentMenuId: '340000000000836298009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000884164000',
            menuName: '商户进件管理',
            parentMenuId: '340000000000836298009'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000836304003',
        menuName: '复核中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836305002',
            menuName: '商户复核管理',
            parentMenuId: '340000000000836304003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836306005',
            menuName: '分店复核管理',
            parentMenuId: '340000000000836304003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836307004',
            menuName: '大特店复核管理',
            parentMenuId: '340000000000836304003'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000836308001',
        menuName: '变更中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836309000',
            menuName: '商户变更管理',
            parentMenuId: '340000000000836308001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836310008',
            menuName: '分店变更管理',
            parentMenuId: '340000000000836308001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836311009',
            menuName: '大特店变更管理',
            parentMenuId: '340000000000836308001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836312000',
            menuName: '次特店变更管理',
            parentMenuId: '340000000000836308001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967485006',
            menuName: '审核变更管理',
            parentMenuId: '340000000000836308001'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000836313001',
        menuName: '审核中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836314002',
            menuName: '商户审核管理',
            parentMenuId: '340000000000836313001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836315003',
            menuName: '分店审核管理',
            parentMenuId: '340000000000836313001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836316004',
            menuName: '大特店审核管理',
            parentMenuId: '340000000000836313001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836317005',
            menuName: '次特店审核管理',
            parentMenuId: '340000000000836313001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853162002',
            menuName: '担保品审核管理',
            parentMenuId: '340000000000836313001'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000836319001',
        menuName: '产品中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836320001',
            menuName: '产品管理',
            parentMenuId: '340000000000836319001'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000836321000',
        menuName: '伙伴中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836322009',
            menuName: '商户拓展商管理',
            parentMenuId: '340000000000836321000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836324005',
            menuName: '合作银行管理',
            parentMenuId: '340000000000836321000'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000836325004',
        menuName: '服务中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836326003',
            menuName: '事件管理',
            parentMenuId: '340000000000836325004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836327002',
            menuName: '工单管理',
            parentMenuId: '340000000000836325004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000865308007',
            menuName: '事件处理管理',
            parentMenuId: '340000000000836325004'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000836328003',
        menuName: '解约中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836329002',
            menuName: '商户解约管理',
            parentMenuId: '340000000000836328003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836330000',
            menuName: '分店解约管理',
            parentMenuId: '340000000000836328003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836331001',
            menuName: '大特店终止管理',
            parentMenuId: '340000000000836328003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000912328004',
            menuName: '次特店终止管理',
            parentMenuId: '340000000000836328003'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000836332008',
        menuName: '复审中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000836333009',
            menuName: '商户复审管理',
            parentMenuId: '340000000000836332008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836334004',
            menuName: '分店复审管理',
            parentMenuId: '340000000000836332008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000836335005',
            menuName: '大特店复审管理',
            parentMenuId: '340000000000836332008'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853227004',
        menuName: '资产中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853228001',
            menuName: '担保品管理',
            parentMenuId: '340000000000853227004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853229000',
            menuName: '物料管理',
            parentMenuId: '340000000000853227004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853230008',
            menuName: '商户归档管理',
            parentMenuId: '340000000000853227004'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000967486005',
        menuName: '参数配置中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000967487004',
            menuName: '担保品到期提醒参数配置管理',
            parentMenuId: '340000000000967486005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967488001',
            menuName: '物料信息配置管理',
            parentMenuId: '340000000000967486005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967489000',
            menuName: '费用类型参数配置管理',
            parentMenuId: '340000000000967486005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133248009',
            menuName: '端末机信息配置管理',
            parentMenuId: '340000000000967486005'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001087113000',
        menuName: '工具中心',
        parentMenuId: '340000000000836292003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001087114003',
            menuName: 'P&L Model',
            parentMenuId: '340000000001087113000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087115002',
            menuName: 'JCIC查询',
            parentMenuId: '340000000001087113000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087116005',
            menuName: '表单列印',
            parentMenuId: '340000000001087113000'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001133243002',
        menuName: '首页',
        parentMenuId: '340000000000836292003'
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000000853153004',
    menuName: '结算平台',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000853164000',
        menuName: '对账中心',
        parentMenuId: '340000000000853153004',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853169011',
            menuName: 'FISC对账信息',
            parentMenuId: '340000000000853164000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853198009',
            menuName: 'DCC奖励金信息管理',
            parentMenuId: '340000000000853164000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853199008',
            menuName: 'PP结算文件',
            parentMenuId: '340000000000853164000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853200001',
            menuName: 'UPOP对账信息',
            parentMenuId: '340000000000853164000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853201000',
            menuName: 'chargeback 信息核对',
            parentMenuId: '340000000000853164000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001103463005',
            menuName: 'PP明细信息',
            parentMenuId: '340000000000853164000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001115780002',
            menuName: 'POS对账信息',
            parentMenuId: '340000000000853164000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001115781003',
            menuName: 'POS信息审核',
            parentMenuId: '340000000000853164000'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853165001',
        menuName: '案件中心',
        parentMenuId: '340000000000853153004',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853203008',
            menuName: '案件管理',
            parentMenuId: '340000000000853165001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853204005',
            menuName: '案件处理管理',
            parentMenuId: '340000000000853165001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853205004',
            menuName: '案件审批',
            parentMenuId: '340000000000853165001'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853166008',
        menuName: '错账中心',
        parentMenuId: '340000000000853153004',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853195004',
            menuName: '通道争议错账管理',
            parentMenuId: '340000000000853166008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853196007',
            menuName: '调账管理',
            parentMenuId: '340000000000853166008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000938470006',
            menuName: '调账审批',
            parentMenuId: '340000000000853166008'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853167009',
        menuName: '结算中心',
        parentMenuId: '340000000000853153004',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853169019',
            menuName: '附言管理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853206003',
            menuName: '结算明细',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853207002',
            menuName: '结算信息源',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853254000',
            menuName: '分润管理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000925992001',
            menuName: '商户状态查询',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955105000',
            menuName: '逾期结算管理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955106009',
            menuName: '负数交易管理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955107008',
            menuName: '总净付额',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955108007',
            menuName: '退件退汇管理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955109006',
            menuName: '逾期付款日审核',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955110004',
            menuName: 'HOLD&RELEASE审核',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955111005',
            menuName: '退件退汇案件处理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955112002',
            menuName: '自然灾害管理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967484007',
            menuName: 'HOLD&RELEASE管理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967505005',
            menuName: '赈灾手续费管理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000983470006',
            menuName: '付款档文件',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087122008',
            menuName: 'Advance-逾期管理',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087123009',
            menuName: 'Advance-Release',
            parentMenuId: '340000000000853167009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001115779000',
            menuName: 'Advance-冲销',
            parentMenuId: '340000000000853167009'
          }
        ]
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000000853154009',
    menuName: '争议平台',
    parentMenuId: '0',
    disabled: true,
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000853277001',
        menuName: 'Incoming Dispute管理',
        parentMenuId: '340000000000853154009',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853281002',
            menuName: '文件解析案件',
            parentMenuId: '340000000000853277001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853282001',
            menuName: '手工录入案件',
            parentMenuId: '340000000000853277001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853283000',
            menuName: '新争议案件汇总',
            parentMenuId: '340000000000853277001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853284007',
            menuName: '案件分配',
            parentMenuId: '340000000000853277001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853285006',
            menuName: '案件确认',
            parentMenuId: '340000000000853277001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853286005',
            menuName: '通知文件生成',
            parentMenuId: '340000000000853277001'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853278004',
        menuName: '调单管理',
        parentMenuId: '340000000000853154009',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853287004',
            menuName: '调单案件汇总',
            parentMenuId: '340000000000853278004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853288001',
            menuName: '待处理调单案件',
            parentMenuId: '340000000000853278004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853290002',
            menuName: '商户响应',
            parentMenuId: '340000000000853278004'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853279005',
        menuName: '拒付管理',
        parentMenuId: '340000000000853154009',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853169020',
            menuName: '待处理拒付案件',
            parentMenuId: '340000000000853279005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853291003',
            menuName: '拒付案件汇总',
            parentMenuId: '340000000000853279005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853292000',
            menuName: '拒付撤销案件',
            parentMenuId: '340000000000853279005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853294006',
            menuName: '商户响应',
            parentMenuId: '340000000000853279005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853295007',
            menuName: '拒付反驳管理',
            parentMenuId: '340000000000853279005'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853280003',
        menuName: '内部处理案件',
        parentMenuId: '340000000000853154009'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000865309006',
        menuName: '已完成争议案件',
        parentMenuId: '340000000000853154009'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000865310004',
        menuName: '预仲裁管理',
        parentMenuId: '340000000000853154009',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000865312002',
            menuName: '待处理预仲裁案件',
            parentMenuId: '340000000000865310004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000865314000',
            menuName: '商户响应',
            parentMenuId: '340000000000865310004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000865315001',
            menuName: '预仲裁反驳',
            parentMenuId: '340000000000865310004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000865316008',
            menuName: '发卡行响应',
            parentMenuId: '340000000000865310004'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000865311005',
        menuName: '仲裁管理',
        parentMenuId: '340000000000853154009',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000865317009',
            menuName: '结论处理',
            parentMenuId: '340000000000865311005'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000865318006',
        menuName: '预合规管理Outgoing',
        parentMenuId: '340000000000853154009',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000865372000',
            menuName: '发卡行响应',
            parentMenuId: '340000000000865318006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955120003',
            menuName: '待处理预合规案件',
            parentMenuId: '340000000000865318006'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000865319007',
        menuName: '合规管理Outgoing',
        parentMenuId: '340000000000853154009',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000865365002',
            menuName: '结论处理',
            parentMenuId: '340000000000865319007'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000865320003',
        menuName: '预合规管理Incoming',
        parentMenuId: '340000000000853154009',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000865364003',
            menuName: '发卡行响应',
            parentMenuId: '340000000000865320003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955121002',
            menuName: '待处理预合规案件',
            parentMenuId: '340000000000865320003'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000865321002',
        menuName: '合规管理Incoming',
        parentMenuId: '340000000000853154009',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000865359003',
            menuName: '结论处理',
            parentMenuId: '340000000000865321002'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000938471007',
        menuName: '争议审核',
        parentMenuId: '340000000000853154009'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000967506002',
        menuName: '每月争议统计',
        parentMenuId: '340000000000853154009'
      },
      {
        language: 'zh_cn',
        menuId: '340000000001133238004',
        menuName: '报表生成页面',
        parentMenuId: '340000000000853154009'
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000000853155008',
    menuName: '财务平台',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000853168006',
        menuName: '基础信息管理',
        parentMenuId: '340000000000853155008',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853209002',
            menuName: '会计科目管理',
            parentMenuId: '340000000000853168006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853210000',
            menuName: '发票号管理',
            parentMenuId: '340000000000853168006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853219003',
            menuName: '全额开具发票',
            parentMenuId: '340000000000853168006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853220009',
            menuName: 'IRF维护',
            parentMenuId: '340000000000853168006'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853169007',
        menuName: '销项发票管理',
        parentMenuId: '340000000000853155008',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853221008',
            menuName: '开票申请',
            parentMenuId: '340000000000853169007'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853222001',
            menuName: '发票查询',
            parentMenuId: '340000000000853169007'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853223000',
            menuName: '收据查询',
            parentMenuId: '340000000000853169007'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853225002',
            menuName: '发票作废记录',
            parentMenuId: '340000000000853169007'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853226005',
            menuName: '折让单管理',
            parentMenuId: '340000000000853169007'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853169008',
        menuName: '催收管理',
        parentMenuId: '340000000000853155008'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853169009',
        menuName: '坏账管理',
        parentMenuId: '340000000000853155008'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853169010',
        menuName: '财务审批',
        parentMenuId: '340000000000853155008',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853169013',
            menuName: '我的待办',
            parentMenuId: '340000000000853169010'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853169014',
            menuName: '我的已办',
            parentMenuId: '340000000000853169010'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853169015',
            menuName: '我的申请',
            parentMenuId: '340000000000853169010'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853170005',
        menuName: '进项发票管理',
        parentMenuId: '340000000000853155008'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853171004',
        menuName: '税务管理',
        parentMenuId: '340000000000853155008'
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000000853173002',
    menuName: '业务基础平台',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000853169028',
        menuName: 'IPP合作银行管理',
        parentMenuId: '340000000000853173002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853169029',
        menuName: 'PFID信息管理',
        parentMenuId: '340000000000853173002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853174001',
        menuName: '卡BIN管理',
        parentMenuId: '340000000000853173002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853175000',
        menuName: '发卡行信息维护',
        parentMenuId: '340000000000853173002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853178007',
        menuName: '商户信息管理',
        parentMenuId: '340000000000853173002',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853169026',
            menuName: '商户基础信息',
            parentMenuId: '340000000000853178007'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853169027',
            menuName: '商户号关系维护',
            parentMenuId: '340000000000853178007'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853179006',
        menuName: '终端信息维护',
        parentMenuId: '340000000000853173002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853180000',
        menuName: '商户号类型管理',
        parentMenuId: '340000000000853173002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853181001',
        menuName: '商户产品关系管理',
        parentMenuId: '340000000000853173002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853182002',
        menuName: '交易周期管理',
        parentMenuId: '340000000000853173002',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853183003',
            menuName: '周期管理',
            parentMenuId: '340000000000853182002'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853184004',
            menuName: '次数管理',
            parentMenuId: '340000000000853182002'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853249006',
        menuName: '非交易手续费',
        parentMenuId: '340000000000853173002',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853250004',
            menuName: '非交易费用维护',
            parentMenuId: '340000000000853249006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853251005',
            menuName: '非交易费用类型维护',
            parentMenuId: '340000000000853249006'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000925987005',
        menuName: '结算配置中心',
        parentMenuId: '340000000000853173002',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000925988000',
            menuName: '商户付款周期维护',
            parentMenuId: '340000000000925987005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000925989001',
            menuName: '商户付款周期公式维护',
            parentMenuId: '340000000000925987005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000925990009',
            menuName: '逾期请款白名单维护',
            parentMenuId: '340000000000925987005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000925991008',
            menuName: '汇率转换维护',
            parentMenuId: '340000000000925987005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133246007',
            menuName: '默认汇款附言配置',
            parentMenuId: '340000000000925987005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133247006',
            menuName: '逾期交易惩罚天数配置',
            parentMenuId: '340000000000925987005'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000983461006',
        menuName: '争议参数维护',
        parentMenuId: '340000000000853173002',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000983462005',
            menuName: '卡组织回复日期配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000983463004',
            menuName: '原因码配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000983464003',
            menuName: '发起逾期期限案件配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000983465002',
            menuName: '提醒间隔天数配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000983466001',
            menuName: '收单处理日期配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000983467000',
            menuName: '商户响应截止日期配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000983468005',
            menuName: '案件最大笔数限制配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000983469004',
            menuName: '特殊商户配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001026128009',
            menuName: '笔数限制原因码配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001026129008',
            menuName: '发卡行逾期日期配置',
            parentMenuId: '340000000000983461006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133237001',
            menuName: '客制化报表配置',
            parentMenuId: '340000000000983461006'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001133241000',
        menuName: '免签额度管理',
        parentMenuId: '340000000000853173002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000001133242003',
        menuName: 'IPP分期计算配置',
        parentMenuId: '340000000000853173002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000001191953000',
        menuName: '用户权限管理',
        parentMenuId: '340000000000853173002',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001211949000',
            menuName: '用户管理',
            parentMenuId: '340000000001191953000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001211950008',
            menuName: '角色管理',
            parentMenuId: '340000000001191953000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001211951009',
            menuName: '部门管理',
            parentMenuId: '340000000001191953000'
          }
        ]
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000000853186006',
    menuName: '交易平台',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000853255001',
        menuName: '批量人工交易',
        parentMenuId: '340000000000853186006',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853261002',
            menuName: '批量人工交易查询',
            parentMenuId: '340000000000853255001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853262005',
            menuName: '批量人工交易审核',
            parentMenuId: '340000000000853255001'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853256008',
        menuName: '单笔人工交易',
        parentMenuId: '340000000000853186006',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853263004',
            menuName: '单笔人工交易查询',
            parentMenuId: '340000000000853256008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853264009',
            menuName: 'Call Bank',
            parentMenuId: '340000000000853256008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853265008',
            menuName: '商户紧急授权',
            parentMenuId: '340000000000853256008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853266001',
            menuName: '单笔人工交易审核',
            parentMenuId: '340000000000853256008'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853257009',
        menuName: '交易状态查询',
        parentMenuId: '340000000000853186006'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853258006',
        menuName: 'IPP交易管理',
        parentMenuId: '340000000000853186006',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853267000',
            menuName: 'IPP交易查询',
            parentMenuId: '340000000000853258006'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853259007',
        menuName: '交易明细查询',
        parentMenuId: '340000000000853186006',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853268005',
            menuName: '授权交易查询',
            parentMenuId: '340000000000853259007'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853269004',
            menuName: 'SAF交易查询',
            parentMenuId: '340000000000853259007'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853260003',
        menuName: '支付队列',
        parentMenuId: '340000000000853186006',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853270002',
            menuName: '3DS风险队列',
            parentMenuId: '340000000000853260003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853273005',
            menuName: '交易异常队列',
            parentMenuId: '340000000000853260003'
          }
        ]
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000000853187007',
    menuName: '风控平台',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000853238000',
        menuName: '黑名单管理',
        parentMenuId: '340000000000853187007',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853245000',
            menuName: '商户卡BIN黑名单管理',
            parentMenuId: '340000000000853238000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853247008',
            menuName: '商户卡号黑名单管理',
            parentMenuId: '340000000000853238000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853248007',
            menuName: 'MCC卡号黑名单管理',
            parentMenuId: '340000000000853238000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955102003',
            menuName: '终端交易权限黑名单管理',
            parentMenuId: '340000000000853238000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955103002',
            menuName: '终端产品权限黑名单管理',
            parentMenuId: '340000000000853238000'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853239001',
        menuName: '商户限额管理',
        parentMenuId: '340000000000853187007'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853240005',
        menuName: '滑动窗口管理',
        parentMenuId: '340000000000853187007',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853242003',
            menuName: '卡号滑动窗口管理',
            parentMenuId: '340000000000853240005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853243002',
            menuName: 'BIN滑动窗口管理',
            parentMenuId: '340000000000853240005'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001133250000',
        menuName: '伪卡管理',
        parentMenuId: '340000000000853187007',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001133251001',
            menuName: '伪卡卡号管理',
            parentMenuId: '340000000001133250000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133252002',
            menuName: '伪卡卡BIN管理',
            parentMenuId: '340000000001133250000'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001133253003',
        menuName: 'Risk Report',
        parentMenuId: '340000000000853187007',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001133254004',
            menuName: 'PMT1 Daily Exception Report',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133255005',
            menuName: 'PMT2 Daily Exception Report (New Merchant)',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133256006',
            menuName: 'PMT3 Overseas Cards',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133257007',
            menuName: 'PMT4 Large Amount',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133258008',
            menuName: 'PMT5 Same Card',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133259009',
            menuName: 'PMT6 Same Amount',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133260003',
            menuName: 'PMT7 Refund Unmatched',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133261002',
            menuName: 'PMT8 Sales Slip Exception',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133262001',
            menuName: 'PMT9 Sales Slip Exception (New Merchant)',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133263000',
            menuName: 'PMT10 Fall Back Ratio',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133264007',
            menuName: 'PMT11 High Refund',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133265006',
            menuName: 'PMT12 NEDC Ratio',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133266005',
            menuName: 'AUTH1 Key Ratio',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133267004',
            menuName: 'AUTH2 Auth Code Unmatched',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133268001',
            menuName: 'AUTH4 Auth Volume Increase',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133269000',
            menuName: 'AUTH5 Large Amount',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133270002',
            menuName: 'AUTH6 Same Card',
            parentMenuId: '340000000001133253003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133271003',
            menuName: 'EC专用监控报表',
            parentMenuId: '340000000001133253003'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001168291003',
        menuName: 'Risk Parameter',
        parentMenuId: '340000000000853187007',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001168292000',
            menuName: 'Risk Parameter（Merchant）',
            parentMenuId: '340000000001168291003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001168293001',
            menuName: 'Risk Parameter（MCC）',
            parentMenuId: '340000000001168291003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001168294006',
            menuName: 'Risk Parameter（System）',
            parentMenuId: '340000000001168291003'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001181841003',
        menuName: '审批中心',
        parentMenuId: '340000000000853187007',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001181842000',
            menuName: '审批申请',
            parentMenuId: '340000000001181841003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001181843001',
            menuName: 'Risk报表审核',
            parentMenuId: '340000000001181841003'
          }
        ]
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000000853211001',
    menuName: '请款平台',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000853169021',
        menuName: '渠道请款文件',
        parentMenuId: '340000000000853211001',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000999690001',
            menuName: '渠道请款查询',
            parentMenuId: '340000000000853169021'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853212008',
        menuName: '渠道请款',
        parentMenuId: '340000000000853211001',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853169024',
            menuName: '手刷单请款',
            parentMenuId: '340000000000853212008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853169025',
            menuName: 'POS请款',
            parentMenuId: '340000000000853212008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000938464003',
            menuName: '收付费请款',
            parentMenuId: '340000000000853212008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955169000',
            menuName: '第三方Gateway请款',
            parentMenuId: '340000000000853212008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955170008',
            menuName: 'GP Gateway请款',
            parentMenuId: '340000000000853212008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955171009',
            menuName: '门户请款',
            parentMenuId: '340000000000853212008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955172000',
            menuName: 'Re-key请款',
            parentMenuId: '340000000000853212008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955173001',
            menuName: '再请款',
            parentMenuId: '340000000000853212008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955174002',
            menuName: '取消授权',
            parentMenuId: '340000000000853212008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955175003',
            menuName: 'Reversal请款',
            parentMenuId: '340000000000853212008'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853213009',
        menuName: '预处理',
        parentMenuId: '340000000000853211001',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000853214004',
            menuName: '信息总汇查询',
            parentMenuId: '340000000000853213009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853215005',
            menuName: '检查异常处理',
            parentMenuId: '340000000000853213009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853216002',
            menuName: '商户状态异常交易处理',
            parentMenuId: '340000000000853213009'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000853217003',
            menuName: '负数交易处理',
            parentMenuId: '340000000000853213009'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000853218002',
        menuName: '通道请款',
        parentMenuId: '340000000000853211001'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000938465002',
        menuName: '请款审批',
        parentMenuId: '340000000000853211001',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000938466001',
            menuName: '手刷单请款审核',
            parentMenuId: '340000000000938465002'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000938467000',
            menuName: 'POS请款审核',
            parentMenuId: '340000000000938465002'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000938468005',
            menuName: '收付费请款审核',
            parentMenuId: '340000000000938465002'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000938469004',
            menuName: '检查异常处理审核',
            parentMenuId: '340000000000938465002'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955176004',
            menuName: 'Re-key请款审核',
            parentMenuId: '340000000000938465002'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955177005',
            menuName: 'Reversal请款审核',
            parentMenuId: '340000000000938465002'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000967494006',
        menuName: '请款参数维护',
        parentMenuId: '340000000000853211001',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000967495007',
            menuName: '文件参数管理',
            parentMenuId: '340000000000967494006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967496004',
            menuName: '逾期请款时间参数管理',
            parentMenuId: '340000000000967494006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967497005',
            menuName: 'Card Type Table参数管理',
            parentMenuId: '340000000000967494006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967498000',
            menuName: 'IPP产品编码参数管理',
            parentMenuId: '340000000000967494006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967499001',
            menuName: '小数点白名单参数管理',
            parentMenuId: '340000000000967494006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000967500000',
            menuName: '取消交易授权银行参数维护',
            parentMenuId: '340000000000967494006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000999691000',
            menuName: '禁止清算付款BIN参数维护',
            parentMenuId: '340000000000967494006'
          }
        ]
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000000955104001',
    menuName: '报表平台',
    parentMenuId: '0'
  },
  {
    language: 'zh_cn',
    menuId: '340000000000955113003',
    menuName: '终端管理',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000955114000',
        menuName: '端末系统参数管理',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000955119007',
            menuName: '系统参数维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955123004',
            menuName: '厂商数据维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955124009',
            menuName: '设备机型维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955125008',
            menuName: 'PF特店识别代码维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955127000',
            menuName: 'PF特店设备机型组合维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955128005',
            menuName: '端末机版本维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955129004',
            menuName: '收单机构参数维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955130002',
            menuName: '交易功能维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955131003',
            menuName: '多元支付方式参数维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955132004',
            menuName: 'BIN区间维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955133005',
            menuName: '端末机母版资料维护',
            parentMenuId: '340000000000955114000'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955134008',
            menuName: '特店LOGO图档维护',
            parentMenuId: '340000000000955114000'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000955115001',
        menuName: '端末设备申请',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000955135009',
            menuName: '端末设备加装申请',
            parentMenuId: '340000000000955115001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955136000',
            menuName: '端末设备异动申请',
            parentMenuId: '340000000000955115001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955137001',
            menuName: '端末设备换装申请',
            parentMenuId: '340000000000955115001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955138004',
            menuName: '端末设备停用申请',
            parentMenuId: '340000000000955115001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955139005',
            menuName: '批次请款端末设备申请',
            parentMenuId: '340000000000955115001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955140001',
            menuName: 'SmartAPI端末设备申请',
            parentMenuId: '340000000000955115001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955141000',
            menuName: 'PF端末设备申请处理',
            parentMenuId: '340000000000955115001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955142009',
            menuName: '端末设备申请覆核',
            parentMenuId: '340000000000955115001'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087132009',
            menuName: 'Apple端末设备申请',
            parentMenuId: '340000000000955115001'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000955116008',
        menuName: '库存管理',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000955149002',
            menuName: '端末机行库存初始数量键档',
            parentMenuId: '340000000000955116008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955150000',
            menuName: '端末机月盘点库存维护',
            parentMenuId: '340000000000955116008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955151001',
            menuName: '悠游卡SAM ID汇入作业',
            parentMenuId: '340000000000955116008'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000000955118006',
        menuName: '端末管理报表',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000000955153009',
            menuName: '端末机无交易报表',
            parentMenuId: '340000000000955118006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955154004',
            menuName: '端末机交易功能报表',
            parentMenuId: '340000000000955118006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955155005',
            menuName: '商店和装机地址不同报表',
            parentMenuId: '340000000000955118006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955156002',
            menuName: '端末机并机明细报表',
            parentMenuId: '340000000000955118006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000000955157003',
            menuName: '端末机查询明细表',
            parentMenuId: '340000000000955118006'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001087126002',
        menuName: '我的工作台',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001087127003',
            menuName: '我的待办事项',
            parentMenuId: '340000000001087126002'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001087128002',
        menuName: '统计报表',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001087129003',
            menuName: '卡机与OUTLET数字统计表',
            parentMenuId: '340000000001087128002'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001087130001',
        menuName: '库存管理报表',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001087131000',
            menuName: '端末机库存管理报表',
            parentMenuId: '340000000001087130001'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001087133008',
        menuName: '端末设备管理',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001087137002',
            menuName: '端末设备查询',
            parentMenuId: '340000000001087133008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087138003',
            menuName: '端末设备申请处理作业',
            parentMenuId: '340000000001087133008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087139002',
            menuName: '端末设备异动处理作业',
            parentMenuId: '340000000001087133008'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087140002',
            menuName: 'EC TID维护作业',
            parentMenuId: '340000000001087133008'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001087135004',
        menuName: '设备派工与回报',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001087141003',
            menuName: '端末设备派工处理作业',
            parentMenuId: '340000000001087135004'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087142004',
            menuName: '端末设备回报处理作业',
            parentMenuId: '340000000001087135004'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001087136003',
        menuName: '派工单管理报表',
        parentMenuId: '340000000000955113003',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001087143005',
            menuName: '端末维护原因与机型分析表',
            parentMenuId: '340000000001087136003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087144008',
            menuName: '工单统计报表',
            parentMenuId: '340000000001087136003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087145009',
            menuName: '安装工单状态查询报表',
            parentMenuId: '340000000001087136003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087146000',
            menuName: '维护工单状态查询报表',
            parentMenuId: '340000000001087136003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087147001',
            menuName: '回收工单状态查询报表',
            parentMenuId: '340000000001087136003'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001087148004',
            menuName: '并机工单状态查询报表 ',
            parentMenuId: '340000000001087136003'
          }
        ]
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000000967508002',
    menuName: '消息平台',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000000967509003',
        menuName: '站内信订阅',
        parentMenuId: '340000000000967508002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000967510001',
        menuName: '消息管理',
        parentMenuId: '340000000000967508002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000967511000',
        menuName: '通知主题管理',
        parentMenuId: '340000000000967508002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000967512009',
        menuName: '通知模板管理',
        parentMenuId: '340000000000967508002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000967513008',
        menuName: '站内消息',
        parentMenuId: '340000000000967508002'
      },
      {
        language: 'zh_cn',
        menuId: '340000000000967514005',
        menuName: '我的事项',
        parentMenuId: '340000000000967508002'
      }
    ]
  },
  {
    language: 'zh_cn',
    menuId: '340000000001133220007',
    menuName: '密钥管理',
    parentMenuId: '0',
    children: [
      {
        language: 'zh_cn',
        menuId: '340000000001133221006',
        menuName: 'PARAMETERS CONFIGURATION',
        parentMenuId: '340000000001133220007',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001133224003',
            menuName: 'CLIENT CODE MAINTENANCE',
            parentMenuId: '340000000001133221006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133225002',
            menuName: 'USER ACCOUNT MAINTENANCE',
            parentMenuId: '340000000001133221006'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133226001',
            menuName: 'KEY EXPIRE NOTIFICATION',
            parentMenuId: '340000000001133221006'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001133222005',
        menuName: 'KEY LIFE CYCLE MAINTENANCE',
        parentMenuId: '340000000001133220007',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001133227000',
            menuName: 'MZMK KEY MAINTENANCE',
            parentMenuId: '340000000001133222005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133228005',
            menuName: 'ZCMK KEY MAINTENANCE',
            parentMenuId: '340000000001133222005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133229004',
            menuName: 'OUTBOUND FILE PGP KEY',
            parentMenuId: '340000000001133222005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133230006',
            menuName: 'INBOUND FILE PGP KEY',
            parentMenuId: '340000000001133222005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133232004',
            menuName: 'INBOUND FILE PGP KEY EXPORT',
            parentMenuId: '340000000001133222005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133233005',
            menuName: 'OUTBOUND FILE NCCC KEY',
            parentMenuId: '340000000001133222005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133234002',
            menuName: 'INBOUND FILE NCCC KEY',
            parentMenuId: '340000000001133222005'
          },
          {
            language: 'zh_cn',
            menuId: '340000000001133235003',
            menuName: 'INBOUND FILE NCCC KEY EXPORT',
            parentMenuId: '340000000001133222005'
          }
        ]
      },
      {
        language: 'zh_cn',
        menuId: '340000000001133223004',
        menuName: 'APPLICATION ADUIT LOG',
        parentMenuId: '340000000001133220007',
        children: [
          {
            language: 'zh_cn',
            menuId: '340000000001133236000',
            menuName: 'APPLICATION AUDIT LOG INQUIRE',
            parentMenuId: '340000000001133223004'
          }
        ]
      }
    ]
  }
]
</script>
