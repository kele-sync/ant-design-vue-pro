import * as Lockr from 'lockr';
Lockr.setPrefix(process.env.VUE_APP_LOCKR);
// 表格默认属性配置
export function getTableConf() {
    return {
        // 行唯一标识
        rowKeyFieldName: this.rowKey,

        // 禁用单元格选中
        cellSelectionOption: { enable: false },

        // 表格样式
        style: 'width: 100%',
        borderAround: true,
        borderX: true,
        borderY: true,

        // 宽高滚动
        maxHeight: this.tableMaxHeight,
        scrollWidth: this.xScroll,

        // 拖拽列宽
        columnWidthResizeOption: {
            enable: true,
            minWidth: 55,
            sizeChange: ({ column, columnWidth }) => {
                // 更改列宽后更新tableColumns中对应的width，触发xScroll重新计算
                const _this = this;
                (function changeWidth(data) {
                    data.forEach((item, i) => {
                        if (item.children && item.checked) {
                            changeWidth(item.children);
                        }
                        if (item.key === column.key) {
                            _this.$set(data[i], 'width', columnWidth);
                        }
                    });
                })(this.tableColumns);
                // 更新colWidth
                this.colWidth[column.key] = columnWidth;
                // 缓存到本地
                let userConfig = Lockr.get('userConfig');
                let pageConfig = userConfig[this.$route.path];
                pageConfig[this.compUniqueKey] = this.colWidth;
                Lockr.set('userConfig', { ...userConfig, [this.$route.path]: pageConfig });
                // 重新计算单元格最小宽度
                this.setMinWidth();
            },
        },

        // 排序
        sortOption: {
            sortChange: params => (this.sortParams = params),
        },

        // 行展开
        expandOption: {
            trigger: 'cell',
            expandedRowKeys: this.expandedRowKeys,
            render: this.expandRender || '',
            afterExpandRowChange: ({ afterExpandedRowKeys, row, rowIndex }) => {
                this.$emit('update:expandedRowKeys', afterExpandedRowKeys);
            },
        },

        // 行选择
        checkboxOption: {
            hideSelectAll: true,
            selectedRowKeys: this.selectedRows && this.selectedRows.map(v => v[this.rowKey]),
            selectedRowChange: this.selectedRowChange,
            disableSelectedRowKeys: this.disableSelectedRowKeys,
        },

        // 单元格操作（禁用剪切和删除）
        clipboardOption: {
            cut: false,
            delete: false,
        },

        // 自定义事件
        eventCustomOption: {
            // header列自定义事件
            headerCellEvents: e => {
                return {
                    contextmenu: event => {
                        event.preventDefault();
                    },
                };
            },
            // 行事件
            bodyRowEvents: e => {
                return {
                    click: event => {
                        this.$emit('clickRow', e);
                    },
                    dblclick: event => {
                        this.$emit('dblclickRow', e);
                    },
                };
            },
            // 列事件
            bodyCellEvents: ({ row, column, rowIndx }) => {
                return {
                    click: event => {
                        event.target.focus();
                    },
                    // 右键菜单事件
                    contextmenu: event => {
                        if (this.hideRightMenus || this.actionsPermissions.length === 0) return;
                        event.preventDefault();
                        this.$refs['weint-table'].setHighlightRow({ rowKey: row[this.rowKey] }); // 右击时选中行
                        this.$emit('beforeShowCellMenu', row, this.tableActions); // 右击回调，可改变右键菜单内容
                        this.contextMenuInfo = {
                            visible: this.actionsPermissions.length > 0,
                            row,
                            x: event.x,
                            y: event.y,
                        };
                    },
                };
            },
        },

        // 单元格样式
        cellStyleOption: {
            bodyCellClass: ({ row, column, rowIndex }) => {
                if (this.selectedRows && this.selectedRows.find(v => v[this.rowKey] === row[this.rowKey])) {
                    //选中行背景色
                    return 'table-body-cell-selected';
                }
                if (column.field === 'draggable') {
                    return 'can-drag';
                }
            },
        },
    };
}
