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
      <div
        class="we-tree-title"
        :style="canSelectRoot ? { cursor: 'pointer' } : {}"
        @click="handleClickTitle"
      >
        {{ title }}
      </div>
      <a-button
        type="primary"
        shape="circle"
        icon="plus"
        size="small"
        @click="handleOperation(ComponentOpr.ADD, root)"
      />
    </div>
    <a-spin :spinning="spinning">
      <div class="we-tree-wrapper" v-if="tableData.length">
        <a-tree
          :tree-data="tableData"
          :replaceFields="replaceFields"
          :selectedKeys="selectedKeys"
          @select="onNodeSelect"
          @expand="onExpand"
          :autoExpandParent="autoExpandParent"
          :expandedKeys="expandedKeys"
        >
          <template #title="nodeData">
            <a-dropdown :trigger="['contextmenu']">
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

              <template #overlay>
                <a-menu @click="({ key }) => handleOperation(key, nodeData)">
                  <a-menu-item
                    v-for="(menu, key) in getOperList(
                      ComponentOprList,
                      nodeData
                    )"
                    :key="key"
                    class="opration-btn"
                  >
                    <div><a-icon :type="menu.icon" />{{ menu.name }}</div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-tree>
      </div>
    </a-spin>
    <slot></slot>
  </div>
</template>

<script>
import { ComponentOpr } from "@/components/weareint/properties";

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
    spinning: Boolean,
    title: {
      // tree标题
      type: String,
      default: "",
    },
    root: {
      type: Object,
      default() {
        return { parentId: null, name: "根节点" };
      },
    },
    canSelectRoot: {
      type: Boolean,
      default: true,
    }, //是否可选根节点
    tableData: Array,
    ComponentOprList: {
      type: Object,
      default() {
        return {
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
        };
      },
    },
    autoExpandParent: Boolean,
    expandedKeys: Array,
    computedOpList: Function,
    selectedKeys: Array,
  },
  data() {
    return {
      ComponentOpr,
      searchValue: "",
      findSearchItem: false,
    };
  },
  computed: {
    originTitle() {
      return this.replaceFields && this.replaceFields.title
        ? this.replaceFields.title
        : "title";
    },
  },
  created() {},
  mounted() {},
  methods: {
    getOperList(list, data) {
      if (this.computedOpList) {
        return this.computedOpList(list, data);
      }
      return this.ComponentOprList;
    },
    // 点击操作按钮
    handleOperation(operationKey, oldRow) {
      if (operationKey == "STOP") {
        return;
      }
      this.$emit("handleOperation", operationKey, oldRow);
    },

    onSearchChange: debounce(function (e) {
      const value = e.target.value;
      this.searchValue = value;
      this.autoExpandParent = true;
      const expandedKeys = this.getSearchkeys(this.tableData, value);
      if (value) {
        this.findSearchItem = !(expandedKeys.length > 0);
      } else {
        this.findSearchItem = false;
      }
      this.onExpand(expandedKeys);
    }, 300),
    onNodeSelect(selectedKeys) {
      if (selectedKeys.length == 0 && !this.canSelectRoot) {
        return;
      }
      const [key] = selectedKeys;
      const data = this.findData(key);
      this.$emit("onNodeSelect", key, data);
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
      if (!this.canSelectRoot) {
        return;
      }
      this.onNodeSelect([null]);
    },
    onExpand(expandedKeys) {
      this.$emit("onExpand", expandedKeys);
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
.we-tree-container {
  background-color: white;

  .we-tree-title-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .we-tree-title {
      font-size: 16px;
      font-weight: 500;
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
  white-space: nowrap;
}
</style>
