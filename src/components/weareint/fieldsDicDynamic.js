import { request } from "@/utils/request";
import _ from "lodash";
import * as localDict from "./weDict";

function excuteMapperValue(arrs) {
  return arrs.map((item) => {
    return {
      label: item.label,
      value: !_.isNaN(Number(item.value)) ? Number(item.value) : item.value,
    };
  });
}

export function pushDataToDict(key, dict) {
  if (localDict[key].length > 0) {
    dict.push(...localDict[key]);
  }

}

const fileds = new Proxy(
  {},
  {
    get: (target, key) => {
      if (target[key]) {
        return target[key];
      }
      target[key] = [];
      if (!_.isUndefined(key)) {
        pushDataToDict(key, target[key]);
      }
      return target[key];
    },
  }
);

export default fileds;
