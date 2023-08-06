<template>
  <div class="mt-xl we-table">
    <a-table
      :tableKey="tableKey"
      ref="we-table"
      :columns="tableColumns"
      :data-source="formatTableData"
      :loading="loading"
      tableLayout="fixed"
      v-bind="attr"
      :customRow="customRowFn"
      :expandedRowKeys="expandedRowKeys"
      :expandIconAsCell="expandIconAsCell"
      :expandIconColumnIndex="expandIconColumnIndex"
      :pagination="false"
      :bordered="true"
      :scroll="scroll || { x: xScroll }"
      :rowKey="rowKey"
      @change="handleTableChange"
      @expand="expand"
      :rowSelection="
        selectedRows
          ? {
              selectedRowKeys: selectedRowKeys,
              onChange: updateSelect,
              getCheckboxProps: getCheckboxProps,
              type: type,
              columnTitle: columnTitle,
            }
          : undefined
      "
      :rowClassName="rowClassName ? rowClassName : changeRowColor"
      class="rowColor"
      size="middle"
    >
      <div
        :slot="item.key"
        slot-scope="text, record"
        v-for="item in tableColumns.filter(
          (e) =>
            e.scopedSlots &&
            e.scopedSlots.customRender !== 'action' &&
            e.scopedSlots.customRender.indexOf('Slot') == -1
        )"
        :style="{ width: item.width }"
        :key="item.key"
      >
        <a-tag
          style="margin-top: 0"
          v-if="item.mapper"
          :color="generateColor(item.mapper, text)"
          >{{ text }}</a-tag
        >
        <a-switch
          v-else-if="item.component == ComponentSet.SWITCH"
          v-bind="item.attr"
          v-hasPermi="getPermi(item)"
          v-model="record[item.key + 'WithSwitch']"
          @change="(e) => item.cb && item.cb(e, record)"
        />
        <div v-else-if="item.component == ComponentSet.TAGLIST && text">
          <a-tooltip placement="topRight">
            <template slot="title">
              <!--用toolipFunc 不要用toolipKey -->
              <a-tag
                style="margin-top: 3px"
                :style="item.clickTag && { cursor: 'pointer' }"
                v-for="(i, k) in item.computedList(text, record)"
                @click="item.clickTag && item.clickTag(i, k, text, record)"
                v-bind="item.attr"
                :key="k"
                >{{ i }}</a-tag
              >
            </template>
            <span>{{
              (item.showText && item.showText(text)) || computeTagText(text)
            }}</span>
          </a-tooltip>
        </div>
        <span v-else>{{ text }}</span>
      </div>

      <!-- scopedSlot -->
      <template
        slot-scope="text, record, index"
        :slot="slot"
        v-for="slot in Object.keys($scopedSlots).filter(
          (key) => key !== 'expandedRowRender'
        )"
      >
        <slot :name="slot" v-bind="{ text, record, index }"></slot>
      </template>

      <!-- slot -->
      <template :slot="slot" v-for="slot in Object.keys($slots)">
        <slot :name="slot"></slot>
      </template>

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
      <template slot="index" slot-scope="text, record, index">
        {{ index + 1 }}
      </template>
      <template slot="pageIndex" slot-scope="text, record, index">
        {{ index + 1 + pagination.size * (pagination.current - 1) }}
      </template>

      <!-- 状态列 -->
      <template slot="weTag" slot-scope="text, record">
        <we-tag :title="text" :type="record[weTagUniqueKey]" />
      </template>
    </a-table>

    <!-- 分页 -->
    <a-pagination
      style="float: right; margin-top: 10px"
      v-if="pagination"
      :current.sync="pagination.current"
      :pageSizeOptions="['10', '20', '50', '100']"
      :pageSize.sync="pagination.size"
      :showLessItems="true"
      :showQuickJumper="false"
      :showSizeChanger="true"
      :total="pagination.total"
      :show-total="(total) => `共 ${total} 条`"
      @showSizeChange="(current, size) => handlePaginationChange(size, 'size')"
      @change="(page, pageSize) => handlePaginationChange(page, 'current')"
    />
  </div>
</template>

<script>
import moment from "moment";
import { cutOffAction } from "@/components/weareint/crud/utils";
import { ComponentSet } from "@/components/weareint/properties";

