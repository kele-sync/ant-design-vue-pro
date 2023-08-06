<template>
    <div class="weint-embed-container">
        <weint-table-head>
            <!-- 按钮组 -->
            <template v-if="!isHideAdd">
                <a-button v-if="noDialog" @click="addRow" type="primary" icon="plus">添加</a-button>

                <weint-select
                    ref="weint-embed-select"
                    v-else
                    :compKey="compKey + '-weint-select'"
                    :rowKey="dialogRowKey"
                    :Curd="embedCurd"
                    :multiple="true"
                    :haveInput="false"
                    :value="tableData"
                    :supplySearch="supplySearch"
                    @change="data => handleWeintSelectChange(data)"
                    :disableSelectedRowKeys="tableData.map(v => v[dialogRowKey])"
                >
                    <a-button type="primary" icon="plus" @click="$refs['weint-embed-select'].startSelect()">
                        添加
                    </a-button>
                </weint-select>
            </template>

            <slot name="operation"></slot>

            <!-- 工具栏 -->
            <template slot="tools">
                <tool-size :curSize.sync="curSize" :compKey="compKey + 'size'" />
                <tool-column :columns="tableColumns" :showColList.sync="showColList" :compKey="compKey + 'column'" />
            </template>
        </weint-table-head>
        <!-- 表格 -->
        <weint-table
            ref="weint-embed-table"
            class="weint-embed-table"
            :compKey="compKey + '-table'"
            :columns="tableColumns"
            :tableData="
                havePagination
                    ? tableData.slice(pagination.size * (pagination.current - 1), pagination.size * pagination.current)
                    : tableData
            "
            :loading="loading"
            :pagination="false"
            :curSize="curSize"
            :showColList="showColList"
            :maxHeight="maxHeight"
            v-bind="attr"
            :draggable="draggable"
            :rowKey="rowKey || selectRowKey || 'id'"
            :popupContainerByTable="popupContainerByTable"
        >
            <slot
                v-for="slot in Object.keys($scopedSlots)"
                :name="slot"
                :slot="slot"
                slot-scope="{ record, index, column, text }"
                :record="record"
                :index="index"
                :text="text"
                :column="column"
            ></slot>
        </weint-table>

        <!-- 分页 -->
        <div class="weint-pagination" v-if="havePagination">
            <div>共 {{ pagination.total || 0 }} 项数据</div>
            <a-pagination
                :pageSizeOptions="['10', '20', '50', '100']"
                :current.sync="pagination.current"
                :pageSize.sync="pagination.size"
                :showLessItems="true"
                :showSizeChanger="true"
                :total="pagination.total"
                @showSizeChange="(current, size) => (pagination['size'] = size)"
                @change="(page, pageSize) => (pagination['current'] = page)"
            />
        </div>
    </div>
</template>

