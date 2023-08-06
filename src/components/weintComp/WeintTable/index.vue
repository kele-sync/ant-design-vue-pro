<template>
    <div
        :ref="compUniqueKey + '-container'"
        :id="compUniqueKey + '-container'"
        :class="`weint-table ${curSize || ''} ${popupContainerByTable ? 'popup-by-table' : ''}`"
    >
        <!-- table -->
        <a-spin :spinning="loading" tip="努力加载中...">
            <ve-table
                ref="weint-table"
                :columns="tableColumns"
                :tableData="sortedTableData"
                v-bind="lodash.merge(defaultAttr, attr)"
            />
            <div :ref="compUniqueKey + '-empyt'" v-show="!sortedTableData.length" :class="['empty-data', theme.mode]">
                <a-empty />
            </div>
        </a-spin>

        <!-- 分页 -->
        <div class="weint-pagination" v-if="pagination">
            <div>共 {{ pagination.total || 0 }} 项数据</div>
            <a-pagination
                :pageSizeOptions="['10', '20', '50', '100']"
                :current.sync="pagination.current"
                :pageSize.sync="pagination.size"
                :showLessItems="true"
                :showQuickJumper="showQuickJumper"
                :showSizeChanger="true"
                :total="pagination.total"
                @showSizeChange="(current, size) => handlePaginationChange(size, 'size')"
                @change="(page, pageSize) => handlePaginationChange(page, 'current')"
            />
        </div>

        <!-- 右键菜单 -->
        <Contextmenu :contextMenuInfo.sync="contextMenuInfo" :menus="actionsPermissions" @onChoose="handleClickMenu" />
    </div>
</template>