// function cellObj(minWidth) {
//     let style = { width: minWidth + 'px' }
//     if (minWidth)
//         return {
//             customHeaderCell: () => ({ style }),
//             customCell: () => ({ style }),
//         }
//     else return {}
// }
export default {
  name: "WeTable",
  props: {
    tableData: Array, // 列表数据
    columns: Array, // 列表列数据
    addSerial: Boolean, // 添加计算序号
    addLocalSerial: Boolean, // 添加本页序号
    pagination: [Object, Boolean], // 分页信息
    loading: Boolean, // loading状态
    attr: Object, // a-table属性
    selectedRows: Array, // 所选择的行
    expandedRowKeys: Array, // 展开行
    noFixedLeft: Boolean,
    noAction: Boolean,
    expandIconAsCell: {
      type: Boolean, //
      default: false, //
    },
    expandIconColumnIndex: {
      type: [Number, Boolean],
      default: 0, //
    },
    scroll: Object,
    checkboxDisableFunc: Function,
    clickRowColor: Boolean,
    rowClassName: Function,
    customCell: Function,
    customRowFunc: Function,
    childKey: String,
    rowKey: {
      // 行唯一标识
      type: String,
      default: "id",
    },
    cellMinWidth: {
      // 单元格最小宽度
      type: Number,
      default: 140,
    },
    ellipsis: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "checkbox",
    },
    columnTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      ComponentSet,
      weTagUniqueKey: Symbol(), // 状态列的唯一key值
      rowIndex: "", //单击选中的行
      choosenRow: undefined,
      colorMapper: ["green", "red", "pink", "orange", "cyan", "purple", "grey"],
      // storageColumn: null,
      tableKey: "", // 用于解决固定列错位问题
    };
  },
  mounted() {
    const tableDom = document.querySelector(".we-table");
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
  computed: {
    // 获取表格横向滚动距离 支持表头分组 广度优先遍历 先入先出
    xScroll() {
      let queue = [...this.columns];
      let x = this.addLocalSerial || this.addSerial ? 80 : 0;
      while (queue.length > 0) {
        const { width, minWidth, children } = queue.shift();
        if (!children) x += width || minWidth || this.cellMinWidth;
        if (children)
          for (const key in children) {
            queue.push(children[key]);
          }
      }
      // this.columns.forEach(({ width, minWidth }) => {
      //     x += width || minWidth || this.cellMinWidth;
      //   });
      return x;
    },
    // 处理columns 支持表头分组 广度优先遍历 先入先出
    tableColumns() {
      let columns = this.columns;
      let queue = [...columns];
      while (queue.length > 0) {
        let item = queue.shift();
        !item.width && Reflect.deleteProperty(item, "width");
        if (item.scopedSlots && item.scopedSlots.customRender == "action") {
          item.fixed = item.fixed || "right";
          item.width = item.width || 280;
        }
        item.ellipsis =
          item.ellipsis === undefined ? this.ellipsis : item.ellipsis;
        if (item.children)
          for (const key in item.children) {
            queue.push(item.children[key]);
          }
      }
      columns = this.noAction ? cutOffAction(columns) : columns;
      let customRender = "";
      if (this.addLocalSerial) {
        customRender = "index";
      } else if (this.addSerial) {
        customRender = this.pagination ? "pageIndex" : "index";
      } else {
        return columns;
      }

      return [
        {
          title: "序号",
          align: "center",
          width: 80,
          fixed: this.noFixedLeft ? undefined : "left",
          scopedSlots: { customRender: customRender },
        },
        ...columns,
      ];
    },
    formatTableData() {
      let queue = [...this.columns];
      while (queue.length > 0) {
        let item = queue.shift();
        if (!(item.slots && item.slots.title)) {
          item.title = item.label;
        }

        if (!item.children) {
          item.dataIndex = item.key;
          this.formatTable(this.tableData, item);
        }
        if (item.children)
          for (const index in item.children) {
            queue.push(item.children[index]);
          }
      }
      // this.columns.forEach((item) => {
      //   item.title = item.label;
      //   item.dataIndex = item.key;

      //   this.formatTable(this.tableData, item);
      // });
      return this.tableData;
    },
    // 选择行的keys
    selectedRowKeys() {
      return this.selectedRows.map((record) => {
        return typeof this.rowKey === "function"
          ? this.rowKey(record)
          : record[this.rowKey];
      });
    },
  },
  methods: {
    getPermi(item) {
      return item.permi || [];
    },
    handleTableChange(pagination, filters, sorter) {
      let sort = [];
      if (sorter && sorter.order) {
        sort = [
          {
            field: sorter.field.split("With")[0],
            order: sorter.order.replace("end", ""),
          },
        ];
      }
      this.$emit("onPaginationChange", sort);
    },
    generateColor(mapper, item) {
      let index = mapper.findIndex((m) => m.label == item);
      return mapper[index] && mapper[index].color
        ? mapper[index].color
        : this.colorMapper[index];
    },
    getCheckboxProps(record) {
      return {
        props: {
          disabled: this.checkboxDisableFunc
            ? this.checkboxDisableFunc(record)
            : false,
        },
      };
    },
    // 行双击事件处理
    customRowFn(record, index) {
      if (this.customRowFunc) {
        return this.customRowFunc(record, index);
      }
      return {
        on: {
          dblclick: () => {
            if (!this.multiple) {
              this.$emit("dbClick", record);
            }
          },
          click: () => {
            this.choosenRow = record;
            this.rowIndex = index;
            this.$emit("changeSelection", record);
          },
        },
      };
    },

    getTagColor(value, mapper) {
      return mapper.find((m) => m.value == value)
        ? mapper.find((m) => m.value == value).color
        : "";
    },
    // 格式化tableData
    formatTable(list, item) {
      if (list && list.length > 0) {
        list.forEach((ele) => {
          if (!ele[this.childKey] || !ele[this.childKey].length) {
            Reflect.deleteProperty(ele, this.childKey);
          }
        });
        if (item.switchMap) {
          list.forEach((ele) => {
            ele[item.key + "WithSwitch"] = item.switchMap(ele);
          });
        }
        if (item.formatFuc) {
          list.forEach((ele) => {
            ele[item.key + "WithFunc"] = item.formatFuc(ele[item.key], ele);
          });
          item.dataIndex = item.key + "WithFunc";
        }
        if (item.mapper) {
          list.forEach((ele) => {
            ele[item.key + "WithMapper"] = this.$w.getLabel(
              ele[item.key],
              item.mapper
            );
            if (ele[this.childKey] && ele[this.childKey].length > 0) {
              this.formatTable(ele[this.childKey], item);
            }
            if (item.component == "a-tag") {
              ele[item.key + "TagColor"] = this.getTagColor(
                ele[item.key],
                item.mapper
              );
            }
          });
          item.dataIndex = item.key + "WithMapper";
        }
        if (item.timeFormat) {
          list.forEach((ele) => {
            ele[item.key + "WithTimeFormat"] = moment(ele[item.key]).isValid()
              ? moment(ele[item.key]).format(item.timeFormat)
              : ele[item.key];
            if (ele[this.childKey] && ele[this.childKey].length > 0) {
              this.formatTable(ele[this.childKey], item);
            }
          });
          item.dataIndex = item.key + "WithTimeFormat";
        }
        if (item.unit) {
          list.forEach((ele) => {
            ele[item.key + "WithUnit"] = ele[item.key] + item.unit;
            if (ele[this.childKey] && ele[this.childKey].length > 0) {
              this.formatTable(ele[this.childKey], item);
            }
          });
          item.dataIndex = item.key + "WithUnit";
        }
      }
    },

    // 选择行改变
    updateSelect(selectedRowKeys, selectedRows) {
      const multipleList = [];
      this.selectedRows.forEach((e) => {
        if (
          !this.tableData.find((item) => item[this.rowKey] == e[this.rowKey])
        ) {
          multipleList.push(e);
        }
      });
      multipleList.push(...selectedRows);
      this.$emit("update:selectedRows", multipleList);
      this.$emit("selectedRowChange", selectedRowKeys, multipleList);
    },

    // 分页改变
    handlePaginationChange(val, type) {
      if (type == "size") {
        this.pagination["current"] = 1;
      }
      this.pagination[type] = val;
      this.$emit("onPaginationChange");
    },
    changeRowColor(record, index) {
      if (this.clickRowColor) {
        return this.rowIndex === index ? "changeColor" : "";
      } else {
        return this.rowIndex === index ? "" : "";
      }
    },
    computeTagText(text) {
      if (typeof text == "string") {
        return text;
      }
      if (text && text.length) {
        switch (text.length) {
          case 1:
            return `${text[0]}`;
          case 2:
            return `${text[0]},${text[1]}`;
          default:
            return `${text[0]},${text[1]}...`;
        }
      }
    },
    expand(expanded, record) {
      this.$emit("expand", expanded, record);
    },
  },
};
</script>

<style lang="less" scoped>
.rowColor {
  /deep/ .changeColor {
    background-color: #e1f0e7;
  }
}
/deep/ .warnColor {
  background-color: #f0d1d1;
}
/deep/ .weakWarnColor {
  background-color: #eff0d4;
}
/deep/ .weakPassColor {
  background-color: #c8f0d3;
}

.we-table {
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
