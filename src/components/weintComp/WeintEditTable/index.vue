<template>
    <div class="weint-edit-container">
        <weint-table
            ref="weint-edit-table"
            class="weint-edit-table"
            :compKey="compKey"
            :columns="tableColumns"
            :tableData="
                havePagination
                    ? tableData.slice(pagination.size * (pagination.current - 1), pagination.size * pagination.current)
                    : tableData
            "
            :loading="loading"
            :pagination="false"
            :maxHeight="maxHeight"
            v-bind="attr"
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
export default {
    name: 'WeintEditTable',
    props: {
        compKey: { type: String, default: 'weint-edit-table' }, // 组件唯一标识
        dialogInfo: { type: Object, default: () => ({}) }, // 弹窗详情
        value: { type: Array, default: () => [] }, // 表格数据
        columns: { type: Array, default: () => [] }, // 原始的table列
        loading: { type: Boolean, default: false }, // 表格loading
        maxHeight: { type: Number, default: 400 }, // 表格最大滚动高度
        noCheck: Boolean, // 是否需要校验
        havePagination: Boolean, // 是否含分页
        attr: { type: Object, default: () => ({}) }, // weint-table的属性
        readonly: Boolean, // 只读组件
        rowKey: String, // 行唯一标识
        selectRowKey: String, // 行唯一标识（兼容老版本weEditTable属性）
        popupContainerByTable: Boolean, // 弹出框是否挂载在table上（关系到弹出框能否跟随table滚动）
    },
    data() {
        return {
            tableColumns: [], // 表格列配置
            tableData: [], // 表格数据
            pagination: { size: 10, current: 1, total: 0 }, // 分页配置
        };
    },
    watch: {
        columns: {
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
        isReadonly() {
            return this.dialogInfo.Oper === 'DETAIL' || this.readonly;
        },
    },
    mounted() {
        this.tableData = this.value;
        this.initColumns();
    },
    methods: {
        // 初始化table列
        initColumns() {
            let result = this.formatColumnsByOld([...this.columns].filter(item => !item.hidden));
            this.isReadonly && result.map(v => (v.edit = false));
            this.tableColumns = result;
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
.weint-edit-container {
    padding: 16px;
    /deep/.weint-table-head {
        margin: 0;
        padding: 0;
    }
    .weint-edit-table {
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
