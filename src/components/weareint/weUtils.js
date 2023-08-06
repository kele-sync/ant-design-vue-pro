import {
  getApiList,
  getLabel,
  generateApi,
  getAllApiList,
  handleExportExcel,
  trimAll,
  getOssImageUrl as img,
  downloadFromOssExcel as excel,
} from "./crud/utils";
import * as localDict from "./weDict";
import dict from "./fieldsDicDynamic";
import { apiDict } from "./weApiDict";
import * as patternObj from "./patterns";

export default {
  getApiList,
  getAllApiList,
  getLabel,
  generateApi,
  handleExportExcel,
  img,
  excel,
  trimAll,
  dict,
  apiDict,
  localDict,
  patternObj,
};