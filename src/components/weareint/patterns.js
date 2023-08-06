//常用正则

export const numberAndChat = {
  pattern: "^[a-zA-Z0-9-+]*$",
  message: "只支持数字、字母和-、+",
  trigger: "blur",
};
export const nullChinese = {
  pattern: "[^\u4E00-\u9FA5]+",
  message: "不支持中文",
  trigger: "blur",
};
