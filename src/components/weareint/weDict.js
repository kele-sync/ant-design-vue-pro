export const colorObj = {
  red: "red",
  green: "green",
  blue: "blue",
  pink: "pink",
  orange: "orange",
  cyan: "cyan",
  purple: "purple",
  grey: "grey",
};
export const actionLogTypeMapper = [
  {
    label: "登录",
    value: "登录",
  },
  {
    label: "登出",
    value: "登出",
  },
  {
    label: "新增",
    value: "新增",
  },
  {
    label: "删除",
    value: "删除",
  },
  {
    label: "编辑",
    value: "编辑",
  },
  {
    label: "查询",
    value: "查询",
  },
];
export const orgTypeMapper = [
  {
    label: "公司",
    value: "BUSINESS",
  },
  {
    label: "工厂",
    value: "FACTORY",
  },
  {
    label: "集团",
    value: "GROUP",
  },
];
export const auditStatusMap = [
  {
    label: "待审核 ",
    value: 0,
  },
  {
    label: "通过",
    value: 1,
  },
  {
    label: "拒绝",
    value: 2,
  },
];
export const platformMap = [
  {
    label: "MOM管理平台 ",
    value: "MOM_WEB",
  },
  {
    label: "MOM手持机",
    value: "MOM_PDA",
  },
  {
    label: "包装线管理平台",
    value: "PKG_WEB",
  },
  {
    label: "包装线手持机",
    value: "PKG_PDA",
  },
  {
    label: "MCS管理平台",
    value: "MCS_WEB",
  },
  {
    label: "MCS手持机",
    value: "MCS_PDA",
  },
];
export const equipmentTypeMap = [
  {
    label: "一道印刷",
    value: 1,
  },
  {
    label: "二道印刷",
    value: 2,
  },
  {
    label: "三道印刷",
    value: 3,
  },
  {
    label: "四道印刷",
    value: 4,
  },
];
export const checkStatusMap = [
  {
    label: "通过",
    value: 1,
  },
];
export const unCheckStatusMap = [
  {
    label: "待审核 ",
    value: 0,
  },
  {
    label: "拒绝",
    value: 2,
  },
];

export const menuTypeMapper = [
  {
    label: "目录",
    value: "MENU",
    color: colorObj.blue,
  },
  {
    label: "按钮",
    value: "BUTTON",
    color: colorObj.purple,
  },
  {
    label: "页面",
    value: "VIEW",
    color: colorObj.orange,
  },
];
export const enableStatusMapper = [
  {
    label: "在线",
    value: 1,
    color: colorObj.green,
  },
  {
    label: "离线",
    value: 0,
    color: colorObj.red,
  },
];

// 兼容int返回
export const enableStatusMapperInt = [
  {
    label: "启用",
    value: 1,
    color: colorObj.green,
  },
  {
    label: "禁用",
    value: 0,
    color: colorObj.red,
  },
];
export const platformMapper = [
  {
    label: "电脑端",
    value: "PC",
  },
  {
    label: "PDA",
    value: "PDA",
  },
];
export const noticeTypeMapper = [
  {
    label: "通告",
    value: "ANNOUNCEMENT",
  },
];
export const noticeStatusMapper = [
  {
    label: "待提交",
    value: 0,
    color: colorObj.orange,
  },
  {
    label: "已提交",
    value: 1,
    color: colorObj.cyan,
  },
  {
    label: "已审批",
    value: 2,
    color: colorObj.blue,
  },
  {
    label: "已发布",
    value: 3,
    color: colorObj.green,
  },
  {
    label: "已拒绝",
    value: 4,
    color: colorObj.red,
  },
];
export const NewNoticeStatusMapper = [
  {
    label: "已发布",
    value: 0,
    color: colorObj.green,
  },
  {
    label: "已发布",
    value: 3,
    color: colorObj.green,
  },
  {
    label: "待发布",
    value: 2,
    color: colorObj.red,
  },
];
export const dictStatusMapper = [
  {
    label: "正常",
    value: 1,
    color: colorObj.green,
  },
  {
    label: "停用",
    value: 0,
    color: colorObj.red,
  },
];
export const proAtuoWorkReportTypeMap = [
  { value: 1, label: "正常" },
  { value: 2, label: "返工" },
  { value: 3, label: "碎片" },
  { value: 4, label: "冻结" },
];
export const proAtuoWorkReportPositionMap = [
  { value: 1, label: "上料端" },
  { value: 2, label: "下料端" },
];
export const isOrNotMapper = [
  {
    label: "是",
    value: 1,
  },
  {
    label: "否",
    value: 0,
  },
];
export const materialTypeMapper = [
  {
    label: "产品",
    value: 1,
  },
  {
    label: "硅片",
    value: 2,
  },
  {
    label: "浆料",
    value: 3,
  },
  {
    label: "网版",
    value: 4,
  },
];

