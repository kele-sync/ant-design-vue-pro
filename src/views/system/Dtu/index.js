import { ComponentSet } from "@/components/weareint/properties";
import { generateApi } from "@/components/weareint/crud/utils";
import { enableStatusMapper } from "@/components/weareint/weDict";
import { request } from "@/utils/request2";

export default {
  getDefaultSearchForm: () => {
    return {
      "currPage": 1,
      "devCode": "",
      "limit": 10
    };
  },
  getSearchSet: function () {
    return [

      {
        label: "设备状态",
        key: "netState",
        component: ComponentSet.SELECT,
        options: enableStatusMapper,
      },
      {
        label: "设备编码",
        key: "devCode",
        component: ComponentSet.INPUT,
      },
      {
        label: "simImsi",
        key: "simImsi",
        component: ComponentSet.INPUT,
      },
      {
        label: "simImei",
        key: "simImei",
        component: ComponentSet.INPUT,
      },
    ];
  },
  getDefaultDialogForm: () => {
    return {

    };
  },
  getDialogFormSet: function () {
    return [
      {
        label: "设备编码",
        key: "devCode",
        component: ComponentSet.INPUT,
        required: true,

      },

      {
        label: "状态",
        key: "netState",
        component: ComponentSet.SELECT,
        options: this.$w.dict.enableStatusMapper,
        required: true, hidden: this.activeOperDialogInfo.Oper == "ADD"
      },

      {
        label: "在线时间",
        key: "onlineTime",
        component: ComponentSet.TIMEPICKER, hidden: this.activeOperDialogInfo.Oper == "ADD"
      },
      {
        label: "simImsi",
        key: "simImsi",
        component: ComponentSet.INPUT, hidden: this.activeOperDialogInfo.Oper == "ADD"

      },
      {
        label: "simImei",
        key: "simImei",
        component: ComponentSet.INPUT, hidden: this.activeOperDialogInfo.Oper == "ADD"

      },

    ];
  },
  getTableColumnSet: function () {
    return [
      {
        label: "设备编码",
        key: "devCode",
      },
      {
        label: "状态",
        key: "netState",
        formatFuc: (e) => {
          return e > 0 ? "在线" : "离线"
        }
      },
      {
        label: "在线时间",
        key: "onlineTime",
      },
      {
        label: "simImsi",
        key: "simImsi",
      },
      {
        label: "simImei",
        key: "simImei",
      },
      // {
      //   label: "所属企业",
      //   key: "companyName",
      // },

      {
        label: '操作',
        scopedSlots: { customRender: 'action' },
        flex: 'left',
        width: 210
      },
    ];
  },
  getViewInfoSet: function () {
    return [];
  },
  getApis: function () {
    return {
      list: (data) => request(`/api/dtu/queryPage`, "post", data),
      add: (data) => request(`/api/dtu/addDtu`, "post", data),
      delete: (data) => request(`/api/dtu/removeDtu`, "post", data),
      queryParamsValueByDtu: (data) => request(`/api/customer/queryParamsValueByDtu`, "post", data),
      resetPassword: (data) => request(`/api/sysUser/restPassword`, 'post', data, { showSuccess: true })
    };
  },
};
