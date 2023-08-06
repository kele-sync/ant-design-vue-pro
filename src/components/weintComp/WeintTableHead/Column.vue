<template>
    <a-popover
        v-model="visible"
        placement="bottomRight"
        trigger="click"
        overlayClassName="weint-table-col-show-box hide-arrow"
    >
        <template slot="title">
            自定义配置
            <a-tooltip placement="top">
                <template slot="title">重置</template>
                <span @click="handleResetCol" class="reset-col">
                    <we-icon name="rotate--360" />
                </span>
            </a-tooltip>
        </template>
        <template slot="content">
            <div class="table-scroll col-box">
                <div class="col-body">
                    <draggable v-model="data" :force-fallback="true" group="label" animation="300">
                        <transition-group>
                            <template v-for="x in data">
                                <div class="col-item" :key="x.key" v-if="x.key !== 'weint-operation'">
                                    <a-checkbox :disabled="x.disabled" v-model="x.checked">
                                        {{ x.label }}
                                        <we-icon name="draggable" class="drop-icon" />
                                    </a-checkbox>
                                    <i class="disabled-dialog" v-if="x.disabled" />
                                </div>
                            </template>
                        </transition-group>
                    </draggable>
                </div>
                <div class="col-footer">
                    <a-button @click="visible = false">取消</a-button>
                    <a-button :disabled="!data.filter(v => v.checked).length" @click="handleUseCol" type="primary">
                        应用
                    </a-button>
                </div>
            </div>
        </template>
        <a-tooltip placement="topRight">
            <template slot="title">列显示/隐藏</template>
            <div class="tool-item">
                <we-icon name="cics--sit-overrides" />
            </div>
        </a-tooltip>
    </a-popover>
</template>

<script>
import Vue from 'vue';
import vuedraggable from 'vuedraggable';
import { formatColumnsDeep, buildKey } from '../WeintTable/utils';
import lodash from 'lodash';
import * as Lockr from 'lockr';
Lockr.setPrefix(process.env.VUE_APP_LOCKR);
Vue.component('vuedraggable', vuedraggable);
export default {
    name: 'ToolColumn',
    inject: { compPrefix: { default: '' } },
    components: { draggable: vuedraggable },
    props: {
        compKey: { type: String, default: 'tableColumn' },
        columns: Array,
        showColList: Array,
    },
    data() {
        return {
            visible: false,
            data: [], // 操作列表中展示的列数据
        };
    },
    watch: {
        visible: {
            handler(v) {
                if (v) {
                    this.data = lodash.cloneDeep(this.showColList);
                }
            },
            immediate: true,
        },
        columns: {
            handler(v) {
                const columnsWithoutHidden = v.filter(({ hidden }) => !hidden);
                const labelsFormLocal = Lockr.get('userConfig')[this.$route.path][this.compUniqueKey] || [];
                const diff = lodash.xorBy(columnsWithoutHidden, labelsFormLocal, 'label');
                if (diff.length === 0) {
                    this.$emit(
                        'update:showColList',
                        labelsFormLocal.map(item => {
                            return {
                                ...this.columnsInfoBykey[item.key],
                                checked: item.checked,
                                disabled: item.disabled,
                            };
                        })
                    );
                } else {
                    this.$emit('update:showColList', formatColumnsDeep(columnsWithoutHidden));
                }
            },
            deep: true,
            immediate: true,
        },
    },
    computed: {
        columnsInfoBykey() {
            let obj = {};
            this.columns.forEach(v => (obj[buildKey(v)] = v));
            return obj;
        },
        compUniqueKey() {
            return this.compPrefix + this.compKey;
        },
    },
    mounted() {},
    methods: {
        // 应用列
        handleUseCol() {
            this.$emit('update:showColList', this.data);
            this.setConf();
            this.visible = false;
        },
        // 重置列
        handleResetCol() {
            this.data = this.columns
                .filter(v => !v.hidden)
                .map(v => ({ ...v, checked: !v.hide, disabled: v.alwaysShow }));
        },
        // 保存到本地配置
        setConf() {
            let userConfig = Lockr.get('userConfig');
            let pageConfig = userConfig[this.$route.path];
            pageConfig[this.compUniqueKey] = this.data;
            Lockr.set('userConfig', { ...userConfig, [this.$route.path]: pageConfig });
        },
    },
};
</script>

<style lang="less">
.weint-table-col-show-box {
    padding: 0;
    .ant-popover-inner-content {
        padding: 0;
    }
    .col-box {
        min-width: 200px;
        max-width: 250px;
        position: relative;
        .col-body {
            padding: 8px 16px 53px 16px;
            max-height: 400px;
            overflow-y: auto;
            .we-scroll;
        }
        .col-item {
            display: block;
            height: 32px;
            line-height: 30px;
            border: 1px solid @component-border;
            border-radius: 4px;
            padding: 0 5px;
            margin-bottom: 4px;
            margin-right: 0;
            padding-right: 32px;
            position: relative;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            max-width: 218px;
            background: #fff;
            .drop-icon {
                position: absolute;
                right: 8px;
                cursor: move;
                color: @text-color;
                top: 7px;
            }
            &:has(.ant-checkbox-wrapper-checked) {
                color: @primary-color;
                border-color: @primary-color;
                background: @primary-1;
            }
            .disabled-dialog {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 30px;
                z-index: 1;
                cursor: not-allowed;
            }
        }
    }
    .col-footer {
        background: #fff;
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 12px 16px 8px 16px;
        padding-top: 8px;
        margin-top: 4px;
        border-top: 1px solid #e8e8e8;
        display: flex;
        justify-content: space-between;
        > button {
            width: 48%;
        }
    }
    .reset-col {
        border: 1px solid @component-border;
        border-radius: 50%;
        cursor: pointer;
        width: 24px;
        height: 24px;
        float: right;
        transition: border 0.2s;
        color: @text-color;
        text-align: center;
        line-height: 18px;
        &:hover {
            border: 1px solid @font-gy2;
        }
    }
}
</style>