export const coderTypeMap = [
  {
    label: "日期",
    value: 1,
  },
  {
    label: "时间",
    value: 2,
  },
  {
    label: "流水号",
    value: 3,
  },
  {
    label: "常量",
    value: 4,
  },
  {
    label: "随机数",
    value: 5,
  },
];

export const basketColorTypeMap = [
  { value: 1, label: "白/黄-白杆" },
  { value: 2, label: "白/黄-黑杆" },
];

export const basketUsageTypeMap = [
  { value: 1, label: "干花篮" },
  { value: 2, label: "湿花篮" },
];
export const basketStatusMap = [
  { value: 0, label: "禁用", color: colorObj.red },
  { value: 1, label: "正常", color: colorObj.green },
  { value: 2, label: "预警", color: colorObj.orange },
  { value: 3, label: "待清洗", color: colorObj.grey },
  { value: 4, label: "清洗完成", color: colorObj.blue },
  { value: 5, label: "待维修", color: colorObj.orange },
  { value: 6, label: "维修完成", color: colorObj.blue },
];
export const graphiteBoatMap = [
  { value: 1, label: "石英舟" },
  { value: 2, label: "石墨舟" },
];
export const gbUsingStatusMap = [
  { value: 1, label: "创建", color: colorObj.blue },
  { value: 2, label: "上线", color: colorObj.cyan },
  { value: 3, label: "下线", color: colorObj.grey },
  { value: 4, label: "维护", color: colorObj.pink },
  { value: 5, label: "维修", color: colorObj.orange },
  { value: 6, label: "报废", color: colorObj.red },
];

export const switchTypeMap = [
  { value: 1, label: "单班" },
  { value: 2, label: "两班倒" },
  { value: 3, label: "三班倒" },
];
export const quartzBoatTypeMap = [
  { value: 1, label: "扩散石英舟" },
  { value: 2, label: "前氧石英舟" },
  { value: 3, label: "后氧石英舟" },
];
export const graphiteBoatTypeMap = [
  { value: 4, label: "背镀石墨舟" },
  { value: 5, label: "正镀石墨舟" },
];
export const isOrNotMap = [
  { value: 0, label: "否" },
  { value: 1, label: "是" },
];
export const isOrNotSysMap = [
  { value: "0", label: "否" },
  { value: "1", label: "是" },
];
export const siliconGradeMapper = [
  {
    label: "A",
    value: "A",
  },
  {
    label: "B1",
    value: "B1",
  },
  {
    label: "B2",
    value: "B2",
  },
  {
    label: "C",
    value: "C",
  },
];

export const TwoProcuctTypeMapper = [
  {
    label: "定线生产",
    value: 1,
  },
  {
    label: "柔性制造",
    value: 2,
  },
];

export const procuctUpdateMapper = [
  {
    label: "工艺配方",
    value: 1,
  },
  {
    label: "设备配方",
    value: 2,
  },
  {
    label: "工艺配方&设备配方",
    value: 3,
  },
];

export const TwoProcuctTypeSysMapper = [
  {
    label: "定线生产",
    value: "1",
  },
  {
    label: "柔性制造",
    value: "2",
  },
];
export const typeEquipmentMap = [
  { value: 1, label: "主机台" },
  { value: 2, label: "自动化" },
  { value: 3, label: "子设备" },
];
export const warehouseStatusMap = [
  { value: 1, label: "待审批" },
  { value: 2, label: "审批通过" },
  { value: 3, label: "已关闭" },
  { value: -1, label: "审批拒绝" },
];
export const warehouseTypeMap = [
  { value: 1, label: "工单入库" },
  { value: 2, label: "生产退料" },
];
export const typeProcedureMap = [
  { value: 1, label: "生产" },
  { value: 2, label: "质量" },
];
export const craftRoutingTypeMap = [
  { value: 1, label: "P型" },
  { value: 2, label: "N型" },
];
export const produceTypeMap = [
  { value: 1, label: "生产" },
  { value: 2, label: "质量" },
];
export const outHouseStatusMap = [
  { value: 1, label: "未提交" },
  { value: 2, label: "已完成" },
];
export const typeMap = [
  { value: 1, label: "生产领料" },
  { value: 2, label: "原料退库（大库）" },
];

