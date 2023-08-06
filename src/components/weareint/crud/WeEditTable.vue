<template>
  <div class="mt-xl">
    <a-table
      :tableKey="tableKey"
      :columns="tableColumns"
      :data-source="formatTableData"
      :loading="loading"
      v-bind="attr"
      :pagination="havePagination ? pagination : false"
      :rowKey="selectRowKey"
      :customRow="customRow"
      :scroll="computeScroll()"
      :bordered="true"
      class="edit-table"
      @change="handleTableChange"
    >
      <span
        :slot="slotTitle.key"
        v-for="slotTitle in slotsTiles"
        :key="slotTitle.key"
        ><span style="color: red">*</span>{{ slotTitle.title }}</span
      >
      <!-- scopedSlot -->
      <!-- <template slot-scope="text, record, index" slot="action">
        <slot name="action" v-bind="{ text, record, index }"></slot>
      </template> -->
      <template
        slot-scope="text, record, index"
        :slot="slot"
        v-for="slot in Object.keys($scopedSlots).filter(
          (key) => key !== 'expandedRowRender'
        )"
      >
        <slot :name="slot" v-bind="{ text, record, index }"></slot>
      </template>

      <div
        :slot="item.key"
        slot-scope="text, record, index"
        v-for="item in tableColumns.filter(
          (e) =>
            e.scopedSlots &&
            e.scopedSlots.customRender !== 'action' &&
            e.scopedSlots.customRender.indexOf('Slot') == -1
        )"
        :key="item.key"
      >
        <a-tooltip placement="topRight">
          <template
            slot="title"
            v-if="item.toolipFunc && item.toolipFunc(record).length"
          >
            <!--用toolipFunc 不要用toolipKey -->
            <div>
              <p v-for="i in item.toolipFunc(record)" :key="i">{{ i }}</p>
            </div>
          </template>
          <component
            allowClear
            :is="item.component"
            v-if="item.scopedSlots"
            v-model="record[item.key]"
            :maxLength="countMaxLength(item)"
            v-bind="item.attr"
            :record="record"
            :supplySearch="
              item.attr &&
              item.attr.supplySearchFunc &&
              item.attr.supplySearchFunc(record)
            "
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            :style="{
              width: computedItemWidth(item.width) || defaultItemWidth,
            }"
            :disabled="computedDisabled(record, item)"
            @change="(v) => item.cb && item.cb(v, record, value, index)"
            @blur="(v) => item.blur && item.blur(v, record, index)"
          >
            <template v-if="item.component === ComponentSet.SELECT">
              <a-select-option
                v-for="item in item.options"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </template>
            <template v-if="item.component === ComponentSet.RADIOGROUP">
              <a-radio
                v-for="item in item.options"
                :key="item.value"
                :value="item.value"
                :label="v.label"
              >
                {{ item.label }}
              </a-radio>
            </template>
          </component>
          <span v-else>{{ record[item.key] }}</span>
        </a-tooltip>
      </div>
      <!-- 展开行 -->
      <template
        slot-scope="record, index, indent, expanded"
        :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
      >
        <slot
          v-bind="{ record, index, indent, expanded }"
          :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
        ></slot>
      </template>

      <!-- 添加序号 -->
      <div slot="index" slot-scope="text, record, index">
        {{ index + 1 }}
      </div>
      <div slot="pageIndex" slot-scope="text, record, index">
        {{
          index +
          1 +
          (havePagination ? pagination.pageSize : pagination.size) *
            (pagination.current - 1)
        }}
      </div>
    </a-table>
  </div>
</template>

<script>
import moment from "moment";
import { ComponentSet } from "@/components/weareint/properties";
import { countMaxLength } from "./utils";

