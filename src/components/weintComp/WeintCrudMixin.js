import { getDefaultDailogInfo, getDefaultTablePagination } from './utils';
import { ComponentOpr } from './properties';
import lodash from 'lodash';
export default {
    data() {
        return {
            /**模型和配置项 */
            apis: {}, // 接口
            searchForm: {}, // 查询参数模型
            searchs: [], // 查询配置项
            dialogForm: {}, // 表单模型
            dialogFormSetting: [], // 表单配置项
            tableData: [], // 列表数据模型
            tableColumns: [], // 列表配置项

            /**table属性 */
            tablePagination: getDefaultTablePagination(), // 分页
            tableDataLoading: false, // table loading
            expandedRowKeys: [], // 已展开的行
            selectedRows: [], // 已选择的行
            curSize: 'default', // table尺寸
            showColList: [], // 列显示隐藏
            tableActions: [
                {
                    type: 'DETAIL',
                    label: '查看',
                },
                {
                    type: 'EDIT',
                    label: '编辑',
                },
                {
                    type: 'DELETE',
                    label: '删除',
                },
            ], // 右键菜单

            /**弹窗属性 */
            activeOperDialogInfo: getDefaultDailogInfo(), // 弹窗基础属性 visible | title | Oper
            confirmLoading: false, // 确定按钮loading

            /**搜索属性 */
            activeSearchedForm: {}, // 保存当前查询的参数
            showAllSearch: false, // 是否展开高级搜索

            /**其他 */
            usePageMounted: false, // 是否使用页面的mounted完全替代mixin中的mounted
            ComponentOpr, // 操作按钮名称
            byId: false, // 回显时是否通过api获取详细数据,兼容embed组件
        };
    },
    created() {
        this.initPage();
    },
    mounted() {
        !this.usePageMounted && this.refreshTableData();
    },
    watch: {
        showAllSearch() {
            // 展开高级搜索时重新计算table高度
            this.$refs['weint-table']?.setMaxHeight();
        },
    },
    methods: {
        // 初始化页面，获取页面配置项
        initPage() {
            this.apis = this.Curd.getApis.call(this);
            this.searchForm = this.Curd.getDefaultSearchForm ? this.Curd.getDefaultSearchForm.call(this) : {};
            this.activeSearchedForm = this.Curd.getDefaultSearchForm ? this.Curd.getDefaultSearchForm.call(this) : {};
            this.searchs = this.Curd.getSearchSet ? this.Curd.getSearchSet.call(this) : [];
            this.dialogForm = this.Curd.getDefaultDialogForm ? this.Curd.getDefaultDialogForm.call(this) : {};
            this.dialogFormSetting = this.Curd.getDialogFormSet ? this.Curd.getDialogFormSet.call(this) : [];
            this.tableColumns = this.Curd.getTableColumnSet ? this.Curd.getTableColumnSet.call(this) : [];
        },

        // 获取列表数据
        refreshTableData(orderByList = {}) {
            this.tableDataLoading = true;
            let query = this.getTableQuery();
            this.activeSearchedForm = { ...query, ...orderByList };
            this.apis
                .list({ ...query, ...orderByList })
                .then(this.reviseQuery)
                .then(data => {
                    // formatList兼容mcs
                    if (this.formatList && typeof this.formatList === 'function') {
                        this.tableData = this.formatList(data);
                    } else {
                        this.tableData = data instanceof Array ? data : data.records;
                    }
                    this.tablePagination.total = data.total;
                })
                .catch(err => console.log(err))
                .finally(() => (this.tableDataLoading = false));
        },

        // 查询条件改变时修改分页参数
        reviseQuery({ data }) {
            if (!data) return [];
            if (
                (!data.records || !data.records.length) &&
                this.tablePagination.current > data.pages &&
                data.pages > 0
            ) {
                this.tablePagination.current = data.pages;
                this.tablePagination.page = data.pages;
                this.refreshTableData();
                return {};
            }
            return data;
        },

        // 获取当前查询参数
        getTableQuery() {
            let { current, size } = this.tablePagination;
            let searchForm = lodash.cloneDeep(this.searchForm);
            for (let key in searchForm) {
                if (lodash.isString(searchForm[key]) && searchForm[key].trim() === '') {
                    searchForm[key] = undefined;
                }
                if (searchForm[key] instanceof Array && searchForm[key].length === 0) {
                    searchForm[key] = undefined;
                }
            }
            return Object.assign({}, this.getMultipleForm(searchForm), { current, size });
        },

        // 迷你搜索
        onSearchMini(params) {
            let defaultParams = this.Curd.getDefaultSearchForm ? this.Curd.getDefaultSearchForm.call(this) : {};
            this.searchForm = { ...defaultParams, ...params };
            this.tablePagination.current = 1;
            this.refreshTableData();
        },

        // 重置迷你搜索
        onResetMini() {
            this.$refs['search-mini'] && this.$refs['search-mini'].reset();
        },

        // 高级搜索
        onSearchQuery() {
            this.tablePagination.current = 1;
            this.refreshTableData();
        },

        // 重置高级搜索
        onSearchReset() {
            this.tablePagination.current = 1;
            this.searchForm = this.Curd.getDefaultSearchForm.call(this);
            this.supplySearch && Object.assign(this.searchForm, this.supplySearch);
            this.onResetMini();
            this.refreshTableData();
            this.afterSearchReset && this.afterSearchReset();// 重置后回调
        },

        // 点击操作按钮
        handleOperation(operation, row) {
            this.activeOperDialogInfo.title = operation.name;
            this.activeOperDialogInfo.Oper = operation.key;
            this[operation.key](lodash.cloneDeep(row));
        },

        // 点击新增
        [ComponentOpr.ADD]() {
            this.resetFormValidate();
            this.dialogForm = this.Curd.getDefaultDialogForm.call(this);
            this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
            this.openDialog();
        },

        // 点击编辑
        [ComponentOpr.EDIT](row) {
            this.resetFormValidate();
            if (this.byId) {
                this.apis.byId({ id: row.id }).then(res => {
                    this.dialogForm = Object.assign(
                        this.Curd.getDefaultDialogForm(),
                        this.doSomething4RowBeforeShow(res.data)
                    );
                });
            } else {
                this.dialogForm = Object.assign(this.Curd.getDefaultDialogForm(), this.doSomething4RowBeforeShow(row));
            }
            this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
            this.openDialog();
        },

        // 点击查看
        [ComponentOpr.DETAIL](row) {
            this[ComponentOpr.EDIT](row); // 查看同编辑操作
        },

        // 点击删除
        [ComponentOpr.DELETE](row) {
            this.$confirm({
                title: '提示',
                content: `是否确认删除?`,
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        this.apis
                            .delete([row.id])
                            .then(result => {
                                if (result.code === 20000) {
                                    resolve();
                                    this.refreshTableData();
                                } else {
                                    reject();
                                }
                            })
                            .catch(() => reject());
                    });
                },
            });
        },

        // 批量删除
        batchDelete() {
            this.$confirm({
                title: '提示',
                content: '是否确认删除所有选中行?',
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        this.apis
                            .delete(this.selectedRows.map(v => v.id))
                            .then(result => {
                                if (result.code === 20000) {
                                    resolve();
                                    this.refreshTableData();
                                } else {
                                    reject();
                                }
                            })
                            .catch(() => reject());
                    });
                },
            });
        },

        // 弹窗确认
        onDialogConfirm() {
            this['confirm' + this.activeOperDialogInfo.Oper](this.getMultipleForm(this.dialogForm));
        },

        // 确认新增
        ['confirm' + ComponentOpr.ADD](params, apiName = 'add') {
            this.handleParams(params);
            this.$refs.weForm.validateState(res => {
                if (res && this.customCheck()) {
                    this.confirmLoading = true;
                    params = this.doSomething4ParamsBeforeFetch(params);
                    this.apis[apiName](params)
                        .then(result => {
                            if (result.code === 20000) {
                                this.closeDialog();
                                this.refreshTableData();
                            }
                        })
                        .finally(() => {
                            this.confirmLoading = false;
                        });
                }
            });
        },

        // 确认编辑
        ['confirm' + ComponentOpr.EDIT](params) {
            this['confirm' + ComponentOpr.ADD](params, 'edit');
        },

        // 确认查看
        ['confirm' + ComponentOpr.DETAIL]() {
            this.closeDialog();
        },

        // 重置表单校验
        resetFormValidate() {
            this.$nextTick(() => this.$refs.weForm && this.$refs.weForm.resetFormValidate());
        },
        // 刷新表单配置
        refreshFormSet() {
            this.dialogFormSetting = this.Curd.getDialogFormSet.call(this);
        },
        // 刷新搜索配置
        resetSearchs() {
            this.searchs = this.Curd.getSearchSet.call(this);
        },

        // 用于保存时格式化入参
        doSomething4ParamsBeforeFetch(params) {
            return params;
        },
        // 用于回填时格式化row
        doSomething4RowBeforeShow(row) {
            return row;
        },
        // 自定义表单验证
        customCheck() {
            return true;
        },

        // searchForm或dialogForm中通过逗号分隔多个参数的处理（典型使用场景：时间范围查询）
        getMultipleForm(data) {
            let multipleData = {};
            for (let k in data) {
                if (k.split(',').length > 1 && data[k]) {
                    k.split(',').forEach((v, i) => {
                        if (typeof data[k] === 'string') {
                            multipleData[v] = data[k].split(',')[i];
                        }
                        if (data[k] instanceof Array) {
                            multipleData[v] = data[k][i];
                        }
                    });
                }
            }
            return { ...data, ...multipleData };
        },

        // 打开弹窗
        openDialog() {
            this.activeOperDialogInfo.visible = true;
        },

        // 关闭弹窗
        closeDialog() {
            this.activeOperDialogInfo.visible = false;
        },

        // 设置指定数据上的属性， 通过data和mapper配合(兼容weselect的cb)
        setFormDataFromMapper(attr, data, mapper) {
            for (const key in mapper) {
                this.$set(this[attr], key, data[mapper[key]]);
            }
        },

        // 保存时兼容老的embed参数处理，不知道啥用
        handleParams(params) {
            if (this.tabList && this.tabList.length) {
                this.tabList.forEach(tab => {
                    if (tab.toApiKey && tab.toApiName) {
                        if (!params[tab.embedKey]) {
                            this.$set(params, tab.embedKey, []);
                        }
                        params[tab.toApiName] = params[tab.embedKey].map(e => e[tab.toApiKey]);
                    }
                });
            }
            return params;
        },
    },
};
