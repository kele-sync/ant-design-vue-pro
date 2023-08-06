<template>
  <div class="we-tree-container">
    <a-input-search
      class="we-tree-search"
      placeholder="搜索"
      @change="onSearchChange"
    />
    <span style="color: red; margin-top: 30px" v-if="findSearchItem"
      >未找到相关信息</span
    >
    <div class="we-tree-title-wrapper">
      <div class="we-tree-title" @click="handleClickTitle">{{ title }}</div>

      <a-button
        type="primary"
        shape="circle"
        icon="plus"
        size="small"
        v-if="canConfig"
        @click="
          handleOperation(ComponentOpr.ADD, { parentId: null, name: '根节点' })
        "
      />
    </div>

    <div class="we-tree-wrapper" v-if="tableData.length">
      <a-tree
        :tree-data="tableData"
        :replaceFields="replaceFields"
        :selectedKeys="selectedKeys"
        blockNode
        @select="onNodeSelect"
        @expand="onExpand"
        :autoExpandParent="autoExpandParent"
        :expandedKeys="expandedKeys"
        :class="[scrollFlag ? 'treeScroll' : '']"
      >
        <template #title="nodeData">
          <a-dropdown :trigger="['contextmenu']">
            <!-- <span>{{ nodeData[originTitle] }}</span> -->

            <span
              v-if="nodeData[originTitle].indexOf(searchValue) > -1"
              :title="nodeData[originTitle]"
            >
              {{
                nodeData[originTitle].substr(
                  0,
                  nodeData[originTitle].indexOf(searchValue)
                )
              }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{
                nodeData[originTitle].substr(
                  nodeData[originTitle].indexOf(searchValue) +
                    searchValue.length
                )
              }}
            </span>
            <span v-else :title="nodeData[originTitle]">{{
              nodeData[originTitle]
            }}</span>

            <template #overlay v-if="canConfig">
              <a-menu @click="({ key }) => handleOperation(key, nodeData)">
                <a-menu-item
                  v-for="(menu, key) in ComponentOprList"
                  :key="key"
                  class="opration-btn"
                >
                  <a-icon :type="menu.icon" />{{ menu.name }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </div>

    <we-dialog
      :width="600"
      :dialogInfo="activeOperDialogInfo"
      @onConfirm="onDialogConfirm"
      @onClose="closeDialog"
      :confirmLoading="confirmLoading"
    >
      <we-form
        :formList="dialogFormSetting"
        :dialogForm="dialogForm"
        ref="weForm"
      ></we-form>
    </we-dialog>
  </div>
</template>

<script>
import { ComponentOpr } from "@/components/weareint/properties";
import WeCurdMixin from "@/components/weareint/crud/WeCrudMixin";
import { debounce } from "lodash";

function findItem(key, list, findKey, childKey, item) {
  if (!item.data && list && list.length > 0) {
    const f = list.find((e) => e[findKey] == key);
    if (f) {
      item.data = f;
      return true;
    } else {
      list.find((e) => {
        return findItem(key, e[childKey], findKey, childKey, item);
      });
    }
  }
}

export default {
  name: "WeTree",
  props: {
    scrollFlag: {
      type: Boolean,
      default: false,
    },
    replaceFields: {
      type: Object,
      default() {
        return {
          key: "id",
          title: "name",
          children: "childDTOList",
        };
      },
    },
    title: {
      // tree标题
      type: String,
      default: "",
    },
    Curd: {
      // tree数据
      type: Object,
      default() {
        return {};
      },
    },
    isArrParam: {
      // 是否按数组类型传值
      type: Boolean,
      default: false,
    },
    //是否需要配置功能(右键和添加)
    canConfig: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      searchValue: "",
      selectedKeys: [],
      findSearchItem: false,
      ComponentOprList: {
        ADD: {
          name: "新增",
          type: "primary",
          icon: "plus",
        },
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
      },
      expandedKeys: [],
      autoExpandParent: true,
    };
  },
  mixins: [WeCurdMixin],
  computed: {
    originTitle() {
      return this.replaceFields && this.replaceFields.title
        ? this.replaceFields.title
        : "title";
    },
  },
  methods: {
    refreshTableData() {
      this.tableDataLoading = true;
      let query = this.getTableQuery();
      this.apis
        .list(query)
        .then(this.reviseQuery)
        .then((data) => {
          this.tableDataLoading = false;
          this.tableData = data instanceof Array ? data : data.records;
          this.tablePagination.total = data.total;
          this.expandedKeys = this.getSearchkeys(this.tableData, "");
          this.$emit("getTreeData", this.tableData);
          this.$forceUpdate();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击操作按钮
    handleOperation(operationKey, row) {
      let operation = this.ComponentOprList[operationKey];
      operation.key = operationKey;
      this.activeOperDialogInfo.title = operation.name;
      this.activeOperDialogInfo.Oper = operation.key;
      this[operation.key](row);
      this.$forceUpdate();
    },
    onSearchChange: debounce(function (e) {
      const value = e.target.value;
      this.searchValue = value;
      this.autoExpandParent = true;
      this.expandedKeys = this.getSearchkeys(this.tableData, value);
      if (value) {
        this.findSearchItem = !(this.expandedKeys.length > 0);
      } else {
        this.findSearchItem = false;
      }
    }, 300),
    onNodeSelect(selectedKeys) {
      this.selectedKeys = selectedKeys;
      const [key] = selectedKeys;
      const data = this.findData(key);
      console.log("data", data);
      this.$emit("handleTreeSelect", key, data);
    },
    findData(key) {
      const findKey = this.replaceFields.key;
      const childKey = this.replaceFields.children;
      let item = {};
      findItem(key, this.tableData, findKey, childKey, item);
      return item.data;
    },
    handleClickTitle() {
      // 取消选择
      this.onNodeSelect([null]);
    },
    [ComponentOpr.ADD](node) {
      this.dialogForm = {
        ...this.Curd.getDefaultDialogForm.call(this),
        parentId: node.id,
        activeName: node.name,
      };
      this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
      this.openDialog();
      this.$nextTick(() => {
        this.$refs.weForm.disableReset();
      });
    },
    [ComponentOpr.EDIT](row) {
      this.dialogForm = Object.assign(this.Curd.getDefaultDialogForm(), row);
      this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
      this.dialogForm.activeName = row.name;
      this.openDialog();
      this.$nextTick(() => {
        this.$refs.weForm.disableReset();
      });
    },
    [ComponentOpr.DELETE](row) {
      this.$confirm({
        title: "提示",
        content: "是否确认" + this.activeOperDialogInfo.title,
        onOk: () => {
          this.apis
            .delete([row.id])
            .then((result) => {
              if (result.code === 20000) {
                this.refreshTableData();
              }
            })
            .catch(() => {
              this.$message.error("删除失败");
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
    getSearchkeys(tree, searchValue) {
      // 获取搜索到的keys
      const keys = [];
      let getKeys = (list, value) => {
        list.forEach((item) => {
          const oKey = this.replaceFields.key;
          const oTitle = this.replaceFields.title;
          const oChildren = this.replaceFields.children;
          if (item[oTitle].includes(value)) keys.push(item[oKey]);
          if (item[oChildren] && item[oChildren].length)
            getKeys(item.childDTOList, value);
        });
      };
      getKeys(tree, searchValue);
      getKeys = null;
      return keys;
    },
  },
};
</script>

<style lang="less" scoped>
.treeScroll {
  overflow-y: auto;
  height: 520px;
  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 2px;
    background-color: #ccc;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    opacity: 0.2;
    background: #2a359e;
  }
}
.we-tree-container {
  .we-tree-title-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .we-tree-title {
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
    }
  }

  .we-tree-wrapper {
    border-top: 1px solid #f0f0f0;
    margin-top: 12px;
  }
}
/deep/ .ant-tree li {
  width: 100%;
  overflow: hidden;
  .ant-tree-node-content-wrapper {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
