import { getDefaultDailogInfo, getDefaultTablePagination } from "./utils";
import { ComponentOpr } from "@/components/weareint/properties";
export default {
  provide() {
    return {
      pageName: this.$options.name,
    };
  },
  data() {
    return {
      apis: {}, // 接口
      searchForm: {}, // 查询参数
      searchs: [], // 查询条件配置项
      dialogForm: {}, // 弹窗表单内容
      dialogFormSetting: [], // 弹窗表单配置项
      tableColumns: [], // 列表配置项
      // viewInfo: [],          // 查看内容配置项
      ComponentOpr, // 操作按钮名称
      tableData: [], // 列表数据
      activeOperDialogInfo: getDefaultDailogInfo(), // 弹窗属性 visible | title | Oper
      tablePagination: getDefaultTablePagination(), // 分页
      tableDataLoading: false, // 列表loading
      confirmLoading: false, // 弹窗确认loading
      refleshTableOnMount: true,
      supplyMenus: [],
      // 表格改造
      expandedRowKeys: [], // 已展开的行
      selectedRowKeys: [], // 已选择的行
      curSize: 'default', // 尺寸
      searchFormMini: {},
      showColList: [], // 列显示隐藏
      tableActions: [
        {
          type: 'DETAIL',
          label: '查看',
        },
        {
          type: 'EDIT',
          label: '编辑',
        },
        {
          type: 'DELETE',
          label: '删除',
        },
      ],
      showSearch: true, // 是否开启表头筛选查询
      showAllSearch: false, // 是否展开高级搜索
    };
  },
  created() {
    this.initPage();
  },
  mounted() {
    this.refleshTableOnMount && this.refreshTableData();
  },
  methods: {
    // 初始化页面，获取页面配置项
    initPage() {
      if (this.Curd) {
        this.apis = this.Curd.getApis ? this.Curd.getApis.call(this) : {};
        this.searchForm = this.Curd.getDefaultSearchForm
          ? this.Curd.getDefaultSearchForm.call(this)
          : {};
        this.searchs = this.Curd.getSearchSet
          ? this.Curd.getSearchSet.call(this)
          : [];
        this.dialogForm = this.Curd.getDefaultDialogForm
          ? this.Curd.getDefaultDialogForm.call(this)
          : {};
        this.dialogFormSetting = this.Curd.getDialogFormSet
          ? this.Curd.getDialogFormSet.call(this)
          : [];
        this.tableColumns = this.Curd.getTableColumnSet
          ? this.Curd.getTableColumnSet.call(this)
          : [];
        this.viewInfo = this.Curd.getViewInfoSet
          ? this.Curd.getViewInfoSet.call(this)
          : [];
        this.supplyMenus = this.Curd.getOperationSet
          ? this.Curd.getOperationSet.call(this)
          : [];

        // 表格改造
        // this.showColList = this.tableColumns.map(v => ({ label: v.label, key: v.key, checked: !v.hide, disabled: v.alwaysShow }));
        this.$forceUpdate();
      }
    },

    // 获取列表数据
    refreshTableData(orderByList) {
      if (orderByList) {
        this.orderByList = orderByList;
      }
      this.tableDataLoading = true;
      let query = this.getTableQuery();
      query.page = query.current;
      this.apis
        .list(query)
        // .then(this.reviseQuery)
        .then(({ data }) => {
          console.log(data);
          this.tableDataLoading = false;
          this.tableData = data.data.records;
          console.log(data.records);
          this.tablePagination.total = parseInt(data.data.total);
          this.$forceUpdate();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取当前查询参数
    getTableQuery() {
      let { current, size } = this.tablePagination;
      for (let key in this.searchForm) {
        if (
          this.$_.isString(this.searchForm[key]) &&
          this.searchForm[key].trim() === ""
        ) {
          this.searchForm[key] = undefined;
        }
        if (
          this.searchForm[key] instanceof Array &&
          this.searchForm[key].length === 0
        ) {
          this.searchForm[key] = undefined;
        }
      }
      return Object.assign(
        {},
        this.searchForm,
        { currPage: current, limit: size },
        { orderByList: this.orderByList }
      );
    },

    // 点击 搜索 | 重置
    onSearchQuery() {
      this.tablePagination = getDefaultTablePagination();
      this.refreshTableData();
    },
    // 迷你搜索 表格修改
    onSearchMini(params) {
      let defaultParams = this.Curd.getDefaultSearchForm ? this.Curd.getDefaultSearchForm.call(this) : {}
      this.searchForm = { ...defaultParams, ...params }
      this.tablePagination = getDefaultTablePagination()
      this.refreshTableData()
    },
    onResetMini() {
      this.$refs['search-mini'] && this.$refs['search-mini'].reset();
    },
    onSearchReset() {
      let defaultSearch = this.Curd.getDefaultSearchForm.call(this);
      for (const key in this.searchForm) {
        this.searchForm[key] = defaultSearch[key];
      }
      this.tablePagination.current = 1;
      this.refreshTableData();
      this.afterSearchReset && this.afterSearchReset();
      this.onResetMini();
    },

    // 点击操作按钮
    handleOperation(operation, row) {
      this.activeOperDialogInfo.title = operation.name;
      this.activeOperDialogInfo.Oper = operation.key;
      this[operation.key](row);
      this.$forceUpdate();
    },

    // 执行具体操作内容
    [ComponentOpr.ADD]() {
      this.dialogForm = this.Curd.getDefaultDialogForm.call(this);
      this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
      this.openDialog();
      this.$nextTick(() => {
        if (this.$refs.weForm) {
          this.$refs.weForm.disableReset();
        }
      });
    },
    [ComponentOpr.EDIT](row) {
      const dialog = Object.assign(this.Curd.getDefaultDialogForm(), row);
      this.dialogForm = this.$_.cloneDeep(dialog);
      this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
      this.openDialog();
      this.$nextTick(() => {
        if (this.$refs.weForm) {
          this.$refs.weForm.disableReset();
        }
      });
    },
    [ComponentOpr.DETAIL](row) {
      // this.apis.byId({id:row.id}).then((result) => {
      //     console.log(result);
      // })
      this.dialogForm = Object.assign(this.Curd.getDefaultDialogForm(), row);
      this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
      this.openDialog();
      this.$nextTick(() => {
        if (this.$refs.weForm) {
          this.$refs.weForm.disabledAll();
        }
      });
    },
    [ComponentOpr.DELETE](row) {
      this.$confirm({
        title: "提示",
        content: "是否确认删除",
        onOk: () => {
          this.apis.delete([row.id]).then((result) => {
            if (result.code === 20000) {
              this.refreshTableData();
            }
          });
        },
        onCancel: () => {
          this.$message.info("已取消");
        },
      });
    },
    // [ComponentOpr.DISABLE](row) {
    //     let params = _.cloneDeep(row);
    //     params.enableStatus = 1;
    //     this.updateEnableStatus(params);
    // },
    // [ComponentOpr.ENABLE](row) {
    //     let params = _.cloneDeep(row);
    //     params.enableStatus = 0;
    //     this.updateEnableStatus(params);
    // },
    // updateEnableStatus(params) {
    //     this.$confirm("是否确认" + this.activeOperDialogInfo.title, "提示", {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "warning"
    //     })
    //         .then(() => {
    //             this.apis
    //                 .edit(params)
    //                 .then(() => {
    //                     this.refreshTableData();
    //                 })
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             this.$message({
    //                 type: "info",
    //                 message: "已取消"
    //             });
    //         });
    // },

    // 打开 | 关闭 弹窗
    closeDialog() {
      this.resetFormValidate();
      this.activeOperDialogInfo.visible = false;
    },
    openDialog() {
      this.activeOperDialogInfo.visible = true;
    },

    // 弹窗确认
    onDialogConfirm() {
      this["confirm" + this.activeOperDialogInfo.Oper](this.dialogForm);
    },
    ["confirm" + ComponentOpr.ADD](params) {
      this.$refs.weForm.validateState((res) => {
        if (res) {
          this.confirmLoading = true;
          this.apis
            .add(params)
            .then((result) => {
              if (result.code === 20000) {
                this.closeDialog();
                this.refreshTableData();
              }
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        }
      });
    },
    ["confirm" + ComponentOpr.EDIT](params) {
      this.$refs.weForm.validateState((res) => {
        if (res) {
          this.confirmLoading = true;
          this.apis
            .edit(params)
            .then((result) => {
              this.confirmLoading = false;
              if (result.code === 20000) {
                this.closeDialog();
                this.refreshTableData();
              }
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        }
      });
    },
    ["confirm" + ComponentOpr.DETAIL]() {
      this.closeDialog();
    },

    // 查询条件改变时修改分页参数
    reviseQuery({ data }) {
      if (!data) {
        return [];
      }
      if (
        (!data.records || !data.records.length) &&
        this.tablePagination.current > data.pages &&
        data.pages > 0
      ) {
        this.tablePagination.current = data.pages;
        this.tablePagination.page = data.pages;

        this.refreshTableData();
        return {};
      }
      return data;
    },

    // 重置表单
    resetFormValidate() {
      this.$nextTick(() => {
        this.$refs.weForm && this.$refs.weForm.resetFormValidate();
      });
    },

    // 将某个表单项隐藏或显示
    // toggleDialogFormIsHide(name, visible) {
    //     this.dialogFormSetting.find(i => i.key == name).hidden = visible;
    // },

    // 将某个表单项置为可用或不可用
    // toggleDialogFormIsDisable(name, isDisable) {
    //     this.dialogFormSetting.find(
    //         i => i.key == name
    //     ).cptOption.disabled = isDisable;
    // },

    // 设置指定数据上的属性， 通过data和mapper配合
    // setFormDataFromMapper(attr, data, mapper) {
    //     for (const key in mapper) {
    //         this.$set(this[attr], key, data[mapper[key]]);
    //     }
    // },

    //
    // getActiveEnableMenu(status) {
    //     return [ComponentOpr.DISABLE, ComponentOpr.ENABLE][status];
    // },
    refreshFormSet() {
      this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
    },
    refreshSearchSet() {
      this.searchs = this.Curd.getSearchSet.call(this);
    },
  },
};
