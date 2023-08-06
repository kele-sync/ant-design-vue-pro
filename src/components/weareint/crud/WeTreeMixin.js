import { ComponentOpr } from "@/components/weareint/properties";
export default {
  data() {
    return {
      searchValue: "",
      selectedKeys: [],
      spinning: false,
      ComponentOprList: {
        EDIT: {
          name: "编辑",
          type: "primary",
          icon: "edit",
        },
        DELETE: {
          name: "删除",
          type: "danger",
          icon: "delete",
        },
        ADD: {
          name: "新增",
          type: "primary",
          icon: "plus",
        },
      },
      expandedKeys: [],
      autoExpandParent: true,
      expendList: [],
      replaceFields: {
        key: "id",
        title: "name",
        children: "childDTOList",
      },
      title: "",
      canSelectRoot:true,
      treeAttr:{}
    };
  },
  created() {},
  methods: {
    onNodeSelect(key, data) {
      this.selectedKeys = [key];
      this.$emit("handleTreeSelect", key, data);
    },
    // 点击操作按钮
    handleOperation(operationKey, oldRow) {
      if (operationKey == "STOP") {
        return;
      }
      const row = this.$_.cloneDeep(oldRow);
      let operation = this.ComponentOprList[operationKey];
      operation.key = operationKey;
      this.activeOperDialogInfo.title = operation.name;
      this.activeOperDialogInfo.Oper = operation.key;
      this[operation.key](row);
      this.$forceUpdate();
    },
    refreshTableData(isDeleteSelf) {
      //isDeleteSelf 判断是否是删除自己后的刷新
      this.tableDataLoading = true;
      let query = this.getTableQuery();
      query.size = 1000000;
      this.apis
        .list(query)
        .then(this.reviseQuery)
        .then((data) => {
          this.tableData = data instanceof Array ? data : data.records;
          this.tableData.push(...this.expendList);
          let findData = undefined;
          if (this.tableData.length > 0) {
            const firstKey = this.tableData[0].id;
            if (this.selectedKeys.length == 0 || isDeleteSelf) {
              this.selectedKeys = this.canSelectRoot ? [] : [firstKey];
            }
            findData = this.tableData.find((e) => e.id == this.selectedKeys[0]);
          }
          this.$emit("handleTreeSelect", findData.id || 0, findData);
          this.$forceUpdate();
        })
        .finally(() => {
          this.tableDataLoading = false;
        });
    },
    [ComponentOpr.DELETE](row) {
      this.$confirm({
        title: "提示",
        content: "是否确认" + this.activeOperDialogInfo.title,
        onOk: () => {
          this.apis.delete([row.id]).then((result) => {
            if (result.code === 20000) {
              const [key] = this.selectedKeys;
              const isDeleteSelf = row.id == key;
              this.refreshTableData(isDeleteSelf);
            }
          });
        },
        onCancel: () => {
          this.$message.info("已取消");
        },
      });
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
  },
};
