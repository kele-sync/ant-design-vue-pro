import _ from "lodash";
export const dict = {
  sysUser: "/api/sysUser/page",
  hostDesk: "/api/eqEquipment/queryHostDesk",
  dept: "api/dept/findById",
  workingProcedure: "api/tnWorkingProcedure/findList", //工序
  // routeInfo: "api/routeInfo/findPage", //工艺路线
  workShop: "api/proWorkshop/findPage", //工厂
  productionOrder: "api/proProductionOrder/findPage", //生产订单
  proWorkShift: "api/proWorkShift/findPage", //班次
  proWorkShiftList: "produce/api/proWorkShift/findList", //班次
  proProductionUnit: "api/proProductionUnit/findList", //生产单元
  eqEquipment: "api/eqEquipment/findPage", //设备
  siliconWaferAttr: "api/mtSiliconWaferAttr/findList", //硅片属性
  proProductionTaskOrderOutIn: "api/proProductionTaskOrder/findList",
  unit: "/api/cmMeasureUnit/findList",
  proProductionLine: "/api/proProductionLine/findPage",
  findProcedureUnit: "/api/eqPlcPoint/findProcedureUnit", //工序
  getListByKey: "/api/sysDicConfig/getListByKey", //点位类型
  getEquipmentType: "/api/eqEquipment/eqEquipmentGroup", //设备型号
  getSiCode: "/produce/api/proProductionOrder/findWhetherSubstituteById", //硅片
  users: "api/sysUser/selectUser", //员工账户
  getprolist: "/api/equipRecipeCheckMonitor/getWorkingProcedureList",
  group: "/api/eventGroup/findPage",
  // 生产报表 下拉框
  findProcedureList: "api/proKsrTar/findProcedureList", // 报表专用工序
  dateList: "api/proKsrTar/findDateList", // 班次时间列表 白班在前 8:00 9:00 ~ ~
  // 质量报表-EL漏检下拉框
  specificationsSelection:
    "/api/ELMissedDetectionReport/specificationsSelection", // 规格
  machineCodeSelection: "/api/ELMissedDetectionReport/machineCodeSelection", // 机台
  gradeSelection: "/api/ELMissedDetectionReport/gradeSelection", // 等级
  typeSelection: "/api/ELMissedDetectionReport/typeSelection", // 类型
  // 质量报表-外观漏检下拉框
  WspecificationsSelection:
    "/api/appearanceMissedDetectionReport/specificationsSelection", // 规格
  WmachineCodeSelection:
    "/api/appearanceMissedDetectionReport/machineCodeSelection", // 机台
  WgradeSelection: "/api/appearanceMissedDetectionReport/gradeSelection", // 等级
  WtypeSelection: "/api/appearanceMissedDetectionReport/typeSelection", // 类型
  lineTypeOptions: "/api/qualitySetting/lineTypes", // 线别
  inspectTypeOptions: "/api/qualitySetting/inspectTypes", // 检验类别
  momCleanlinessData:
    "/reports/api/momCleanlinessData/findCleanlinessFieldList", // 洁净度
  momTempHumData: "/reports/api/momTempHumData/findPrintingFieldList", // 温湿度
  // 机台
  getMachine: "/api/eqEquipmentReport/findList", // 来料机台
  getDmMachine: "/api/eqEquipmentReport/findDmList", // 正膜背膜机台  传字段dmType 0背膜 1正膜
  getExcipientsData: "/api/auxiliary/findPage", //辅料类型
  getMaterialData: "/api/mtMaterialInfo/findPage", //物料
  tnWorkingCenter: "/api/tnWorkingCenter/findPage",
  materialInformation: '/api/momTensionMeter/findMaterialList',
  equipmentModel: "/eap/model/findByPage",
  // 日志-业务模块
  getAppList: "/system-mng/api/resourceManager/getAppList",
  // 日志-资源名称
  getModuleList: "/system-mng/api/resourceManager/getModuleList",
  // 日志-功能名称
  getFunctionList: "/system-mng/api/resourceManager/getFunctionList",
  // 菜单查询
  getListOfParent: "/system-mng/api/sysMenu/getListOfParent",
};
// api/mdcDictDetail/selectMdcDictDetails
export const apiDict = new Proxy(dict, {
  get: (target, key, proxy) => {
    if (_.isUndefined(target[key])) {
      target[key] = key;
    }
    return Reflect.get(target, key, proxy);
  },
});
