import _ from "lodash";
import { request } from "@/utils/request2";
import { ComponentSet } from "../properties";

//通过字典获取value对应的label
export function getLabel(value, mapper) {
  if (mapper) {
    let item = mapper.find((i) => i.value == value);
    return item ? item.label : value;
  }
  return value;
}

//获取api中的list接口，拼接下拉的数据
export const getApiList = (
  api,
  cb = null,
  key = "id",
  label = "name",
  data = {}
) => {
  const res = [];
  if (_.isFunction(api.list)) {
    api
      .list({
        current: 1,
        size: 1000,
        ...data,
      })
      .then((result) => {
        if (result.code === 20000) {
          let { data } = result;
          cb && cb(data);
          res.push(
            ...(data instanceof Array ? data : data.records).map((i) => {
              return {
                ...i,
                value: i[key],
                label: i[label],
              };
            })
          );
        }
      });
  }
  return res;
};

export function getAllApiList(
  apiKey,
  key = "id",
  label = "name",
  data = {},
  cb = null,
  baseUrl = "/api",
  method = "post"
) {
  const api = generateApiList(apiKey, baseUrl, method);
  return getApiList(api, cb, key, label, data);
}

export function handleExportExcel(url, params, name, method) {
  request(url, method ? method : "post", params, {
    responseType: "blob",
  })
    .then((data) => {
      if (data.size === 0) {
        return;
      }
      const blob = new Blob([data], { type: "application/vnd.ms-excel" });
      let filename = name + ".xlsx";
      if (window.navigator.msSaveOrOpenBlob) {
        // 兼容IE10
        navigator.msSaveBlob(blob, filename);
      } else {
        // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
        const elink = document.createElement("a");
        elink.download = filename;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

//获取默认dialog配置信息
export function getDefaultDailogInfo() {
  return {
    visible: false,
    title: undefined,
    Oper: undefined,
    disabledAll: false,
  };
}

//获取默认Form设置
export function getDefaultFormStyle() {
  return {
    layout: "horizontal",
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
}

export function getDefaultInlineFormStyle() {
  return {
    layout: "inline",
    labelCol: { style: "width: max-content" },
    wrapperCol: { style: "width: 200px" },
  };
}

export function getDefaultDialogFormStyle() {
  return {
    layout: "inline",
    labelCol: { style: "width: 150px" },
    wrapperCol: { style: "width: 200px" },
  };
}
//获取默认列表分页配置
export function getDefaultTablePagination() {
  return {
    current: 1,
    size: 10,
    total: 0,
  };
}
export function generateApi(apiKey, baseUrl = "/api") {
  return {
    list: (data) => request(`${baseUrl}/${apiKey}/page`, "post", data),
    add: (data) =>
      request(`${baseUrl}/${apiKey}/save`, "post", data, {
        showSuccess: true,
      }),
    edit: (data) =>
      request(`${baseUrl}/${apiKey}/update`, "post", data, {
        showSuccess: true,
      }),
    delete: (data) =>
      request(`${baseUrl}/${apiKey}/delete`, "post", data, {
        showSuccess: true,
      }),
    byId: (data) => request(`${baseUrl}/${apiKey}/byId`, "post", data),
  };
}

export function generateCurdApi(apiKey, baseUrl = "/api") {
  return {
    list: (data) => request(`${baseUrl}/${apiKey}/findPage`, "post", data),
    add: (data) =>
      request(`${baseUrl}/${apiKey}/save`, "post", data, {
        showSuccess: true,
      }),
    edit: (data) =>
      request(`${baseUrl}/${apiKey}/update`, "post", data, {
        showSuccess: true,
      }),
    delete: (data) =>
      request(`${baseUrl}/${apiKey}/delete`, "post", data, {
        showSuccess: true,
      }),
    byId: (data) => request(`${baseUrl}/${apiKey}/findById`, "post", data),
  };
}

export function generateApiList(apiKey, baseUrl = "/api", method = "post") {
  const apiUrl =
    apiKey.indexOf("/") !== -1 ? apiKey : `${baseUrl}/${apiKey}/findPage`;
  return {
    list: (data) => request(apiUrl, method, data),
  };
}

export function countMaxLength(item) {
  if (item.maxLength) {
    return item.maxLength;
  }
  if (item.component == ComponentSet.INPUT) {
    return 50;
  }
  if (item.component == ComponentSet.TEXTAREA) {
    return 200;
  }
}

export function cutOffAction(columns) {
  return columns && columns.length > 0
    ? columns.filter((e) => e.label != "操作")
    : columns;
}

export function countNumber(
  data,
  fixedNumber = 3,
  isPositive = true,
  isString = false
) {
  const countData = _.isString(data) ? Number(data) : data;
  const returnData =
    countData > 0 || !isPositive ? +countData.toFixed(fixedNumber) : 0;
  return isString ? returnData.toString() : returnData;
}

export function downloadFromOssExcel(fileName, backetName) {
  // fileNmae 文件名称 如 EL漏检导入模板.xlsx
  const data = (window.microApp && window.microApp.getGlobalData()) || {};
  const ossContext =
    process.env.NODE_ENV == "production" ? data.ossContext : "dzsyx-dev";
  const originPath =
    process.env.NODE_ENV == "production"
      ? window.location.origin
      : process.env.VUE_APP_OSS_URL;
  const excelBacket = backetName || "excel";
  let nginxPath;
  if (!ossContext) {
    const orginUrl = window.location.href.split("/#/")[0];
    const lastIndex = orginUrl.lastIndexOf("/");
    nginxPath =
      (lastIndex > 7 ? orginUrl.substring(0, lastIndex) : orginUrl) +
      `/${excelBacket}`;
  }
  //判断有没有基座的data.ossContext，如果没配置基座阿波罗的话，就说明是不是cicd的，环晟和衢州暂且不配
  const ossPath = ossContext
    ? `${originPath}/oss/${ossContext}/wit-public/${excelBacket}/${fileName}`
    : `${nginxPath}/${fileName}`;
  const aTag = document.createElement("a");
  aTag.download = fileName;
  aTag.style.display = "none";
  aTag.href = ossPath;
  document.body.appendChild(aTag);
  aTag.click();
  document.body.removeChild(aTag);
}

export function getOssImageUrl(fileName, backetName) {
  const data = (window.microApp && window.microApp.getGlobalData()) || {};
  const ossContext =
    process.env.NODE_ENV == "production" ? data.ossContext : "dzsyx-dev";
  const imageBacket = backetName || "image";
  let nginxPath;
  if (!ossContext) {
    const orginUrl = window.location.href.split("/#/")[0];
    const lastIndex = orginUrl.lastIndexOf("/");
    nginxPath =
      (lastIndex > 7 ? orginUrl.substring(0, lastIndex) : orginUrl) +
      `/${imageBacket}`;
    console.log(lastIndex, orginUrl, nginxPath);
  }
  const originPath =
    process.env.NODE_ENV == "production"
      ? window.location.origin
      : process.env.VUE_APP_OSS_URL;
  const ossPath = ossContext
    ? `${originPath}/oss/${ossContext}/wit-public/${imageBacket}/${fileName}`
    : `${nginxPath}/${fileName}`;
  return ossPath;
}

export function trimAll(obj) {
  for (let key in obj) {
    if (typeof obj[key] == "string") {
      obj[key] = obj[key].trim();
    }
    if (typeof obj[key] == "object") {
      trimAll(obj[key]);
    }
  }
}