export const dataTypeMap = [
  { value: 1, label: "整数" },
  { value: 2, label: "小数" },
  { value: 3, label: "是否" },
];

export const materialOutstatusMap = [
  { value: 1, label: "已提交" },
  { value: 2, label: "已完成" },
  { value: 3, label: "退库拒绝" },
];
export const checkTypeMap = [
  { value: 1, label: "即时点检" },
  { value: 2, label: "过程点检" },
];
export const materialOutTypeMap = [
  { value: 1, label: "生产领料" },
  { value: 2, label: "原料退库" },
];
export const productionOrderStatusMap = [
  { value: 1, label: "创建", color: colorObj.blue },
  { value: 2, label: "已排产", color: colorObj.orange },
  { value: 3, label: "已开工", color: colorObj.cyan },
  { value: 4, label: "已完工", color: colorObj.green },
  { value: 5, label: "已关闭", color: colorObj.red },
];
export const productionOrderTypeMap = [
  { value: 1, label: "量产" },
  { value: 2, label: "研发试制" },
  { value: 3, label: "送样" },
  { value: 4, label: "返工" },
  { value: 5, label: "在建工程调试（晶体）" },
  { value: 6, label: "公司内受托加工" },
  { value: 7, label: "公司间受托加工" },
];
export const materialApplystatusMap = [
  { value: 1, label: "已申请" },
  { value: 2, label: "已入库" },
  { value: 3, label: "已完成" },
  { value: 4, label: "领料失败" },
  { value: 5, label: "已取消" },
];
export const shifterOrderMap = [
  { value: 1, label: "白班" },
  { value: 2, label: "夜班" },
  { value: 3, label: "休息" },
];

export const siliconWaferAttr1Map = [
  { value: "A+级", label: "A+级" },
  { value: "A级", label: "A级" },
  { value: "A-级", label: "A-级" },
  { value: "B级", label: "B级" },
];
export const siliconWaferAttr2Map = [
  { value: "1.1-1.8", label: "1.1-1.8" },
  { value: "0.4-1.1", label: "0.4-1.1" },
  { value: "0.1-0.4", label: "0.1-0.4" },
];
export const siliconWaferAttr3Map = [
  { value: "外观A", label: "外观A" },
  { value: "SawMark线痕", label: "SawMark线痕" },
  { value: "Dirty脏污", label: "Dirty脏污" },
  { value: "Chips崩边", label: "Chips崩边" },
  { value: "TTV厚度波动", label: "TTV厚度波动" },
  { value: "Warp翘曲", label: "Warp翘曲" },
  { value: "Geometry尺寸", label: "Geometry尺寸" },
];

export const siliconWaferAttr4Map = [
  { value: 160, label: "160" },
  { value: 155, label: "155" },
  { value: 150, label: "150" },
  { value: 145, label: "145" },
  { value: 140, label: "140" },
];
export const mtMaterialInRecordTypeMap = [
  { value: 1, label: "工单入库" },
  { value: 2, label: "生产退料" },
];
export const mtMaterialInRecordStatusMap = [
  { value: 1, label: "待审批" },
  { value: 2, label: "审批通过" },
  { value: 3, label: "已关闭 " },
  { value: -1, label: "审批拒绝" },
];
export const productionTaskOrderStatusMap = [
  { value: 1, label: "创建", color: colorObj.blue },
  { value: 2, label: "已领料", color: colorObj.orange },
  { value: 3, label: "已生产", color: colorObj.cyan },
  { value: 4, label: "已完工", color: colorObj.green },
  { value: 5, label: "已关闭", color: colorObj.red },
];

export const gzSiliconWaferBoxType = [{ value: 1, label: "料盒" }];

