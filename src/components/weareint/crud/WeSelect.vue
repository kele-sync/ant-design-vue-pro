<template>
  <div>
    <slot>
      <a-input-search
        @click="startSelect(1)"
        @clear="clear"
        :disabled="disabled"
        :readOnly="true"
        :value="value"
        @search="startSelect(2)"
        v-if="selectType === 'input'"
      >
        <a-button type="primary" slot="enterButton" :disabled="disabled">
          <a-icon v-if="allowClear && value" type="close-circle" />
          <a-icon v-else type="search" />
        </a-button>
      </a-input-search>
      <!-- 其他触发形式 -->
      <span v-else @click="startSelect">
        <slot name="trigger"></slot>
      </span>
    </slot>
    <we-dialog
      v-if="Curd"
      :dialogInfo="activeOperDialogInfo"
      :top="'2%'"
      @onClose="closeDialog"
      @onConfirm="tableDbClick"
      :attr="{ zIndex: 1002 }"
    >
      <we-search
        v-if="searchs && searchs.length"
        :searchs="searchs"
        :searchForm="searchForm"
        @onSearchQuery="onSearchQuery"
        @onSearchReset="onSearchReset"
      ></we-search>
      <a-card>
        <we-table
          :columns="tableColumns"
          :pagination="havePagination && tablePagination"
          :tableData="tableData"
          :addSerial="true"
          :highlight="true"
          :noFixedLeft="true"
          :initRefresh="false"
          :clickRowColor="true"
          :noAction="noAction"
          :rowKey="rowKey"
          :scroll="scroll"
          :tableDataLoading="tableDataLoading"
          @dbClick="tableDbClick"
          @changeSelection="changeSelection"
          @onPaginationChange="refreshTableData"
          @selectedRowChange="selectedRowChange"
        >
          <template slot="action" slot-scope="{ text, record, index }">
            <slot name="action" v-bind="{ text, record, index }"></slot>
          </template>
        </we-table>
      </a-card>
    </we-dialog>
  </div>
</template>

<script>
import WeCurdMixin from "@/components/weareint/crud/WeCrudMixin";
export default {
  provide() {
    return {
      pageName: this.cptKey,
    };
  },
  name: "WeSelect",
  props: {
    Curd: Object,
    value: [String, Number],
    record: Object,
    supplySearch: Object,
    allowClear: {
      type: Boolean,
      default: false,
    },
    supplySearchFuc: {
      type: Function,
      default: null,
    },
    disabled: Boolean,
    noAction: {
      type: Boolean,
      default: true,
    },
    scroll: Object,
    rowKey: {
      // 行唯一标识
      type: String,
      default: "id",
    },
    havePagination: {
      type: Boolean,
      default: true,
    },
    selectType: {
      type: String,
      default: "input",
    },
    cptKey: String,
    cptTitle: String,
  },
  data() {
    return {
      selection: {}, // 多选的情况下选择值
      refleshTableOnMount: false,
      tableDataLoading: false,
    };
  },
  mixins: [WeCurdMixin],
  methods: {
    clear() {
      this.selection = {};
    },
    getTableQuery() {
      let { current, size } = this.tablePagination;
      return Object.assign({}, this.searchForm, this.supplySearch, {
        current,
        size,
      });
    },
    tableDbClick(record) {
      if (record) {
        this.selection = record;
      }
      if (!this.selection) {
        this.$message.warning("请选择一行数据");
        return;
      }
      this.$emit(
        "change",
        this.$_.cloneDeep(this.selection),
        this.$_.cloneDeep(this.record)
      );
      this.closeDialog();
    },
    closeDialog() {
      this.resetFormValidate();
      this.activeOperDialogInfo.visible = false;
      let defaultSearch = this.Curd.getDefaultSearchForm
        ? this.Curd.getDefaultSearchForm.call(this)
        : {};
      for (const key in this.searchForm) {
        this.searchForm[key] = defaultSearch[key];
      }
    },
    changeSelection(v) {
      this.selection = v;
    },
    startSelect(key) {
      if (!this.allowClear || !this.value || key === 1) {
        this.$emit("beforeOpenEmbedDialog");
        if (this.supplySearchFuc) {
          this.searchForm = { ...this.searchForm, ...this.supplySearchFuc() };
        }
        if (this.supplySearch) {
          this.searchForm = { ...this.searchForm, ...this.supplySearch };
        }
        this.activeOperDialogInfo.visible = true;
        this.activeOperDialogInfo.title = `请选择`;
        this.refreshTableData();
      } else {
        this.$emit("change", "");
      }
    },
    selectedRowChange(e, rows) {
      this.$emit("change", this.$_.cloneDeep(rows));
    },
    rowClassName(record, index) {
      return this.rowIndex === index ? "changeColor" : "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
