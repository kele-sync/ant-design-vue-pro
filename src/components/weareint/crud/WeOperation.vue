<template>
  <div class="opation-container">
    <slot name="front"></slot>
    <template v-for="menu in getMenus(menus)">
      <a-button
        v-if="menu.key === ComponentOpr.ADD"
        :key="menu.key"
        type="primary"
        style="margin-bottom: 20px"
        :icon="menu.icon"
        @click="handleOperation(menu)"
        >{{ menu.name }}</a-button
      >
      <a
        v-else
        :class="menu.type"
        :key="menu.key"
        @click="handleOperation(menu)"
      >
        <a-icon :type="menu.icon" /> {{ menu.name }}
      </a>
    </template>
    <template v-for="menu in supplyMenu">
      <a-button
        :key="menu.key"
        v-bind="{ ...menu.attr }"
        @click="handleOperation(menu)"
        >{{ menu.name }}</a-button
      >
    </template>
    <slot></slot>
  </div>
</template>

<script>
import {
  ComponentOpr,
  ComponentOprList,
} from "@/components/weareint/properties";
export default {
  name: "WeOperation",
  props: {
    menus: Array,
    // 自定义按钮组
    supplyMenu: {
      default: () => [],
      type: Array,
    },
    permiObj: {
      //外部传值，防止有相同的名称
      default: () => {},
      type: Object,
    },
    allPass: Boolean,
  },
  data() {
    return {
      ComponentOpr,
    };
  },
  methods: {
    getMenus(menus) {
      return menus.map((menu) =>
        Object.assign({ key: menu }, ComponentOprList[menu])
      );
    },
    handleOperation(operation) {
      operation.cb
        ? operation.cb(operation)
        : this.$emit("onOperation", operation);
    },
    getPermi(key) {
      if (key == ComponentOpr.ENBEDDELETE || this.allPass) {
        return [];
      }
      return this.permiObj && this.permiObj[key] ? [this.permiObj[key]] : [key];
    },
  },
};
</script>

<style lang="less" scoped>
.opation-container {
  > button,
  > a {
    margin-right: 10px;
    user-select: none;
    &:last-child {
      margin-right: 0;
    }
  }

  .danger {
    color: #ff4d4f;
    &:hover {
      color: #ff7875;
    }
    &:active {
      color: #d9363e;
    }
  }
  a[disabled],
  button[disabled] {
    color: rgba(0, 0, 0, 0.25) !important;
    cursor: not-allowed !important;
    pointer-events: none !important;
  }
}
</style>
