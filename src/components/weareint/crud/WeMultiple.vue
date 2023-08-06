<template>
  <div>
    <slot>
      <a-input
        @click="startSelect"
        @clear="clear"
        :disabled="disabled"
        :readOnly="true"
        :value="formatValue"
        v-if="haveInput"
      ></a-input>
      <span v-else-if="$slots.trigger" slot="trigger" @click="startSelect">
        <slot name="trigger"></slot>
      </span>
    </slot>
    <we-dialog
      v-if="Curd"
      btnLeft
      :dialogInfo="activeOperDialogInfo"
      :top="'2%'"
      @onClose="closeDialog"
      @onConfirm="onConfirm"
    >
      <we-search
        :searchs="searchs"
        :searchForm="searchForm"
        @onSearchQuery="onSearchQuery"
        @onSearchReset="onSearchReset"
        v-if="searchs && searchs.length"
      ></we-search>
      <a-card>
        <we-table
          style="margin: 10px"
          v-if="activeOperDialogInfo.visible"
          :columns="tableColumns"
          :pagination="tablePagination"
          :tableData="tableData"
          :addSerial="true"
          :highlight="true"
          :noFixedLeft="true"
          :rowKey="rowKey"
          :noAction="noAction"
          :scroll="scroll"
          :initRefresh="false"
          :checkboxDisableFunc="checkboxDisableFunc"
          :loading="tableDataLoading"
          :selectedRows.sync="selectedRows"
          :type="type"
          :columnTitle="columnTitle"
          @onPaginationChange="refreshTableData"
          @selectedRowChange="selectedRowChange"
        ></we-table>
      </a-card>
    </we-dialog>
  </div>
</template>

<script>
import WeCurdMixin from "@/components/weareint/crud/WeCrudMixin";
export default {
  components: {},
  name: "WeMultiple",
  props: {
    Curd: Object,
    scroll: Object,
    value: [String, Array],
    supplySearch: Object, //外部搜索参数
    disabled: Boolean,
    multipleRows: Array,
    multipleKey: String,
    checkboxDisableFunc: Function,
    generateValueFunc: Function, //与generateValueObject一起使用，可省去有input时编辑，查看等重写工作
    generateValueObject: [Object, Array],
    haveInput: Boolean,
    noAction: {
      type: Boolean,
      default: true,
    },
    isAsync: Boolean,
    rowKey: {
      type: String,
      default: "id",
    },
    customConfrim: Function,
    type: {
      type: String,
      default: "checkbox",
    },
    columnTitle: {
      type: String,
      default: "",
    },
    title: String,
  },
  data() {
    return {
      selectedRows: [],
      refleshTableOnMount: false,
    };
  },
  mixins: [WeCurdMixin],
  computed: {
    formatValue() {
      if (this.multipleKey && this.multipleRows && this.multipleRows.length) {
        return this.multipleRows
          .map((item) => item[this.multipleKey])
          .join(",");
      }
      if (this.generateValueFunc) {
        return this.generateValueFunc(this.generateValueObject);
      }
      return this.value;
    },
  },
  methods: {
    clear() {},
    changeSelection() {},

    startSelect() {
      this.$emit("beforeOpenEmbedDialog");
      this.activeOperDialogInfo.visible = true;
      this.activeOperDialogInfo.title = this.title ? this.title : `请选择`;
      this.searchForm = this.Curd.getDefaultSearchForm
        ? this.Curd.getDefaultSearchForm.call(this)
        : {};
      this.searchForm = Object.assign(this.searchForm, this.supplySearch);
      this.searchs = this.Curd.getSearchSet
        ? this.Curd.getSearchSet.call(this)
        : [];
      this.apis = this.Curd.getApis.call(this);
      this.tableColumns = this.Curd.getTableColumnSet
        ? this.Curd.getTableColumnSet.call(this)
        : [];
      if (this.multipleRows && this.multipleRows.length > 0) {
        this.selectedRows = this.$_.cloneDeep(this.multipleRows);
      }
      this.refreshTableData();
    },
    closeDialog() {
      this.selectedRows = [];
      this.activeOperDialogInfo.visible = false;
      this.$emit("close");
    },
    onConfirm() {
      if (this.customConfrim) {
        this.customConfrim.call(this);
      } else {
        const selectRows = this.$_.cloneDeep(this.selectedRows);
        this.$emit("change", selectRows);
        this.selectedRows = [];
        this.activeOperDialogInfo.visible = false;
      }
    },
    selectedRowChange(e, rows) {
      this.selectedRows = rows;
    },
  },
};
</script>

<style lang="scss" scoped></style>