export const basketTextureType = [
  { value: 1, label: "PVDF" },
  { value: 2, label: "PP" },
];

export const lineTypeMap = [
  { value: 1, label: "主线工序" },
  { value: 2, label: "支线工序" },
];
export const siliconWaferTypeMap = [
  { value: 1, label: "晶体" },
  { value: 2, label: "电阻率" },
  { value: 3, label: "外观" },
  { value: 4, label: "厚度" },
];
export const callMaterialStatusMap = [
  { value: 1, label: "已叫料" },
  { value: 2, label: "已发料" },
];
export const reportTypeMap = [
  { value: 1, label: "正常" },
  { value: 2, label: "返工" },
  { value: 3, label: "人工" },
];
export const reportWayStatusMap = [
  { value: 1, label: "自动" },
  { value: 2, label: "人工" },
];
export const reportAreaStatusMap = [
  { value: 1, label: "生产单元上料端" },
  { value: 2, label: "生产单元下料端" },
];
export const wipCheckMap = [
  { value: 1, label: "点检" },
  { value: 2, label: "不点检" },
];
export const wipfsCheckMap = [
  // { value: 1, label: "点检" },
  { value: 2, label: "不点检" },
];
export const recipeSwitchStatusMap = [
  // 配方切换状态字典
  { value: 0, label: "成功" },
  { value: 1, label: "异常" },
];
export const recipeCheckTypeMap = [
  // recipe点检类型字典
  { value: 0, label: "手动" },
  { value: 1, label: "自动" },
];
export const recipeCheckStatusMap = [
  // recipe点检状态字典
  { value: 0, label: "正常" },
  { value: 1, label: "异常" },
];
export const logStatusMap = [
  { value: 0, label: "正常" },
  { value: 1, label: "异常" },
];
export const recipeCheckResultMap = [
  // recipe点检结果字典
  { value: 0, label: "正常" },
  { value: 1, label: "预警" },
  { value: 2, label: "报警" },
];

export const isSyncSpa = [
  { value: "1", label: "否" },
  { value: "0", label: "是" },
];

// ksr报表页面 产品类型
export const description = [
  { value: "201", label: "201" },
  { value: "218", label: "218" },
];
export const serviceType = [
  { value: "1", label: "IQC" },
  { value: "2", label: "OQC" },
];
export const samplingScheme = [
  { value: "1", label: "抽样方案" },
  { value: "2", label: "AQL抽样方案" },
];
export const samplingSchemeCode = [
  { value: "1", label: "Sample01-IQC-按固定比例" },
  { value: "2", label: "Sample02-IQC-按固定数量" },
  { value: "3", label: "Sample03-IQC-全检" },
];
export const templateCategory = [
  { value: "1", label: "物料类别" },
  { value: "2", label: "物料编码" },
];
export const spotCheckFrequency = [
  { value: "00:00", label: "00:00" },
  { value: "01:00", label: "01:00" },
  { value: "02:00", label: "02:00" },
  { value: "03:00", label: "03:00" },
  { value: "04:00", label: "04:00" },
  { value: "05:00", label: "05:00" },
  { value: "06:00", label: "06:00" },
  { value: "07:00", label: "07:00" },
  { value: "08:00", label: "08:00" },
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
  { value: "12:00", label: "12:00" },
  { value: "13:00", label: "13:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:00", label: "19:00" },
  { value: "20:00", label: "20:00" },
  { value: "21:00", label: "21:00" },
  { value: "22:00", label: "22:00" },
  { value: "23:00", label: "23:00" },
];
export const spotCheckType = [
  { value: 1, label: "自动点检" },
  { value: 2, label: "人工点检" },
];
export const optionsMor = [
  { value: "00:00", label: "00:00" },
  { value: "01:00", label: "01:00" },
  { value: "02:00", label: "02:00" },
  { value: "03:00", label: "03:00" },
  { value: "04:00", label: "04:00" },
  { value: "05:00", label: "05:00" },
  { value: "06:00", label: "06:00" },
  { value: "07:00", label: "07:00" },
  { value: "08:00", label: "08:00" },
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
];
export const optionsAfter = [
  { value: "12:00", label: "12:00" },
  { value: "13:00", label: "13:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:00", label: "19:00" },
  { value: "20:00", label: "20:00" },
  { value: "21:00", label: "21:00" },
  { value: "22:00", label: "22:00" },
  { value: "23:00", label: "23:00" },
];
export const spotCheckResult = [
  { value: 1, label: "NG", color: colorObj.red },
  { value: 0, label: "OK", color: colorObj.green },
  { value: 2, label: "NG", color: colorObj.red },
];

