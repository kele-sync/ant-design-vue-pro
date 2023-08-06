<template>
  <component :is="hasCard ? 'a-card' : 'div'">
    <div class="mt-xl embed-table">
      <a-table
        :tableKey="tableKey"
        :columns="tableColumns"
        :data-source="formatTableData"
        :loading="loading"
        tableLayout="fixed"
        v-bind="attr"
        size="middle"
        :pagination="havePagination ? pagination : false"
        @change="handleTableChange"
        :bordered="true"
        :rowKey="selectRowKey"
        :customRow="customRow"
        :scroll="computeScroll()"
        :rowSelection="
          selectedRows
            ? {
                selectedRowKeys: selectedRowKeys,
                onChange: updateSelect,
                getCheckboxProps: getCheckboxProps,
              }
            : undefined
        "
      >
        <div
          :slot="slotTitle.key"
          v-for="slotTitle in slotsTiles"
          :key="slotTitle.key"
        >
          <template v-if="slotTitle.isSelf" :name="slotTitle.key">
            <slot :name="slotTitle.key" v-bind="{ slotTitle }"></slot>
          </template>
          <span v-else
            ><span style="color: red">*</span>{{ slotTitle.title }}</span
          >
        </div>
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
              e.scopedSlots.customRender !== 'draggable' &&
              e.scopedSlots.customRender.indexOf('Slot') == -1
          )"
          @mouseenter="leaveDraggableIcon"
          :width="item.width"
          :key="item.key"
          :height="item.height"
        >
          <a-tooltip placement="topRight">
            <template
              slot="title"
              v-if="
                (item.toolipKey &&
                  record[item.toolipKey] &&
                  record[item.toolipKey].length) ||
                (item.toolipFunc &&
                  item.toolipFunc(record) &&
                  item.toolipFunc(record).length)
              "
            >
              <!--用toolipFunc 不要用toolipKey -->
              <div
                style="max-height: 400px; overflow: auto"
                v-if="!item.toolipFunc"
              >
                <p v-for="i in record[item.toolipKey]" :key="i">{{ i }}</p>
              </div>
              <div v-else>
                <p v-for="i in item.toolipFunc(record)" :key="i">{{ i }}</p>
              </div>
            </template>
            <component
              :allowClear="
                typeof item.allowClear === 'boolean' ? item.allowClear : true
              "
              :is="item.component"
              v-if="item.scopedSlots && !record.isText"
              v-model="record[item.key]"
              :maxLength="countMaxLength(item)"
              v-bind="item.attr"
              :style="{
                width: computedItemWidth(item.width, item) || defaultItemWidth,
              }"
              @dropdownVisibleChange="
                (e) => dropdownVisibleChange(e, item, record)
              "
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              optionFilterProp="label"
              :disabled="computedDisabled(record, item)"
              :supplySearch="
                (item.attr &&
                  item.attr.supplySearchFunc &&
                  item.attr.supplySearchFunc(record)) ||
                record['supplySearch']
              "
              :generateValueObject="record"
              :multipleRows="
                record['multipleRows'] ||
                (item.attr &&
                  item.attr.getMultipleRowsFunc &&
                  item.attr.getMultipleRowsFunc(record))
              "
              @beforeOpenEmbedDialog="beforeOpenEmbedDialog(record, index)"
              @change="(value) => callback(value, item, record, index)"
              @blur="(value) => item.blur && item.blur(value, record, index)"
            >
              <template
                v-if="item.component === ComponentSet.SELECT && item.options"
              >
                <a-select-option
                  v-for="it in item.options"
                  :key="it.value"
                  :value="it.value"
                  :disabled="
                    (item.disabledOptionsFunc &&
                      item.disabledOptionsFunc(it, record)) ||
                    !!it.disabled
                  "
                >
                  {{ it.label }}
                </a-select-option>
              </template>
              <template
                v-if="item.component === ComponentSet.SELECT && item.optionsFun"
              >
                <a-select-option
                  v-for="it in item.optionsFun(record, item)"
                  :key="it.value"
                  :value="it.value"
                  :disabled="
                    (item.disabledOptionsFunc &&
                      item.disabledOptionsFunc(it, record)) ||
                    !!it.disabled
                  "
                >
                  {{ it.label }}
                </a-select-option>
              </template>
              <template v-if="item.component === ComponentSet.RADIOGROUP">
                <a-radio
                  v-for="it in item.options"
                  :key="it.value"
                  :value="it.value"
                  :label="item.label"
                  :disabled="
                    (item.disabledOptionsFunc &&
                      item.disabledOptionsFunc(it, record)) ||
                    !!it.disabled
                  "
                >
                  {{ it.label }}
                </a-radio>
              </template>

              <template
                v-if="
                  item.component === ComponentSet.CHECKBOXGROUP &&
                  item.optionsFun
                "
              >
                <div class="checkbox-wrapper">
                  <a-checkbox
                    v-for="it in item.optionsFun(record, item)"
                    :key="it.value"
                    :value="it.value"
                    :disabled="
                      (item.disabledOptionsFunc &&
                        item.disabledOptionsFunc(it, record)) ||
                      !!it.disabled
                    "
                  >
                    {{ it.label }}
                  </a-checkbox>
                </div>
              </template>
            </component>
            <a-tooltip placement="top" v-else>
              <template slot="title">
                <div>
                  {{ getText(record, item) }}
                </div>
              </template>
              <div
                :style="{
                  display: 'block',
                  width: item.width,
                  'word-break': 'keep-all',
                  'white-space': 'nowrap',
                  overflow: 'hidden',
                  'text-overflow': 'ellipsis',
                }"
              >
                {{ getText(record, item) }}
              </div>
            </a-tooltip>

            <span v-if="item.colUnit" :style="{ ...item.unitstyles }">{{
              item.colUnit
            }}</span>
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
        <div
          slot="draggable"
          @mouseenter="clickDraggableIcon"
          style="cursor: pointer"
        >
          <a-icon type="drag" style="color: #165cff" />
        </div>
        <!-- 添加序号 -->
        <div
          slot="index"
          slot-scope="text, record, index"
          @mouseenter="leaveDraggableIcon"
        >
          {{ index + 1 }}
        </div>
        <div
          slot="pageIndex"
          slot-scope="text, record, index"
          @mouseenter="leaveDraggableIcon"
        >
          {{
            index +
            1 +
            (havePagination ? pagination.pageSize : 0) *
              (pagination.current - 1)
          }}
        </div>
      </a-table>
    </div>
    <we-multiple
      v-if="!noDialog && isMultiple"
      :Curd="embedCurd"
      :supplySearch="supplySearch"
      ref="select"
      :selectType="'list'"
      :checkboxDisableFunc="checkboxDisableFuncMultiple"
      :multipleRows="generateMultipleRows()"
      @change="changeMultipleRows"
    ></we-multiple>
    <we-select
      v-if="!noDialog && !isMultiple"
      :Curd="embedCurd"
      ref="select"
      :supplySearch="supplySearchApply"
      :selectType="'list'"
      @change="changeOneRow"
    ></we-select>
  </component>
