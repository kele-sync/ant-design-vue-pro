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
        label: "用户状态",
        key: "netState",
        component: ComponentSet.SELECT,
        options: enableStatusMapper,
      },
      {
        label: "devCode",
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
      checkedList: [],
      status: 1,
      roleIds: []
    };
  },
  getDialogFormSet: function () {
    return [
      {
        label: "devCode",
        key: "devCode",
        component: ComponentSet.INPUT,
        required: true,
      },

      {
        label: "状态",
        key: "netState",
        component: ComponentSet.SELECT,
        options: this.$w.dict.enableStatusMapper,
        required: true,
      },

      {
        label: "在线时间",
        key: "onlineTime",
        component: ComponentSet.TIMEPICKER,
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
  getTableColumnSet: function () {
    return [
      {
        label: "账号",
        key: "account",
      },

      {
        label: "创建时间",
        key: "createTime",
      },
      {
        label: "更新时间",
        key: "updateTime",
      },


      {
        label: '操作',
        scopedSlots: { customRender: 'action' },
        flex: 'left',
        width: 180
      },
    ];
  },
  getViewInfoSet: function () {
    return [];
  },
  getApis: function () {
    return {
      list: (data) => request(`/api/account/queryPage`, "post", data),
      delete: (data) => request(`/api/dtu/removeDtu`, "post", data),
      resetPassword: (data) => request(`/api/sysUser/restPassword`, 'post', data, { showSuccess: true })
    };
  },
};