<script>
import Vue from 'vue';
import 'vue-easytable/libs/theme-default/index.css';
import VueEasytable from 'vue-easytable';
import { VeLocale } from 'vue-easytable';
import zhCN from 'vue-easytable/libs/locale/lang/zh-CN.js';
VeLocale.use(zhCN);
Vue.use(VueEasytable);
import { ComponentSet, ComponentPlaceholder } from '../properties';
import { getvFromObj, findDeep, formatColumnsDeep, buildKey, getLabel } from './utils';
import { getTableConf } from './defaultConf';
import Contextmenu from './Contextmenu';
import Sortable from 'sortablejs';
import { mapState } from 'vuex';
import moment from 'moment';
import lodash from 'lodash';
import * as Lockr from 'lockr';
Lockr.setPrefix(process.env.VUE_APP_LOCKR);
export default {
    name: 'WeintTable',
    components: { Contextmenu },
    inject: { compPrefix: { default: '' } },
    props: {
        compKey: { type: String, default: 'weint-table' }, // 组件唯一标识
        rowKey: { type: String, default: 'id' }, // 行唯一标识
        tableData: Array, // 表格数据
        columns: Array, // 表格列配置
        serialType: { type: String, default: 'current' }, // 序号
        loading: Boolean,
        selectedRows: Array, // 选择行
        disableSelectedRowKeys: { type: Array, default: () => [] }, // 行选择禁用
        expandedRowKeys: Array, // 展开行keys
        expandRender: Function, // 展开行的内容
        attr: { type: Object, default: () => ({}) }, // easy-table自有属性
        tableActions: { type: Array, default: () => [] }, // 右键菜单操作按钮
        hideRightMenus: Boolean, // 是否隐藏右键菜单
        maxHeight: Number, // 表格最大滚动高度
        pagination: [Object, Boolean], // 分页信息
        curSize: String, // 表格尺寸
        showColList: Array, // 表格列可视和顺序配置
        showQuickJumper: { type: Boolean, default: false }, // 是否展示分页快速跳转
        draggable: Boolean, // 是否支持拖拽排序
        popupContainerByTable: Boolean, // 弹出框是否挂载在table上（关系到弹出框能否跟随table滚动）
    },
    data() {
        return {
            lodash,
            sortParams: {}, // 列排序参数
            colWidth: {}, // 缓存的列宽设置
            hasSelect: false, //是否展示选择列
            hasExpend: false, //是否展示展开列
            contextMenuInfo: {}, //右键菜单信息
            tableMaxHeight: 350, // 表格最大滚动高度
            checkAllType: 'none', // 全选按钮状态
            cellMinWidth: 150, // 单元格最小宽度
        };
    },
    computed: {
        ...mapState('setting', ['theme']),
        // 组件唯一标识
        compUniqueKey() {
            return this.compPrefix + this.compKey;
        },
        // table默认配置
        defaultAttr() {
            return getTableConf.call(this);
        },
        // 表格横向滚动距离
        xScroll() {
            const _this = this;
            let x = this.serialType === 'none' && !this.hasSelect ? 0 : 55; // 序号列55宽度
            this.hasExpend && (x += 55); // 展开列55宽度
            this.draggable && (x += 55); // 展开列55宽度
            let columns = lodash.cloneDeep(this.resultColumns);
            (function getx(data) {
                data.forEach(v => {
                    if (v.children && v.checked) {
                        getx(v.children);
                    } else {
                        x += v.checked ? _this.colWidth[v.key] || v.width || _this.cellMinWidth : 0;
                    }
                });
            })(columns);
            return x;
        },
        // 列配置优先取showColList，没有的话拿页面中的原始配置columns
        resultColumns() {
            if (this.showColList && this.showColList.length) {
                return this.showColList.map(v => ({ ...this.columnsInfoBykey[v.key], ...v }));
            } else {
                return formatColumnsDeep(this.columns);
            }
        },
        // 页面中原始列配置
        columnsInfoBykey() {
            let obj = {};
            this.columns.forEach(v => (obj[buildKey(v)] = v));
            return obj;
        },
        // 列最终配置
        tableColumns() {
            const _this = this;
            let columns = lodash.cloneDeep(this.resultColumns).filter(v => v.checked && !v.hidden);
            // 深度遍历格式化columns
            (function formatColumnsDeep(arr) {
                arr.forEach((item, index) => {
                    if (item.children && item.children.length) {
                        formatColumnsDeep(item.children);
                        arr[index] = { ...item, title: item.label, field: item.key };
                    } else {
                        const customRender = (item.scopedSlots && item.scopedSlots.customRender) || '';
                        if (customRender === 'action') {
                            item.key = 'weint-operation';
                        }
                        let obj = {
                            ...item,
                            width: _this.colWidth[item.key] || item.width || _this.cellMinWidth,
                            title: item.label,
                            field: item.key,
                            ellipsis:
                                !customRender &&
                                item.ellipsis === undefined &&
                                item.key !== 'weint-operation' &&
                                item.component !== ComponentSet.TAG
                                    ? true
                                    : item.ellipsis,
                            fixed: item.key === 'weint-operation' ? 'right' : item.fixed,
                            sortBy: item.sort && '',
                            edit: false, // 禁用easytable自带的可编辑属性
                            hasScopedSlots: customRender,
                            oldWeTableRender: _this._generatorOldColumnRender({ column: item }),
                            showTitle: !customRender,
                            // align: item.key !== 'weint-operation' ? 'center' : 'left',
                        };
                        if (!item.renderBodyCell) {
                            // 可编辑
                            if (item.edit === true) {
                                obj.ellipsis = false;
                                obj.renderBodyCell = ({ row, rowIndex }, h) => {
                                    let Comp = item.component || ComponentSet.INPUT;
                                    item.editAttr = item.editAttr || {};
                                    const listeners = {
                                        // input: val => {
                                        //     _this.$set(_this.tableData[rowIndex], item.key, val.target.value);
                                        //     item.input && item.input({ value: val, record: row, index: rowIndex });
                                        // },
                                        change: val => {
                                            _this.$set(
                                                _this.tableData[rowIndex],
                                                item.key,
                                                val.target?.tagName ? val.target.value : val
                                            );
                                            item.change && item.change({ value: val, record: row, index: rowIndex });
                                        },
                                        blur: val => {
                                            item.blur && item.blur({ value: val, record: row, index: rowIndex });
                                        },
                                    };
                                    if (item.editAttr.change) {
                                        if (item.component === ComponentSet.SELECT) {
                                            // 为了兼容老的embed组件下拉框的回调函数的入参
                                            listeners.change = data => {
                                                _this.$set(_this.tableData[rowIndex], item.key, data);
                                                item.editAttr.change(data, item.mapper, row, rowIndex);
                                            };
                                        } else {
                                            listeners.change = data => {
                                                _this.$set(_this.tableData[rowIndex], item.key, data);
                                                item.editAttr.change(data, rowIndex, row);
                                            };
                                        }
                                    }
                                    const dynamicBind = {
                                        props: {
                                            value: row[item.key],
                                            options:
                                                item.mapper instanceof Function
                                                    ? item.mapper(row, rowIndex)
                                                    : item.mapper,
                                            allowClear: true,
                                            placeholder: ComponentPlaceholder[item.component]?.name,
                                            ...item.editAttr,
                                            size: _this.curSize,
                                            getPopupContainer: () =>
                                                document.querySelector(
                                                    `#${_this.compUniqueKey}-container${
                                                        _this.popupContainerByTable ? ' .ve-table-container' : ''
                                                    }`
                                                ),
                                        },
                                        on: listeners,
                                    };
                                    return <Comp style="width:100%" {...dynamicBind}></Comp>;
                                };
                                if (item.required) {
                                    obj.renderHeaderCell = ({ column }) => (
                                        <span class="edit-table-header-required">{column.label}</span>
                                    );
                                }
                            } else {
                                // mapper
                                if (item.mapper) {
                                    obj.renderBodyCell = ({ row, rowIndex }, h) => {
                                        let text = getLabel(getvFromObj(row, item.key), item.mapper);
                                        if (item.component === ComponentSet.TAG) {
                                            let color = item.mapper.find(v => v.value === row[item.key])?.color;
                                            let index = item.mapper.findIndex(m => m.label == text);
                                            const colorMapper =
                                                _this.colorMapper ||
                                                (_this.colorMapper = [
                                                    'green',
                                                    'red',
                                                    'pink',
                                                    'orange',
                                                    'cyan',
                                                    'purple',
                                                    'grey',
                                                ]);
                                            color =
                                                color ||
                                                (item.mapper[index] && item.mapper[index].color
                                                    ? item.mapper[index].color
                                                    : colorMapper[index]);
                                            return (
                                                <a-tag style="margin:0" title={text} color={color}>
                                                    {text}
                                                </a-tag>
                                            );
                                        }
                                        return text || '--';
                                    };
                                }
                                // 时间格式
                                if (item.timeFormat) {
                                    obj.renderBodyCell = ({ row }, h) => {
                                        // 转换后的moment实例如果不是合法的日期，返回--
                                        const m_instance = moment(getvFromObj(row, item.key));
                                        return m_instance.isValid() ? m_instance.format(item.timeFormat) : '--';
                                    };
                                }
                                // 加单位
                                if (item.unit) {
                                    obj.renderBodyCell = ({ row }, h) => getvFromObj(row, item.key) + item.unit;
                                }
                                // 没有数据展示'--'
                                if (!obj.renderBodyCell) {
                                    obj.renderBodyCell = ({ row, column, rowIndex }, h) => {
                                        // 适配插槽
                                        return _this._adapterCellSlot({ row, column, rowIndex, item }, h);
                                    };
                                }
                            }
                        }
                        arr[index] = obj;
                    }
                });
            })(columns);

            // 添加选择、序号、展开列
            let leftColums = [];
            if (this.draggable) {
                leftColums.push({
                    title: '',
                    field: 'draggable',
                    type: 'draggable',
                    width: 55,
                    align: 'center',
                    fixed: 'left',
                    key: 'draggable',
                    operationColumn: true,
                    renderBodyCell: ({ rowIndex }) => {
                        return <we-icon name="draggable" class="drop-icon can-drag" />;
                    },
                });
            }
            if (this.hasSelect) {
                leftColums.push({
                    title: '',
                    field: 'checkbox',
                    type: 'checkbox',
                    width: 55,
                    align: 'center',
                    fixed: 'left',
                    operationColumn: true,
                    key: 'checkbox',
                    renderBodyCell: ({ rowIndex }) => {
                        if (this.serialType === 'current') {
                            return <span class="check-index">{++rowIndex}</span>;
                        }
                        if (this.serialType === 'rise') {
                            return (
                                <span class="check-index">
                                    {++rowIndex + this.pagination.size * (this.pagination.current - 1)}
                                </span>
                            );
                        }
                    },
                    renderHeaderCell: () => (
                        <a-checkbox
                            indeterminate={this.checkAllType === 'indeterminate'}
                            checked={this.checkAllType === 'all'}
                            on-change={this.selectedAllChange}
                        />
                    ),
                });
            }
            if (this.serialType !== 'none' && !this.hasSelect) {
                leftColums.push({
                    title: '序号',
                    field: 'index',
                    key: 'index',
                    width: 55,
                    fixed: 'left',
                    operationColumn: true,
                    renderBodyCell: ({ rowIndex }) => {
                        if (this.serialType === 'current') {
                            return ++rowIndex;
                        }
                        if (this.serialType === 'rise') {
                            return ++rowIndex + this.pagination.size * (this.pagination.current - 1);
                        }
                    },
                });
            }
            if (this.hasExpend) {
                leftColums.push({
                    title: '',
                    field: 'expand',
                    type: 'expand',
                    width: 55,
                    fixed: 'left',
                    key: 'expand',
                });
            }
            return columns.length ? [...leftColums, ...columns] : [];
        },
        // 排序后的tableData
        sortedTableData() {
            let tableData = lodash.cloneDeep(this.tableData);
            for (let k in this.sortParams) {
                if (this.sortParams[k]) {
                    let mapper = findDeep(this.columns, v => v.key === k).mapper;
                    if (mapper) {
                        // 如果该列是mapper，根据映射后的值进行排序
                        let newKey = Symbol(k);
                        tableData.forEach(item => {
                            item[newKey] = getLabel(getvFromObj(item, k), mapper);
                        });
                        tableData = lodash.orderBy(tableData, newKey, this.sortParams[k]);
                    } else {
                        tableData = lodash.orderBy(tableData, k, this.sortParams[k]);
                    }
                }
            }
            return tableData || [];
        },
        // 右键菜单权限
        actionsPermissions() {
            if (!window.microApp) return this.tableActions;
            let data = window.microApp.getData();
            const permissions = data.permission || [];
            return this.tableActions.filter(({ type }) => permissions.includes(type));
        },
    },
    watch: {
        tableData: {
            handler() {
                this.getCheckAllIndeterminate();
                this.setMaxHeight();
            },
            deep: true,
        },
        tableColumns: {
            handler() {
                this.setMinWidth();
            },
            deep: true,
        },
        selectedRows: {
            handler() {
                this.getCheckAllIndeterminate();
            },
            deep: true,
        },
    },
    created() {
        this.hasSelect = !!this.selectedRows;
        this.hasExpend = !!this.expandedRowKeys;
    },
    mounted() {
        this.colWidth = Lockr.get('userConfig')[this.$route.path][this.compUniqueKey] || {};
        this.setMinWidth();
        setTimeout(() => {
            this.setMaxHeight();
        });
        this.draggable && this.startDrag();
    },
    activated() {
        window.addEventListener('resize', this.setMaxHeight);
    },
    deactivated() {
        window.removeEventListener('resize', this.setMaxHeight);
    },
    methods: {
        // 计算每列最小宽度(解决列宽拖动问题)
        setMinWidth() {
            setTimeout(() => {
                const _this = this;
                const containerDom = this.$refs[this.compUniqueKey + '-container'];
                if (containerDom) {
                    let hasSetWidthSum = this.serialType === 'none' && !this.hasSelect ? 0 : 55; // 计算已经设置了的列宽总和
                    this.hasExpend && (hasSetWidthSum += 55);
                    this.draggable && (hasSetWidthSum += 55);
                    let noWidthNum = 0; // 计算未设置列宽的列数
                    (function fn(arr) {
                        arr.forEach(v => {
                            if (v.checked) {
                                if (v.children && v.checked) {
                                    fn(v.children);
                                } else {
                                    hasSetWidthSum += _this.colWidth[v.key] || v.width || 0;
                                    !_this.colWidth[v.key] && !v.width && noWidthNum++;
                                }
                            }
                        });
                    })(this.resultColumns);
                    // console.log('noWidthNum', noWidthNum);
                    // console.log('hasSetWidthSum', hasSetWidthSum);
                    // console.log('containerDom.clientWidth', containerDom.clientWidth);
                    if (noWidthNum > 0) {
                        let hasBorder =
                            window.getComputedStyle(
                                document.querySelector(`#${this.compUniqueKey + '-container'} .ve-table-border-around`)
                            )['border-right-width'] !== '0px';
                        let minWidth = (containerDom.clientWidth - 19 - hasSetWidthSum) / noWidthNum;
                        if (minWidth > 150) {
                            this.cellMinWidth = minWidth;
                        } else {
                            this.cellMinWidth = 150;
                        }
                        // console.log(this.cellMinWidth);
                    }
                }
            });
        },
        // 计算table高度
        setMaxHeight() {
            // function debounce(fn, wait) {
            //     let timeout = null;
            //     return function () {
            //         if (timeout !== null) clearTimeout(timeout);
            //         timeout = setTimeout(fn, wait);
            //     };
            // }
            this.$nextTick(() => {
                if (this.maxHeight) {
                    this.tableMaxHeight = this.maxHeight;
                } else {
                    const containerDom = this.$refs[this.compUniqueKey + '-container'];
                    const emptyDom = this.$refs[this.compUniqueKey + '-empyt'];
                    if (containerDom) {
                        let res = containerDom.clientHeight - (this.pagination ? 64 : 0) - 2 - emptyDom.offsetHeight;
                        // 防止窗口高度过小导致table滚动高度过小
                        if (res > this.tableMaxHeight) {
                            this.tableMaxHeight = res;
                        }
                    }
                    // if (containerDom) {
                    //     let resizeObserver = new ResizeObserver(
                    //         debounce(() => {
                    //             let res = containerDom.clientHeight - (this.pagination ? 64 : 0) - 2;
                    //             if (res > this.tableMaxHeight) {
                    //                 this.tableMaxHeight = res;
                    //             }
                    //         }, 200)
                    //     );
                    //     resizeObserver.observe(containerDom);
                    // }
                }
            });
        },
        // 行选择（全选反选）
        selectedAllChange(e) {
            if (e.target.checked) {
                // 获取当前分页中已选择的行（所有已选择的行 和 当前分页列表的并集）(除去禁用的)
                let currentChoosedRow = lodash
                    .intersectionBy(this.tableData, this.selectedRows, this.rowKey)
                    .filter(v => !this.disableSelectedRowKeys.includes(v[this.rowKey]));
                // 获取当前分页中未选择的行(除去禁用的)
                let currentNotChoosedRow = lodash.xorBy(
                    this.tableData.filter(v => !this.disableSelectedRowKeys.includes(v[this.rowKey])),
                    currentChoosedRow,
                    this.rowKey
                );
                // 合并所有分页中已选择行和当前页未选择行
                this.$emit('update:selectedRows', [...this.selectedRows, ...currentNotChoosedRow]);
            } else {
                // 反选时获取所有分页已选择行 和 当前分页数据的差集(除去禁用的)
                let xor = lodash.xorBy(
                    this.selectedRows,
                    this.tableData.filter(v => !this.disableSelectedRowKeys.includes(v[this.rowKey])),
                    this.rowKey
                );
                this.$emit('update:selectedRows', xor);
            }
        },
        // 行选择
        selectedRowChange({ row, isSelected, selectedRowKeys }) {
            let rows = lodash.cloneDeep(this.selectedRows || []);
            if (isSelected && !rows.find(v => v[this.rowKey] === row[this.rowKey])) {
                rows.push(row);
            }
            if (!isSelected) {
                rows = rows.filter(v => v[this.rowKey] !== row[this.rowKey]);
            }
            this.$emit('update:selectedRows', rows);
        },
        // 获取全选按钮的indeterminate状态
        getCheckAllIndeterminate() {
            this.$nextTick(() => {
                let currentChoosedRow = lodash.intersectionBy(this.tableData, this.selectedRows, this.rowKey);
                if (currentChoosedRow.length === 0) {
                    this.checkAllType = 'none';
                } else {
                    if (currentChoosedRow.length < this.tableData.length) {
                        this.checkAllType = 'indeterminate';
                    } else {
                        this.checkAllType = 'all';
                    }
                }
            });
        },
        // 分页改变
        handlePaginationChange(val, type) {
            if (type === 'size') {
                this.pagination.current = 1;
            }
            this.pagination[type] = val;
            this.$emit('onPaginationChange');
        },
        // 点击右键菜单
        handleClickMenu({ type, label }) {
            this.$emit('handleOperation', { name: label, key: type }, this.contextMenuInfo.row);
        },
        // 生成老的wetable渲染方法，兼容原有的we-table配置
        _generatorOldColumnRender({ column }) {
            if (column && column.component) {
                if (column.component == ComponentSet.SWITCH) {
                    // switch
                    return ({ row, column, rowIndex }) => {
                        const switchMap = column.switchMap;
                        let value = !!row[column.key];
                        if (typeof switchMap === 'function') {
                            value = !!switchMap(row);
                        }
                        return (
                            <a-switch
                                v-hasPermi={column.permi || []}
                                checked={value}
                                {...{
                                    attrs: column.attr,
                                    on: {
                                        change: value => {
                                            row[column.key] = value;
                                            column.cb && column.cb(value, row);
                                        },
                                    },
                                }}
                            />
                        );
                    };
                } else if (column.component == ComponentSet.TAGLIST) {
                    // 返回render
                    return ({ row, column, rowIndex }) => {
                        // taglist
                        const text = row[column.key] !== 0 && !row[column.key] ? '--' : row[column.key];

                        if (!text) {
                            return text;
                        }
                        return (
                            <a-tooltip
                                placement="topRight"
                                {...{
                                    // 绑定属性
                                    attrs: column.attr,
                                    // 插槽
                                    scopedSlots: {
                                        title: props => {
                                            const computedMap = column.computedList(text, row);
                                            return Object.keys(computedMap).map(key => {
                                                const value = computedMap[key];
                                                return (
                                                    <a-tag
                                                        title={value}
                                                        style={[
                                                            { marginTop: '3px' },
                                                            column.clickTag && { cursor: 'pointer' },
                                                        ]}
                                                        key={key}
                                                        // 事件
                                                        on-click={value => {
                                                            column.clickTag && column.clickTag(value, key, text, row);
                                                        }}
                                                    >
                                                        {value}
                                                    </a-tag>
                                                );
                                            });
                                        },
                                    },
                                }}
                            >
                                <span>{(column.showText && column.showText(text)) || this.computeTagText(text)}</span>
                            </a-tooltip>
                        );
                    };
                }
            }
            // 没有值就走默认的
            return undefined;
        },
        // 适配原有的插槽
        _adapterCellSlot({ row, column, rowIndex }) {
            /**
             * 1.根据column动态读取作用域插槽并返回
             * 2.原we-table配置项中的内置组件配置，把we-table的逻辑迁移过来
             * 3.如果以上逻辑都不走的情况下，直接走默认的逻辑
             */
            const text = row[column.key] !== 0 && !row[column.key] ? '--' : row[column.key];
            // 如果有插槽的话走插槽，没有的话直接默认
            if (column.hasScopedSlots) {
                const customRender = column.scopedSlots.customRender;
                const scopedSlotRender = this.$scopedSlots[customRender];
                if (scopedSlotRender) {
                    const slotResult = scopedSlotRender({
                        record: row,
                        text: text,
                        index: rowIndex,
                        column: column,
                    });
                    return slotResult;
                }
            }

            // 兼容老表格
            if (column.oldWeTableRender) {
                return column.oldWeTableRender({ row, column, rowIndex });
            }

            return text;
        },
        computeTagText(text) {
            if (typeof text == 'string') {
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
        // 竖向滚动一段距离
        scrollY(val) {
            this.$refs['weint-table'].scrollTo({ top: val, behavior: 'smooth' });
        },
        // 横向滚动一段距离
        scrollX(val) {
            this.$refs['weint-table'].scrollTo({ left: val, behavior: 'smooth' });
        },
        // 行拖拽排序
        startDrag() {
            const _this = this;
            let root = document.querySelector(`#${this.compUniqueKey}-container .ve-table-body`);
            new Sortable(root, {
                animation: 200, // 动画时长
                handle: '.can-drag', // 可被拖动的元素
                ghostClass: 'ghost-tr', // 被拖拽元素的影子类名
                dragClass: 'draging-tr', // 正在被拖拽中类名
                onEnd: function (e) {
                    // 结束拖拽
                    let { oldIndex, newIndex } = e;
                    oldIndex--;
                    newIndex--;
                    let copyRow = lodash.cloneDeep(_this.tableData[oldIndex]);
                    _this.tableData.splice(oldIndex, 1);
                    _this.tableData.splice(newIndex, 0, copyRow);
                },
            });
        },

        // 实例方法
        setHighlightRow(rowKey) {
            this.$refs['weint-table'].setHighlightRow({ rowKey: rowKey });
        },
    },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
