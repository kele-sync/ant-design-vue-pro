// import { getDefaultDailogInfo, getDefaultTablePagination } from './utils';
import { ComponentOpr } from "@/components/weareint/properties";
import { cutOffAction } from "@/components/weareint/crud/utils";
export default {
  data() {
    return {
      ComponentOpr,
      embedKey: "",
      tabList: [],
      byId: false,
    };
  },
  created() {},
  mounted() {
    if (this.tabList && this.tabList.length) {
      this.embedKey = this.tabList[0].embedKey;
    }

    this.init();
  },
  methods: {
    init() {
      this.tabList.map((e) => {
        if (e.Curd) {
          e.embedColumns = e.Curd.getEmbedTableColumnSet
            ? e.Curd.getEmbedTableColumnSet.call(this)
            : [];
        }
        if (e.embedCurd) {
          e.operCurd = this.$_.cloneDeep(e.embedCurd);
          e.detailCurd = this.$_.cloneDeep(e.embedCurd);
          e.detailCurd.getEmbedTableColumnSet = cutOffAction(
            e.detailCurd.getEmbedTableColumnSet
          );
        }
      });
    },
    findThisTab() {
      return this.tabList.find((e) => e.embedKey == this.embedKey);
    },
    handleEmbedOperation(operation, row, index) {
      this[operation.key](row, index);
      this.$forceUpdate();
    },
    [ComponentOpr.ENBEDDELETE](row, index) {
      this.$refs[this.embedKey][0].deleteItem(index);
      this.$forceUpdate();
    },
    addEmbed() {
      this.$refs[this.embedKey][0].addEmbed();
    },
    changeTab(e) {
      this.$nextTick(() => {
        if (this.activeOperDialogInfo.Oper == ComponentOpr.DETAIL) {
          this.disabledAllEmbed();
        } else {
          this.disabledAllResetEmbed();
        }
      });
      this.embedKey = e;
    },
    onDialogConfirm() {
      this["confirm" + this.activeOperDialogInfo.Oper](this.dialogForm);
    },
    disabledAllEmbed() {
      this.tabList.map((tab) => {
        if (this.$refs[tab.embedKey] && this.$refs[tab.embedKey].length) {
          this.$refs[tab.embedKey][0].disabledAll();
        }
      });
    },
    disabledAllResetEmbed() {
      this.tabList.map((tab) => {
        if (this.$refs[tab.embedKey] && this.$refs[tab.embedKey].length) {
          this.$refs[tab.embedKey][0].disableReset();
        }
      });
    },
    [ComponentOpr.DETAIL](row) {
      this.showColumnAction();
      if (this.byId) {
        this.DetailById(row);
      } else {
        this.DetailByRow(row);
      }
    },
    showColumnAction() {
      const findTab = this.findThisTab();
      if (findTab && findTab.embedCurd) {
        if (this.activeOperDialogInfo.Oper == ComponentOpr.DETAIL) {
          findTab.embedCurd = this.$_.cloneDeep(findTab.detailCurd);
        } else {
          findTab.embedCurd = this.$_.cloneDeep(findTab.operCurd);
        }
      }
    },
    DetailByRow(row) {
      // this.beforeOpenDetailDialog(row);
      this.activeOperDialogInfo.Oper = ComponentOpr.DETAIL;
      this.activeOperDialogInfo.title = "查看详情";
      this.dialogForm = this.$_.cloneDeep(
        Object.assign(this.Curd.getDefaultDialogForm(), row)
      );
      this.viewInfo = this.Curd.getDialogFormSet.call(this);
      this.openDialog();
      this.$nextTick(() => {
        this.$refs.weForm.disabledAll();
        this.disabledAllEmbed();
        this.resizeTable();
      });
    },

    DetailById(rowOld) {
      let row = {};
      this.apis.byId({ id: rowOld.id }).then((result) => {
        row = result.data;
        this.activeOperDialogInfo.Oper = ComponentOpr.DETAIL;
        this.dialogForm = this.$_.cloneDeep(
          Object.assign(this.Curd.getDefaultDialogForm(), row)
        );
        this.viewInfo = this.Curd.getDialogFormSet.call(this);
        this.openDialog();
        this.$nextTick(() => {
          this.$refs.weForm.disabledAll();
          this.disabledAllEmbed();
          this.resizeTable();
        });
      });
    },
    beforeOpenAddDialog() {},
    beforeOpenEditDialog(row) {
      return row;
    },
    [ComponentOpr.EDIT](row) {
      this.activeOperDialogInfo.title = "编辑";
      this.showColumnAction();
      if (this.byId) {
        this.EditById(row);
      } else {
        this.EditByRow(row);
      }
    },
    resizeTable() {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 0);
    },
    EditById(rowOld) {
      let row = {};
      this.id = rowOld.id;
      this.apis.byId({ id: rowOld.id }).then((result) => {
        row = result.data;
        this.activeOperDialogInfo.Oper = ComponentOpr.EDIT;
        const dialog = Object.assign(this.Curd.getDefaultDialogForm(), row);
        this.dialogForm = this.$_.cloneDeep(dialog);
        this.dialogForm.id = rowOld.id;
        this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
        this.beforeOpenEditDialog(row);

        this.openDialog();
        this.$nextTick(() => {
          this.$refs.weForm.disableReset();
          this.disabledAllResetEmbed();
          this.resizeTable();
        });
      });
    },

    EditByRow(row) {
      this.activeOperDialogInfo.Oper = ComponentOpr.EDIT;
      const dialog = Object.assign(this.Curd.getDefaultDialogForm(), row);
      this.dialogForm = this.$_.cloneDeep(dialog);
      this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
      this.openDialog();
      this.$nextTick(() => {
        this.$refs.weForm.disableReset();
        this.disabledAllResetEmbed();
        this.resizeTable();
      });
    },

    checkRequired() {
      let tabLength = this.tabList.length;
      for (let i = 0; i < tabLength; i++) {
        const tab = this.tabList[i];
        const tabEmbedKey = tab.embedKey;
        if (!this.dialogForm[tabEmbedKey]) {
          this.$set(this.dialogForm, tabEmbedKey, []);
        }
        const embedList = this.dialogForm[tabEmbedKey];
        if (tab.noCheck || (tab.isNULL && embedList.length == 0)) {
          continue;
        }
        //isNULL是list可以为空
        if (embedList.length == 0) {
          this.$message.error(`请添加${tab.embedTitle}`);
          return true;
        }
        if (
          this.$refs[tabEmbedKey] ||
          this.activeOperDialogInfo.Oper == "ADD"
          //编辑的时候，可能没打开第二个tab就直接点确定了。
        ) {
          if (
            this.activeOperDialogInfo.Oper == "ADD" &&
            !this.$refs[tabEmbedKey]
          ) {
            this.$message.error(`请添加${tab.embedTitle}`);
            return true;
          }
          if (this.$refs[tabEmbedKey].length) {
            const returnInfo = this.$refs[tabEmbedKey][0].checkRequired();
            if (returnInfo) {
              this.$message.error(`请输入${tab.embedTitle}中${returnInfo}`);
              return true;
            }
          }
        }
      }
      return false;
    },
    [ComponentOpr.ADD]() {
      this.showColumnAction();
      this.beforeOpenAddDialog();
      this.dialogForm = this.Curd.getDefaultDialogForm.call(this);
      this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
      this.openDialog();
      this.$nextTick(() => {
        this.disabledAllResetEmbed();
        this.$refs.weForm.disableReset();
      });
    },

    handleParams(params) {
      /*
      默认如果有toApiKey和toApiName时会执行
      所用场景，后端返回的只是一个idList的时候，例如  toApiKey：id,toApiName: bomList ，提交时就是返回bomList:[1,2]
      */
      if (this.tabList && this.tabList.length) {
        this.tabList.forEach((tab) => {
          if (tab.toApiKey && tab.toApiName) {
            if (!params[tab.embedKey]) {
              this.$set(params, tab.embedKey, []);
            }
            params[tab.toApiName] = params[tab.embedKey].map(
              (e) => e[tab.toApiKey]
            );
          }
        });
      }
      return params;
    },
    ["confirm" + ComponentOpr.ADD](params) {
      this.handleParams(params);
      this.$refs.weForm.validateState((res) => {
        if (res && !this.checkRequired()) {
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
      this.handleParams(params);
      this.$refs.weForm.validateState((res) => {
        if (res && !this.checkRequired()) {
          this.confirmLoading = true;
          this.apis
            .edit(params)
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
  },
};