export const bizType = [
  { value: "IPQC", label: "IPQC" },
  { value: "IQC", label: "IQC" },
  { value: "OQC", label: "OQC" },
];

export const materialBizType = [
  { value: "IQC", label: "IQC" },
  { value: "OQC", label: "OQC" },
];

export const inspectType = [
  { value: "metric", label: "计量型" },
  { value: "appearance", label: "外观型" },
];

export const measureUnit = [
  { value: "@", label: "@" },
  { value: "#", label: "#" },
  { value: "￥", label: "￥" },
  { value: "%", label: "%" },
  { value: "&", label: "&" },
];

export const samplingType = [
  { value: "FIXED_QUANTITY", label: "按固定数量" },
  { value: "FIXED_SCALE", label: "按固定比例" },
  { value: "FULL_CHECK", label: "全检" },
];

export const schemeType = [
  { value: "NORMAL", label: "普通" },
  { value: "AQL", label: "AQL" },
];

export const inspectLevel = [
  { value: "REDUCE", label: "减量" },
  { value: "NORMAL", label: "正常" },
  { value: "TIGHTEN", label: "加严" },
];
// 报表目标值设定页面 周期
export const reportType = [
  { value: 1, label: "月" },
  { value: 2, label: "周" },
  { value: 3, label: "日" },
];

export const triggerType = [
  { value: "CYCLE", label: "定时" },
  { value: "PRINCIPAL_LINE_ERROR", label: "主线异常时" },
  { value: "EQUIPMENT_MAINTENANCE", label: "设备维修后" },
  { value: "OTHER_ERROR", label: "其他异常时" },
];

export const triggerObjectType = [
  { label: "设备", value: "EQUIPMENT" },
  { label: "子设备", value: "CHILD_EQUIPMENT" },
  { label: "生产单元", value: "P_UNIT" },
  { label: "工序", value: "WORK_PROCEDURE" },
];

export const samplingSchemeType = [
  { value: "NORMAL", label: "普通抽样方案" },
  { value: "AQL", label: "AQL抽样方案" },
];

export const checkType = [
  { value: "FIRST_INSPECTION", label: "首检" },
  { value: "SELF_INSPECTION", label: "自检" },
  { value: "SPOT_INSPECTION", label: "抽检" },
  { value: "ON_SITE_SPOT_INSPECTION", label: "巡检" },
  { value: "LAST_INSPECTION", label: "末检" },
];

export const cycleType = [
  { value: "HOUR", label: "小时" },
  { value: "DAY", label: "天" },
  { value: "WEEK", label: "周" },
];

export const craftType = [
  { value: "P", label: "P型" },
  { value: "N", label: "N型" },
];

export const objectType = [
  { value: "AGV", label: "AGV搬运的车" },
  { value: "EQUIPMENT", label: "设备提供" },
];
export const craftTypeMap = [
  // 工艺类型
  { value: "P", label: "P型" },
  { value: "N", label: "N型" },
];

export const checkResultMap = [
  // 检验结果
  { value: "QUALIFIED", label: "合格" },
  { value: "UNQUALIFIED", label: "不合格" },
];

export const checkRecordResultMap = [
  // 检验结果
  { value: "QUALIFIED", label: "合格" },
  { value: "UNQUALIFIED", label: "不合格" },
  { value: "ACCEPT", label: "让步接收" },
];

export const checkRecordStatusMap = [
  // 检验单状态
  { value: "NEW", label: "新建", color: colorObj.blue },
  { value: "PROCESSING", label: "检验中", color: colorObj.yellow },
  { value: "COMPLETED", label: "已完成", color: colorObj.green },
];
export const andonStatusType = [
  { value: 1, label: "已上报", color: "#f5222d" },
  { value: 2, label: "待响应", color: "#f5222d" },
  { value: 3, label: "待处理", color: "#00A870" },
  { value: 4, label: "已关闭", color: "#999" },
];
export const andonInformType = [
  { value: "1", label: "消息" },
  { value: "2", label: "报警" },
];
export const incidentLevel = [
  { value: 1, label: "一级" },
  { value: 2, label: "二级" },
  { value: 3, label: "三级" },
];
export const groupType = [
  { value: "1", label: "人员" },
  { value: "2", label: "看板" },
];
export const productionLineTypeMap = [
  { value: "LOGIC", label: "逻辑线" },
  { value: "PHYSICS", label: "物理线" },
];

