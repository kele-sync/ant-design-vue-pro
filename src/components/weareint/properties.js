
export const TimeFormatSet = {
  DAY: "yyyy-MM-DD",
  SECOND: "yyyy-MM-DD HH:mm:ss",
};

export const ComponentSet = {
  INPUT: "a-input",
  TEXTAREA: "a-textarea",
  INPUTNUMBER: "a-input-number",
  SELECT: "a-select",
  NUMBER: "a-input-number",
  RADIOGROUP: "a-radio-group",
  SLIDER: "a-slider",
  SWITCH: "a-switch",
  DATEPICKER: "a-date-picker",
  MONTHPICKER: "a-month-picker",
  DATERANGEPICKER: "a-range-picker",
  TIMEPICKER: "a-time-picker",
  TIMERANGEPICKER: "a-time-range-picker",
  TREESELECT: "a-tree-select",
  CASCADER: "a-cascader",
  WEEMBED: "we-embed",
  WEMULTIPLE: "we-multiple",
  WESELECT: "we-select",
  TAG: "a-tag",
  DIVIDER: "a-divider",
  WESUINPUT: "we-su-input",
  INPUTPASSWORD: "a-input-password",
  WEMULTIPLEFORM: "we-multiple-form",
  TAGLIST: "tag-list",
  CHECKBOX: "a-checkbox",
  WECRON: "we-cron",
  CHECKBOXGROUP: "a-checkbox-group",
  WEINTSELECT: "weint-select",
};

export const ComponentPlaceholder = {
  "a-input": { name: "请输入", showLabel: true },
  "a-textarea": { name: "请输入", showLabel: true },
  "a-select": { name: "请选择", showLabel: true },
  "a-input-number": { name: "请输入", showLabel: true },
  "a-radio-group": { name: "" },
  "a-slider": { name: "" },
  "a-switch": { name: "" },
  "a-date-picker": { name: "请选择", showLabel: true },
  "a-month-picker": { name: "请选择", showLabel: true },
  "a-range-picker": { name: ["开始日期", "结束日期"] },
  "a-time-picker": { name: "请选择", showLabel: true },
  "a-time-range-picker": { name: ["开始时间", "结束时间"] },
  "a-tree-select": { name: "请选择", showLabel: true },
  "a-cascader": { name: "请选择", showLabel: true },
  "we-embed": { name: "", showLabel: false },
  "we-multiple": { name: "", showLabel: false },
  "we-select": { name: "", showLabel: false },
  "we-su-input": { name: "请输入", showLabel: true },
  "a-input-password": { name: "请输入", showLabel: true },
  "we-multiple-form": { name: "", showLabel: false },
  "tag-list": { name: "", showLabel: false },
  "we-cron": { name: "", showLabel: false },
};

export const ComponentOpr = {
  ADD: "ADD",
  DELETE: "DELETE",
  EDIT: "EDIT",
  DETAIL: "DETAIL",
  DISABLE: "DISABLE",
  ENABLE: "ENABLE",
  ENBEDDELETE: "ENBEDDELETE",
};

export const ComponentOprList = {
  ADD: {
    name: "新增",
    type: "primary",
    icon: "plus",
  },
  DELETE: {
    name: "删除",
    type: "danger",
    //icon: "delete",
  },
  EDIT: {
    name: "编辑",
    type: "primary",
    //icon: "edit",
  },
  DETAIL: {
    name: "查看",
    type: "primary",
    //icon: "eye",
  },
  DISABLE: {
    name: "禁用",
    type: "danger",
    //icon: "stop",
  },
  ENABLE: {
    name: "启用",
    type: "primary",
    //icon: "check-circle",
  },
  ENBEDDELETE: {
    name: "删除",
    type: "danger",
    //icon: "delete",
  },
};

const PlatformsStatic = [
  {
    label: "MOM管理平台",
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
  {
    label: "MOM_PAD",
    value: "MOM_PAD",
  },
];