<script>
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export default {
    name: 'WeintEmbed',
    props: {
        compKey: { type: String, default: 'weint-embed' }, // 组件唯一标识
        dialogInfo: { type: Object, default: () => ({}) }, // 弹窗详情
        value: { type: Array, default: () => [] }, // 表格数据
        embedCurd: { type: Object, required: true }, // embed组件配置
        loading: { type: Boolean, default: false }, // 表格loading
        maxHeight: { type: Number, default: 400 }, // 表格最大滚动高度
        noCheck: Boolean, // 是否需要校验
        havePagination: Boolean, // 是否含分页
        addInStart: Boolean, // 是否添加到首部
        attr: { type: Object, default: () => ({}) }, // weint-table的属性
        handleRow: Function, // 根据弹窗选择中的字段名格式化embed字段名
        readonly: Boolean, // 只读组件
        hideAdd: Boolean, // 是否隐藏添加按钮
        draggable: Boolean, // 是否可拖拽
        rowKey: String, // 行唯一标识
        selectRowKey: String, // 行唯一标识（兼容老版本weEmbed属性）
        popupContainerByTable: Boolean, // 弹出框是否挂载在table上（关系到弹出框能否跟随table滚动）

        // 选择弹出框属性
        noDialog: Boolean, // 是否从弹窗中添加数据
        dialogRowKey: { type: String, default: 'id' }, // 弹出框表格行唯一标识
        supplySearch: Object, // 弹窗weint-select的属性
    },
    data() {
        return {
            columns: [], // 原始的table列
            tableColumns: [], // 表格列配置
            tableData: [], // 表格数据
            curSize: 'default', // 表格尺寸模型
            showColList: [], // 列拖拽显示隐藏模型
            pagination: { size: 10, current: 1, total: 0 }, // 分页配置
        };
    },
    watch: {
        embedCurd: {
            handler() {
                this.initColumns();
            },
            deep: true,
        },
        value(v) {
            this.tableData = v;
        },
        tableData(v) {
            this.pagination.total = v.length;
            this.$emit('input', v);
        },
    },
    computed: {
        isHideAdd() {
            return this.dialogInfo.Oper === 'DETAIL' || this.hideAdd;
        },
        isReadonly() {
            return this.dialogInfo.Oper === 'DETAIL' || this.readonly;
        },
        rowKK() {
            return this.rowKey || this.selectRowKey || 'id';
        },
    },
    mounted() {
        this.tableData = this.value;
        this.initColumns();
    },
    methods: {
        // 初始化table列
        initColumns() {
            this.columns = this.embedCurd.getEmbedTableColumnSet
                ? this.embedCurd.getEmbedTableColumnSet.call(this).filter(item => !item.hidden)
                : [];
            let result = this.formatColumnsByOld([...this.columns]);
            this.isReadonly && result.map(v => (v.edit = false));
            this.tableColumns = result;
        },

        // 从weint-select中添加多行
        handleWeintSelectChange(data) {
            let formatData = this.handleRow ? this.handleRow(data) : data;
            let oldData = this.$_.cloneDeep(this.tableData);
            let newData = formatData.filter(v => !this.tableData.find(item => item[this.rowKK] === v[this.rowKK]));
            this.tableData = [...oldData, ...newData];
            this.$emit('afterAddRows', { oldData, newData });
        },

        // 添加一行
        addRow() {
            let row = { [this.rowKK]: this.tableData.length + 1 }; // table必须要有唯一键，不然拖拽排序会出问题
            this.columns.forEach(v => (row[v.key] = v.defaultValue)); // 赋默认值
            this.tableData[this.addInStart ? 'unshift' : 'push'](row);
            this.$nextTick(() => this.$refs['weint-embed-table'].scrollY(this.addInStart ? 0 : 10000)); // 滚动到底部
        },

        // 删除一行
        deleteRow(index) {
            this.tableData.splice(index, 1);
            let { total, size, current } = this.pagination;
            this.havePagination && current !== 1 && total - 1 === size * (current - 1) && this.pagination.current--; // 删除当前分页下最后一条数据的特殊处理
        },

        // 复制一行
        copyRow(row, index) {
            let copyRow = { ...row, [this.rowKK]: guid() };
            this.tableData.splice(index + 1, 0, copyRow);
        },

        // 校验必填项
        checkRequired() {
            if (this.noCheck) return false;
            for (let i = 0; i < this.tableData.length; i++) {
                const v = this.tableData[i];
                for (let j = 0; j < this.tableColumns.length; j++) {
                    let { key, label, required } = this.tableColumns[j];
                    if (!required) continue;
                    if (
                        v[key] === undefined ||
                        v[key] === null ||
                        v[key] === '' ||
                        (v[key] instanceof Array && v[key].length === 0)
                    ) {
                        return `第${i + 1}行${label}的值`;
                    }
                }
            }
            return false;
        },

        // 将老版本组件的columns属性格式化成新组件所需要的
        formatColumnsByOld(columns) {
            columns.forEach(item => {
                if (
                    item.scopedSlots &&
                    item.scopedSlots.customRender !== 'action' &&
                    item.scopedSlots.customRender !== 'draggable' &&
                    item.scopedSlots.customRender.indexOf('Slot') == -1 &&
                    !this.$scopedSlots[item.scopedSlots.customRender]
                ) {
                    item.edit = true;
                }
                if (item.edit === true) {
                    item.editAttr = {
                        ...(item.attr || {}),
                        ...(item.editAttr || {}),
                    };
                    if (item.cb && !item.editAttr.change) {
                        item.editAttr.change = item.cb;
                    }
                }
            });
            return columns;
        },
    },
};
</script>

<style lang="less" scoped>
.weint-embed-container {
    padding: 16px;
    /deep/.weint-table-head {
        margin: 0;
        padding: 0;
    }
    .weint-embed-table {
        /deep/.ve-table.ve-table-border-around {
            border-right: 1px solid @gray-2;
            border-left: 1px solid @gray-2;
        }
        /deep/.empty-data {
            border-left: 1px solid @gray-2 !important;
            border-right: 1px solid @gray-2 !important;
        }
    }
    .weint-pagination {
        height: 48px;
        padding-top: 16px;
        display: flex;
        justify-content: space-between;
        /deep/.ant-pagination-options-size-changer.ant-select {
            margin-right: 0;
        }
        /deep/.ant-pagination-options-quick-jumper {
            margin-left: 8px;
        }
    }
}
</style>