export default {
  name: "WeEditTable",
  props: {
    title: String,
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    border: {
      type: Boolean,
      default: false,
    },
    havePagination: Boolean,
    plusWidth: Boolean, //需要增加详情侯最后一行的宽度，一般不需要用,只有都是可变组件且加上操作长度恰好等于table长度的时候
    columns: Array, // 列表列数据
    embedCurd: Object,
    addSerial: Boolean, // 添加计算序号
    addLocalSerial: Boolean, // 添加本页序号
    attr: Object, // a-table属性
    selectedRows: Array, // 所选择的行
    draggable: Boolean, //
    rowKey: {
      // 行唯一标识
      type: [String, Function],
      default: "id",
    },
    ellipsis: {
      type: Boolean,
      default: true,
    },
    scroll: Object,
    selectRowKey: String,
    handleRow: Function,
    dialogInfo: {
      //为了隐藏掉操作栏
      type: Object,
      default: () => {
        return {};
      },
    },
    actionRemoveKeys: {
      //为了隐藏掉操作栏
      type: Array,
      default: () => {
        return ["DETAIL"];
      },
    }, //所有要删除action的key 如['DETAIL','APPROVAL']
  },
  mounted() {
    this.getDefaultDialogValue();
    this.getRequiredColumns();
    this.$nextTick(() => {
      this.initObserve();
    });
  },
  computed: {
    // 格式化tableData
    tableColumns() {
      let customRender = "";
      let indexCustomRender = {};
      let columns = this.columns.map((item) => {
        if (!item.width && item.component) {
          item.width = item.width || this.defaultColumnWidth;
        }
        item.ellipsis =
          item.ellipsis === undefined ? this.ellipsis : item.ellipsis;
        if (item.scopedSlots && item.scopedSlots.customRender == "action") {
          item.fixed = item.fixed || "right";
          item.width = item.width || 80;
          item.align = item.align || "center";
        }
        if (item.required) {
          delete item.title;
          this.$set(item, "slots", { title: `${item.key}Title` });
          if (!this.slotsTiles.find((e) => e.title == item.label)) {
            this.slotsTiles.push({
              title: item.label,
              key: `${item.key}Title`,
            });
          }
        }
        return item;
      });
      if (this.actionRemoveKeys.includes(this.dialogInfo.Oper)) {
        columns = columns.filter((item, index) => {
          const ifAction =
            item.scopedSlots && item.scopedSlots.customRender == "action";
          if (ifAction && this.plusWidth) {
            columns[index - 1].width += item.width;
          }
          return !ifAction;
        });
      }
      if (this.addLocalSerial) {
        customRender = "index";
        indexCustomRender = {
          title: "序号",
          scopedSlots: { customRender: customRender },
          width: 80,
          fixed: "left",
          align: "center",
        };
      } else if (this.addSerial && this.pagination) {
        customRender = "pageIndex";
        indexCustomRender = {
          title: "序号",
          scopedSlots: { customRender: customRender },
          width: 80,
          fixed: "left",
          align: "center",
        };
      }
      return [indexCustomRender, ...columns];
    },

    formatTableData: {
      get() {
        let datas = this.value;
        this.columns.forEach((item) => {
          item.title = !item.required ? item.label : undefined;
          item.dataIndex = item.key;
          // 如果是字典表
          if (item.mapper && datas) {
            datas.forEach((ele) => {
              ele[item.key + "WithMapper"] = this.$w.getLabel(
                ele[item.key],
                item.mapper
              );
            });
            item.dataIndex = item.key + "WithMapper";
          }
          // 如果是时间格式类型
          if (item.timeFormat && datas) {
            datas.forEach((ele) => {
              ele[item.key + "WithTimeFormat"] = moment(ele[item.key]).format(
                item.timeFormat
              );
            });
            item.dataIndex = item.key + "WithTimeFormat";
          }
          // 如果要加单位
          if (item.unit && datas) {
            datas.forEach((ele) => {
              ele[item.key + "WithUnit"] = ele[item.key] + item.unit;
            });
            item.dataIndex = item.key + "WithUnit";
          }
        });
        return datas;
      },
      set() {},
    },
  },

  data() {
    return {
      slotsTiles: [],
      disabled: false,
      ComponentSet,
      loading: false,
      defaultColumnWidth: 150, //这边得要数字
      defaultItemWidth: "140px", //不可是140会有问题
      defaultDialogValue: undefined,
      requiredColumns: [],
      sourceObj: {},
      tableKey: "", // 用于解决固定列错位问题
      pagination: { pageSize: 10, current: 1 },
    };
  },
  methods: {
    computeScroll() {
      if (this.scroll) {
        if (!this.scroll.x && this.scroll.y) {
          this.$set(this.scroll, "x", 800);
        }
        return this.scroll;
      } else {
        return { x: 800 };
      }
    },
    handleTableChange(pagination) {
      this.pagination = pagination;
    },
    countMaxLength,
    computedItemWidth(columnWidth) {
      if (typeof columnWidth == "number") {
        return columnWidth - 10 + "px";
      }
      if (typeof columnWidth == "string") {
        return Number(columnWidth.replace("px", "")) - 10 + "px";
      }
    },
    deleteItem(index) {
      const total = this.value.length;
      let deleteIndex = index;
      if (this.havePagination) {
        const current = this.pagination.current ? this.pagination.current : 1;
        deleteIndex = (current - 1) * this.pagination.pageSize + index;
        if (
          total == (current - 1) * this.pagination.pageSize + 1 &&
          current != 1
        ) {
          //如果是最后一页的最后一条，而且当前页正好是最后一页的时候，current要放到上一页
          this.pagination.current--;
        }
      }
      this.value.splice(deleteIndex, 1);
    },
    initObserve() {
      const tableDom = document.querySelector(".edit-table");
      if (tableDom) {
        let resizeObserver = new ResizeObserver(
          debounce(() => {
            this.tableKey = new Date().getTime().toString();
          }, 500)
        );
        resizeObserver.observe(tableDom);
      }
      function debounce(fn, wait) {
        let timeout = null;
        return function () {
          if (timeout !== null) clearTimeout(timeout);
          timeout = setTimeout(fn, wait);
        };
      }
    },
    computedDisabled(record, item) {
      if (record.disabledKeys) {
        const i = record.disabledKeys.find((e) => e.key === item.key);
        if (i) {
          return i.value;
        }
      }
      return (item.attr && item.attr.disabled) || this.disabled;
    },
    getRequiredColumns() {
      this.requiredColumns = this.columns.filter((e) => e.required);
    },
    getDefaultDialogValue() {
      const defaultColumnsValue = this.columns;
      if (defaultColumnsValue.length > 0) {
        this.defaultDialogValue = {};
        defaultColumnsValue.map((e) => {
          this.defaultDialogValue[e.key] = e.defaultValue;
        });
      }
    },
    addEmbed() {
      const tableData = this.$_.cloneDeep(this.value);
      let pushRow = this.$_.cloneDeep(this.defaultDialogValue);
      const allRows = [...tableData, pushRow];
      this.$emit("input", allRows);
    },
    checkRequired() {
      if (this.requiredColumns.length > 0) {
        for (let i = 0; i < this.value.length; i++) {
          const v = this.value[i];
          for (let j = 0; j < this.requiredColumns.length; j++) {
            const c = this.requiredColumns[j];
            if (
              v[c.key] === undefined ||
              v[c.key] === null ||
              v[c.key] === ""
            ) {
              // this.$message.error(`请输入第${i + 1}行${c.label}的值`);
              // return true;
              return `第${i + 1}行${c.label}的值`;
            }
          }
        }
      }
      return false;
    },
    // 分页改变
    handlePaginationChange(val, type) {
      console.log("page", val, type);
      this.pagination[type] = val;
    },
    handleOperation(data, record, index) {
      console.log("data", data, record, index);
    },
    // 前端删除行
    deleteLine(value, key) {
      const obj = this.$_.cloneDeep(this.formatTableData);
      obj.forEach((val, idx) => {
        if (val[key] === value) {
          this.formatTableData.splice(idx, 1);
        }
      });
    },
    setRowDisabled(row, key, value) {
      row.disabledKeys = row.disabledKeys || [];
      const item = row.disabledKeys.find((e) => e.key === key);
      if (item) {
        item.value = true;
      } else {
        row.disabledKeys.push({ key: key, value: value });
      }
    },
    setRowValue(row, key, value) {
      row[key] = value;
    },
    disabledAll() {
      this.disabled = true;
    },
    disableReset() {
      this.disabled = false;
    },
    customRow(record, index) {
      return {
        props: {
          draggable: "true",
        },
        style: {
          cursor: "pointer",
        },
        on: {
          // 鼠标移入
          mouseenter: (event) => {
            if (!this.draggable) {
              return;
            }
            // 兼容IE
            var ev = event || window.event;
            ev.target.draggable = true;
          },
          // 开始拖拽
          dragstart: (event) => {
            if (!this.draggable) {
              return;
            }
            // 兼容IE
            var ev = event || window.event;
            // 阻止冒泡
            ev.stopPropagation();
            // 得到源目标数据
            this.sourceObj = record;
          },
          // 拖动元素经过的元素
          dragover: (event) => {
            if (!this.draggable) {
              return;
            }
            // 兼容 IE
            var ev = event || window.event;
            // 阻止默认行为*/
            ev.preventDefault();
          },
          // 鼠标松开
          drop: (event) => {
            if (!this.draggable) {
              return;
            }
            var ev = event || window.event;
            ev.stopPropagation();
            let deleteIndex;
            this.value.map((e, i) => {
              if (e[this.selectRowKey] === this.sourceObj[this.selectRowKey]) {
                deleteIndex = i;
              }
            });
            this.value.splice(deleteIndex, 1);
            this.value.splice(index, 0, this.sourceObj);
          },
        },
      };
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ant-table-tbody > tr > td > {
  padding: 5px !important;
}

.edit-table {
  /deep/ .opation-container {
    > button,
    > a {
      margin-right: 10px;
      user-select: none;
      border: 0;
      background: transparent;
      cursor: pointer;
      padding: 0 2px;
      color: #5062aa;
      outline: none;

      &:hover {
        color: #7484b8;
      }

      &:active {
        color: #384585;
      }

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
  }

  /deep/ .ant-table:not(.expand-table, .ant-table-bordered) {
    border: 1px solid #e8e9ee;

    .ant-table-tbody > tr {
      &:last-child {
        > td {
          border-bottom: 0;
        }
      }
    }

    .ant-table-body {
      overflow-x: auto !important;

      tr {
        td {
          border-bottom: 1px solid #e8e9ee;
        }

        &:last-child {
          td {
            border-bottom: 0;
          }
        }
      }
    }

    // 表头背景色
    // .ant-table-thead > tr > th {
    //   background: @we-table-thead;
    // }

    // .ant-table-expand-icon-th {
    //   background: @we-table-thead;
    // }
  }

  // 展开行中的table
  /deep/ .expand-table {
    margin: 0 !important;

    .ant-table-column-title {
      color: #909399;
    }

    .ant-table-row {
      &:hover {
        > td {
          background: #f5f7fa !important;
        }
      }
    }
  }
}
</style>