export const duraction = [
  { value: 1, label: "小时" },
  { value: 2, label: "天" },
  { value: 3, label: "周" },
];

export const unit = [
  { value: 1, label: "0.5um" },
  { value: 2, label: "5um" },
];

export const aqlCheckLevel = [
  { label: "S-1", value: "S-1" },
  { label: "S-2", value: "S-2" },
  { label: "S-3", value: "S-3" },
  { label: "S-4", value: "S-4" },
  { label: "Ⅰ", value: "Ⅰ" },
  { label: "Ⅱ", value: "Ⅱ" },
  { label: "Ⅲ", value: "Ⅲ" },
];
export const incidentSourceType = [
  { value: "1", label: "设备" },
  { value: "2", label: "工序" },
  { value: "3", label: "花篮" },
  { value: "4", label: "石英舟" },
  { value: "5", label: "石墨舟" },
  { value: "6", label: "网版" },
  // { value: "7", label: "备品备件" },
  { value: "8", label: "自定义服务" },
];
export const materialLifeType = [{ value: 0, label: "次数" }];
export const ingredientsScrapType = [
  { value: "0", label: "初始化", color: colorObj.blue },
  { value: "1", label: "上线", color: colorObj.green },
  { value: "2", label: "下线", color: colorObj.orange },
  { value: "3", label: "报废", color: colorObj.red },
];

export const lineType = [
  { value: "01A", label: "01A" },
  { value: "02A", label: "02A" },
  { value: "03A", label: "03A" },
  { value: "04A", label: "04A" },
  { value: "05A", label: "05A" },
  { value: "01B", label: "01B" },
  { value: "02B", label: "02B" },
  { value: "03B", label: "03B" },
  { value: "04B", label: "04B" },
  { value: "05B", label: "05B" },
];

export const holdTargetTypeMap = [
  // Hold对象
  // { value: 0, label: "花篮" },
  { value: 1, label: "生产单元" },
  { value: 2, label: "设备" },
  { value: 3, label: "子设备" },
];

export const holdexceptionTypeMap = [
  // Hold异常分类
  { value: 0, label: "品质" },
  { value: 1, label: "设备" },
  { value: 2, label: "工艺" },
];

export const holdStatusMap = [
  // Hold状态
  { value: 0, label: "解禁" },
  { value: 1, label: "Hold" },
];

// 报警等级
export const alarmLevel = [
  { label: "A等级", value: 0 },
  { label: "B等级", value: 1 },
  { label: "C等级", value: 2 },
];
// 兼容int返回
export const enableStatusMappermes = [
  {
    label: "启用",
    value: 0,
    color: colorObj.green,
  },
  {
    label: "禁用",
    value: 1,
    color: colorObj.red,
  },
];

// 属性数据类型
export const attribute = [
  { label: "STRING", value: 0 },
  { label: "BOOLEAN", value: 1 },
  { label: "INTEGER ", value: 2 },
  { label: "DOUBLE", value: 3 },
  { label: "ARRAY", value: 4 },
];

// 读写类型
export const RWtype = [
  { label: "READ_ONLY", value: 0 },
  { label: "WRITE_ONLY", value: 1 },
  { label: "READ_WRITE ", value: 2 },
];
export const feedingStation = [
  {
    label: "前方工位",
    value: 1,
  },
  {
    label: "后方工位",
    value: 2,
  },
];
export const workMode = [
  {
    label: "叫料模式",
    value: 1,
  },
  {
    label: "发料模式",
    value: 0,
  },
];
export const sessionType = [
  {
    label: "15分钟",
    value: 15,
  },
  { label: "30分钟", value: 30 },
  { label: "1小时", value: 60 },
];
export const lockType = [
  {
    label: "30分钟",
    value: 30,
  },
  { label: "1小时", value: 60 },
  { label: "3小时", value: 180 },
];
