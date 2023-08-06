<template>
    <div>
        <a-input
            :placeholder="placeholder"
            v-if="haveInput"
            :value="formatValue"
            readOnly
            :disabled="disabled"
            @click="startSelect"
            :size="size"
        >
            <we-icon
                name="close1"
                v-if="clearable && formatValue"
                slot="addonAfter"
                :class="`close ${disabled ? 'disabled' : ''}`"
                @click="clear"
            />
            <we-icon v-else slot="addonAfter" name="search" />
        </a-input>
        <slot></slot>

        <weint-dialog :size="dialogSize" :dialogInfo="activeOperDialogInfo" @onConfirm="onOk" @onClose="onClose">
            <weint-card :border="true">
                <weint-table-head>
                    <div v-if="multiple">
                        <span>已选 {{ selectedRows.length }} 项数据</span>
                        <a v-if="selectedRows.length" @click="selectedRows = []" style="margin-left: 10px">清空</a>
                    </div>
                    <!-- 搜索栏 -->
                    <weint-search-mini
                        ref="search-mini"
                        :searchForm.sync="searchForm"
                        :searchs="searchs"
                        slot="searchs"
                        @onSearch="onSearchMini"
                        :showAllSearch.sync="showAllSearch"
                    />
                    <!-- 工具栏 -->
                    <template slot="tools">
                        <tool-reset @reset="onSearchReset" :loading="tableDataLoading" />
                        <tool-size :compKey="`${compUniqueKey}-size`" :curSize.sync="curSize" />
                        <tool-column
                            :compKey="`${compUniqueKey}-tool-column`"
                            :columns="formatTableColumns"
                            :showColList.sync="showColList"
                        />
                    </template>
                </weint-table-head>

                <!-- 高级搜索 -->
                <weint-search
                    :ref="`${compUniqueKey}-search`"
                    :compKey="`${compUniqueKey}-search`"
                    :visible.sync="showAllSearch"
                    :searchs="searchs"
                    :searchForm="searchForm"
                    @onSearchQuery="onSearchQuery"
                    @onSearchReset="onSearchReset"
                />

                <!-- 表格 -->
                <weint-table
                    :ref="`${compUniqueKey}-table`"
                    :rowKey="rowKey"
                    :compKey="`${compUniqueKey}-table`"
                    :columns="formatTableColumns"
                    :tableData="tableData"
                    :loading="tableDataLoading"
                    :pagination="tablePagination"
                    @onPaginationChange="refreshTableData"
                    :curSize="curSize"
                    :showColList="showColList"
                    :hideRightMenus="true"
                    @dblclickRow="dblclickRow"
                    @clickRow="clickRow"
                    :selectedRows.sync="selectedRows"
                    :disableSelectedRowKeys="disableSelectedRowKeys"
                />
            </weint-card>
        </weint-dialog>
    </div>
</template>

<script>
import WeintCrudMixin from '../WeintCrudMixin';
import lodash from 'lodash';
export default {
    name: 'WeintSelect',
    inject: { compPrefix: { default: '' } },
    props: {
        compKey: { type: String, default: 'weint-select' }, // 组件唯一标识
        rowKey: { type: String, default: 'id' }, // 表格行唯一标识
        Curd: Object, // 表格配置
        value: [String, Array], // 组件显示的值
        supplySearch: Object, // 外部搜索参数
        disabled: Boolean, // 组件是否禁用
        size: String, // 组件输入框尺寸
        clearable: { type: Boolean, default: true }, // 是否可清空组件值
        dialogSize: { type: String, default: 'large' }, // 弹窗尺寸
        disableSelectedRowKeys: Array, // 禁止选用的行
        haveInput: { type: Boolean, default: true }, // 是否包含输入框
        noAction: { type: Boolean, default: true }, // 是否去掉操作列
        customConfrim: Function, // 自定义确定事件
        formatList: Function, // 表格数据格式化方法
        placeholder: { type: String, default: '请选择' }, // placeholder

        // 多选
        multiple: Boolean, // 是否可以多选
        multipleKey: { type: String, default: 'name' }, // 回显所需的字段名

        /**
         * 老组件已取消的无用属性
         * multipleRows: 回显选中行 ——> value
         * checkboxDisableFunc: table禁止选择行 ——> disableSelectedRowKeys
         * generateValueFunc & generateValueObject: 这俩不知道干啥用的，感觉没屁用
         */
    },
    data() {
        return {
            usePageMounted: true,
            activeOperDialogInfo: { title: '请选择', visible: false },
            result: {}, // 单选结果
            selectedRows: this.multiple ? [] : null, // 多选结果
        };
    },
    computed: {
        compUniqueKey() {
            return this.compPrefix + this.compKey;
        },
        formatValue() {
            if (this.value instanceof Array) {
                return this.value.map(item => item[this.multipleKey]).join(',');
            }
            return this.value;
        },
        formatTableColumns() {
            if (this.noAction) {
                return this.tableColumns.filter(column => column.key !== 'weint-operation');
            }
            return this.tableColumns;
        },
    },
    mixins: [WeintCrudMixin],
    methods: {
        // 点击选择
        startSelect() {
            this.tablePagination.current = 1;
            this.openDialog();
            this.refreshTableData();
            if (this.multiple && this.value && this.value.length > 0) {
                this.selectedRows = lodash.cloneDeep(this.value);
            }
            this.$nextTick(() => {
                this.$refs[`${this.compUniqueKey}-search`].resetSearchItemWidth();
                this.$refs[`${this.compUniqueKey}-table`].setMinWidth();
            });
        },

        // 合并入参
        getTableQuery() {
            let { current, size } = this.tablePagination;
            return Object.assign({}, this.supplySearch, this.searchForm, { current, size });
        },

        // 单击行
        clickRow({ row }) {
            if (!this.multiple) {
                this.result = row;
            } else {
                // 多选时单击选中行
                if (this.disableSelectedRowKeys.includes(row[this.rowKey])) {
                    return;
                }
                if (this.selectedRows.find(v => v[this.rowKey] === row[this.rowKey])) {
                    this.selectedRows = this.selectedRows.filter(v => v[this.rowKey] !== row[this.rowKey]);
                } else {
                    this.selectedRows.push(row);
                }
            }
        },
        // 双击行
        dblclickRow({ row, rowIndex }) {
            if (!this.multiple) {
                this.result = row;
                this.onOk();
            }
        },

        // 确定
        onOk() {
            if (this.customConfrim && this.customConfrim instanceof Function) {
                this.customConfrim.call(this);
                return;
            }
            const clone = lodash.cloneDeep(this.multiple ? this.selectedRows : this.result);
            this.$emit('change', clone);
            this.closeDialog();
            this.selectedRows = this.multiple ? [] : null;
            this.result = {};
        },

        // 取消
        onClose() {
            this.selectedRows = this.multiple ? [] : null;
            this.result = {};
            this.closeDialog();
        },

        // 清除选择
        clear() {
            this.selectedRows = this.multiple ? [] : null;
            this.result = {};
            this.$emit('change', this.multiple ? [] : {});
        },
    },
};
</script>

<style lang="less" scoped>
/deep/.ant-input-group-addon {
    line-height: 16px;
    padding: 0 8px;
}
.close {
    cursor: pointer;
}
</style>
