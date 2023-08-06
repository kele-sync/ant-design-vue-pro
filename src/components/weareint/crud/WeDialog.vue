<template>
  <a-modal
    :dialogClass="dialogClass"
    :width="width"
    :dialog-style="{ top: '20px' }"
    :visible.sync="dialogInfo.visible"
    :title="dialogInfo.title"
    :maskClosable="false"
    @ok="confirm"
    @cancel="close"
    destroyOnClose
    v-bind="attr"
  >
    <template slot="closeIcon" v-if="ifFullScreen">
      <a-icon
        :type="isFullScreen ? 'fullscreen-exit' : 'fullscreen'"
        style="margin: 0px 0px 0px -20px; padding-right: 13px"
        class="code-box-code-copy anticon-code anticon-code-copy code-box-code-action"
        @click.stop="fullscreen"
      />
      <a-icon
        type="close"
        class="code-box-code-copy anticon-code anticon-code-copy code-box-code-action"
      />
    </template>
    <template slot="footer">
      <a-button
        v-if="dialogInfo.Oper !== ComponentOpr.DETAIL && defaultFooter"
        type="default"
        @click="close"
        >取消</a-button
      >
      <a-button
        :loading="confirmLoading"
        v-if="defaultFooter"
        type="primary"
        @click="confirm"
      >
        {{ dialogInfo.Oper !== ComponentOpr.DETAIL ? okText : "关闭" }}
      </a-button>

      <slot name="customer-footer"></slot>
    </template>
    <slot></slot>
  </a-modal>
</template>

<script>
import { ComponentOpr } from "@/components/weareint/properties";

export default {
  name: "WeDialog",
  data() {
    return {
      ComponentOpr,
      isFullScreen: false,
    };
  },
  computed: {
    dialogClass() {
      return (
        "dialog-" +
        this.btnPosition +
        (this.isFullScreen ? " weFullScreen" : "")
      );
    },
  },
  props: {
    dialogInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    ifFullScreen: { type: Boolean, default: true },
    defaultFooter: { type: Boolean, default: true },
    width: {
      type: [String, Number],
      default: "80%",
    },
    okText: {
      type: String,
      default: "确定",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    btnPosition: {
      type: String,
      default: "right",
    },
    confirmLoading: Boolean,
    attr: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    dialogInfo: {
      handler: function (val) {
        if (!val.visible) {
          this.isFullScreen = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    close() {
      this.$emit("onClose");
      setTimeout(() => {
        this.isFullScreen = false;
      }, 500);
    },
    confirm() {
      this.$emit("onConfirm");
    },
    fullscreen() {
      this.isFullScreen = !this.isFullScreen;
    },
  },
};
</script>

<style lang="less">
.dialog-right .ant-modal-footer {
  text-align: right;
}
.dialog-center .ant-modal-footer {
  text-align: center;
}
.dialog-left .ant-modal-footer {
  text-align: left;
}
.weFullScreen {
  top: 0 !important;
  width: 100vw !important;
  left: 0 !important;
  height: 100vh;
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
    .ant-modal-body {
      flex-grow: 1;
    }
  }
  .ant-modal-body {
    max-height: unset;
  }
}
.ant-modal-body {
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}
.code-box-code-copy:hover {
  transform: scale(1.4);
  color: #116fc6;
}
.anticon-code {
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.code-box-code-action,
.code-box-code-copy {
  width: 25px;
  height: 25px;
  cursor: pointer;
  transition: all 0.24s;
}
</style>