</template>

<script>
import moment from "moment";
import { ComponentSet } from "@/components/weareint/properties";
import { countMaxLength } from "./utils";

export default {
  name: "WeEmbed",
  props: {
    title: String,
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    addInStart: {
      type: Boolean,
    },
    dialogForm: Object,
    noDialog: Boolean,
    scroll: Object,
    supplySearch: Object,
    embedCurd: Object,
    addSerial: Boolean, // 添加计算序号
    addLocalSerial: Boolean, // 添加本页序号
    havePagination: Boolean, // 分页信息
    attr: Object, // a-table属性
    selectedRows: Array, // 所选择的行
    rowKey: {
      // 行唯一标识
      type: [String, Function],
      default: "id",
    },
    draggable: Boolean,
    noCheck: Boolean, //
    selectRowKey: {
      // 行唯一标识
      type: [String, Function],
      default: "id",
    },
    plusWidth: Boolean, //需要增加详情侯最后一行的宽度，一般不需要用
    handleRow: Function,
    isMultiple: {
      type: Boolean,
      default: true,
    },
    ellipsis: {
      type: Boolean,
      default: true,
    },
    extendDisabledFunc: Function,
    checkboxDisableFunc: Function,
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
    noFixedLeft: Boolean,
    hasCard: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.initColumns();
    this.getDefaultDialogValue();
    this.getRequiredColumns();
    this.initObserve();
  },

  computed: {
    // 格式化tableData
    tableData() {
      return JSON.parse(JSON.stringify(this.value));
    },
    supplySearchApply() {
      return this.supplySearch;
    },
    formatTableData() {
      this.columns.forEach((item) => {
        item.title =
          !item.required && !(item.slots && item.slots.title)
            ? item.label
            : undefined; //title的slots得把之前的title去掉

        item.dataIndex = item.key;
        // 如果是字典表
        if (item.mapper && this.value) {
          this.value.forEach((ele) => {
            ele[item.key + "WithMapper"] = this.$w.getLabel(
              ele[item.key],
              item.mapper
            );
          });
          item.dataIndex = item.key + "WithMapper";
        }
        // 如果是时间格式类型
        if (item.timeFormat && this.value) {
          this.value.forEach((ele) => {
            ele[item.key + "WithTimeFormat"] = moment(ele[item.key]).format(
              item.timeFormat
            );
          });
          item.dataIndex = item.key + "WithTimeFormat";
        }
        // 如果要加单位
        if (item.unit && this.value) {
          this.value.forEach((ele) => {
            ele[item.key + "WithUnit"] = ele[item.key] + item.unit;
          });
          item.dataIndex = item.key + "WithUnit";
        }
      });
      return this.value;
    },
    selectedRowKeys() {
      return this.selectedRows.map((record) => {
        return typeof this.rowKey === "function"
          ? this.rowKey(record)
          : record[this.rowKey];
      });
    },
  },
  data() {
    return {
      disabled: false,
      ComponentSet,
      columns: [], // 列表列数据
      tableColumns: [],
      // tableData: [],
      slotsTiles: [],
      pagination: { pageSize: 10, current: 1 },
      defaultItemWidth: "150px",
      defaultColumnWidth: "160px",
      defaultDialogValue: {},
      requiredColumns: [],
      sourceObj: {},
      tableKey: "", // 用于解决固定列错位问题
      isDraggableStatus: false,
    };
  },
  methods: {
    copyItem(item) {
      this.$emit("copyItem", item.title);
    },
    getText(record, item) {
      const { key, component, options } = item;
      const value = record[key];
      if (item.textFunc) {
        const copyItem = this.$_.cloneDeep(item);
        return item.textFunc(record, copyItem);
      }
      switch (component) {
        case ComponentSet.INPUT:
          return value;
        case ComponentSet.SELECT:
          return options && options.length && value
            ? options.find((v) => v.value === value).label
            : "";
        case item.getText:
          return item.getText(record, key, options);
        default:
          return value;
      }
    },
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
    dropdownVisibleChange(e, item, record) {
      if (e && item.dropdownVisibleChange) {
        item.dropdownVisibleChange(e, item, record);
      }
    },
    countMaxLength,
    computedItemWidth(columnWidth, item) {
      let unitWidth = 0;
      if (item.unitstyles && item.unitstyles.width) {
        if (typeof item.unitstyles.width == "string") {
          unitWidth = Number(item.unitstyles.width.replace("px", ""));
        } else {
          unitWidth = item.unitstyles.width;
        }
      }
      if (typeof columnWidth == "number") {
        return columnWidth - 10 - unitWidth + "px";
      }
      if (typeof columnWidth == "string") {
        return Number(columnWidth.replace("px", "")) - 10 - unitWidth + "px";
      }
    },
    callSelect() {
      this.$refs.select.initPage();
    },
    generateMultipleRows() {
      if (!this.value || this.value.length == 0) {
        return [];
      }
      return this.value.map((e) => {
        const mulitypleRow = { id: e[this.selectRowKey] };
        return mulitypleRow;
      });
    },
    checkboxDisableFuncMultiple(record) {
      const value = this.value ? this.value : [];
      const extendDisabledRows = this.extendDisabledFunc
        ? this.extendDisabledFunc(record, this.value)
        : [];
      const allDisabledRows = [...value, ...extendDisabledRows];
      if (allDisabledRows.length == 0) {
        return false;
      }
      return !!allDisabledRows.find((e) => e[this.selectRowKey] == record.id);
    },
    initObserve() {
      const tableDom = document.querySelector(".embed-table");
      if (tableDom) {
        let resizeObserver = new ResizeObserver(() => {
          setTimeout(() => {
            this.tableKey = new Date().getTime().toString();
          }, 500);
        });
        resizeObserver.observe(tableDom);
      }
    },
    init() {
      this.initColumns();
      this.getDefaultDialogValue();
      this.getRequiredColumns();
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
    clickDraggableIcon() {
      this.isDraggableStatus = true; //这层判断并没有用，以后可能要用，就留着了
    },
    leaveDraggableIcon() {
      this.isDraggableStatus = false;
    },
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
    computedDisabled(record, item) {
      if (record.disabledKeys) {
        const i = record.disabledKeys.find((e) => e.key === item.key);
        if (i) {
          return i.value;
        }
      }
      if (item.disabledFunc) {
        return item.disabledFunc(record);
      }
      return (item.attr && item.attr.disabled) || this.disabled;
    },
    callback(value, item, record, index) {
      if (item.cb) {
        if (item.options) {
          item.optionValue = item.optionValue || "value";
          let find = item.options.find((e) => e[item.optionValue] == value);
          find = find ? find : {};
          return item.cb(value, find, record, index);
        } else {
          return item.cb(value, record, index);
        }
      }
    },
    getColumns() {
      return this.columns;
    },
    setColumns(columns) {
      this.columns = columns;
    },
    initColumns() {
      this.columns = this.embedCurd.getEmbedTableColumnSet
        ? this.embedCurd.getEmbedTableColumnSet
            .call(this)
            .filter((item) => !item.hidden)
        : [];
      let customRender = "";
      let indexCustomRender = [];
      if (this.addLocalSerial || this.addSerial) {
        customRender = "pageIndex";
        indexCustomRender = [
          {
            title: "序号",
            width: "80px",
            fixed: this.noFixedLeft ? undefined : "left",
            scopedSlots: { customRender: customRender },
            align: "center",
          },
        ];
      }
      let draggableRender = [];
      if (this.draggable) {
        customRender = "draggable";
        draggableRender = [
          {
            title: "排序",
            width: "80px",
            scopedSlots: { customRender: customRender },
            fixed: "left",
            align: "center",
          },
        ];
      }
      this.columns.map((column) => {
        column.ellipsis =
          column.ellipsis === undefined ? this.ellipsis : column.ellipsis;
        if (!column.width && column.component) {
          column.width = this.defaultColumnWidth;
        }
        if (column.scopedSlots && column.scopedSlots.customRender == "action") {
          column.fixed = column.fixed || "right";
          column.width = column.width || 80;
          column.align = column.align || "center";
        }
        if (column.required) {
          delete column.title;
          this.$set(column, "slots", { title: `${column.key}Title` });
        }
      });
      this.slotsTiles = this.columns.reduce((res, cur) => {
        if (cur.required) {
          return [...res, { title: cur.label, key: `${cur.key}Title` }];
        } else if (cur.slots && cur.slots.title) {
          return [
            ...res,
            { title: cur.label, key: cur.slots.title, isSelf: true },
          ];
        } else {
          return res;
        }
      }, []);
      if (this.actionRemoveKeys.includes(this.dialogInfo.Oper)) {
        this.columns = this.columns.filter((item, index) => {
          const ifAction =
            item.scopedSlots && item.scopedSlots.customRender == "action";
          if (ifAction && this.plusWidth) {
            this.columns[index - 1].width += item.width;
          }
          return !ifAction;
        });
      }
      this.tableColumns = [
        ...draggableRender,
        ...indexCustomRender,
        ...this.columns,
      ];
    },
    getRequiredColumns() {
      this.requiredColumns = this.columns.filter((e) => e.required);
    },
    getDefaultDialogValue() {
      const defaultColumnsValue = this.columns.filter(
        (e) => e.defaultValue !== undefined
      );
      if (defaultColumnsValue.length > 0) {
        this.defaultDialogValue = {};
        defaultColumnsValue.map((e) => {
          this.defaultDialogValue[e.key] = e.defaultValue;
        });
      }
    },
    checkRequired() {
      if (this.noCheck) {
        return false;
      }
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
              return `第${i + 1}行${c.label}的值`;
            }
          }
        }
      }
      return false;
    },

    // 分页改变
    handlePaginationChange(val, type) {
      this.pagination[type] = val;
      this.$emit("onPaginationChange");
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
    addEmbed() {
      if (this.embedCurd && !this.noDialog) {
        this.$refs.select.startSelect();
      }
      if (this.noDialog) {
        const addItem = this.$_.cloneDeep(this.defaultDialogValue);
        const list = this.addInStart
          ? [addItem, ...this.value]
          : [...this.value, addItem];
        this.$emit("input", list);
      }
    },
    copy() {
      this.$emit("copy");
    },

    startSelect() {
      if (this.embedCurd) {
        this.$refs.select.startSelect();
      }
    },
    changeOneRow(row) {
      const rows = [row];
      const handleRows = this.handleRow(rows);
      this.$emit("input", handleRows);
    },
    changeMultipleRows(rows) {
      if (!rows || rows.length.length == 0) {
        return;
      }
      const handleRows = this.handleRow(rows);
      const tableData = this.$_.cloneDeep(this.value);
      let pushRows = handleRows.filter((e) => {
        return tableData.find(
          (t) => t[this.selectRowKey] == e[this.selectRowKey]
        )
          ? false
          : true;
      });
      if (pushRows.length > 0 && this.defaultDialogValue) {
        pushRows = pushRows.map((e) => {
          for (const key in this.defaultDialogValue) {
            e[key] = e[key] ? e[key] : this.defaultDialogValue[key];
          }
          return e;
        });
      }
      const allRows = this.addInStart
        ? [...pushRows, ...tableData]
        : [...tableData, ...pushRows];
      this.$emit("input", allRows);
    },
    handleOperation(data, record, index) {
      console.log("data", data, record, index);
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
    beforeOpenEmbedDialog(record, index) {
      this.$emit("beforeOpenEmbedDialog", record, index);
      this.$forceUpdate();
    },
    disableReset() {
      this.disabled = false;
    },
    onSelect(e) {
      console.log("onSelect", e);
    },
    customRow(record, index) {
      return {
        props: {
          draggable: "false",
        },
        // style: {
        //   cursor: "pointer",
        // },
        on: {
          //   鼠标移入
          mouseenter: (event) => {
            // console.log("mouseenterList", event);
            var ev = event || window.event;
            if (this.isDraggableStatus) {
              ev.target.draggable = this.draggable;
            } else {
              ev.target.draggable = false;
            }
          },
          // 开始拖拽
          dragstart: (event) => {
            // 兼容IE
            var ev = event || window.event;
            // 阻止冒泡
            ev.stopPropagation();
            // 得到源目标数据
            this.sourceObj = { ...record, dragIndex: index };
          },
          // 拖动元素经过的元素
          dragover: (event) => {
            // 兼容 IE
            var ev = event || window.event;
            // 阻止默认行为*/
            ev.preventDefault();
          },
          // 鼠标松开
          drop: (event) => {
            var ev = event || window.event;
            ev.stopPropagation();
            // let deleteIndex;
            // this.value.map((e, i) => {
            //   if (e[this.selectRowKey] === this.sourceObj[this.selectRowKey]) {
            //     deleteIndex = i;
            //   }
            // });
            const { dragIndex } = this.sourceObj;
            this.value.splice(dragIndex, 1);
            this.value.splice(index, 0, this.sourceObj);
          },
        },
      };
    },
  },
  watch: {
    embedCurd() {
      this.initColumns();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ant-table-tbody > tr > td > {
  padding: 5px !important;
}

.checkbox-wrapper {
  white-space: break-spaces;

  /deep/ .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0;
  }

  /deep/ .ant-checkbox-wrapper {
    margin-right: 8px;
  }
}
</style>
