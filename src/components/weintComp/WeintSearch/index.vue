<template>
    <div
        :class="[
            'search-card',
            { 'no-padding': noPadding },
            { 'no-border': noBorder },
            { visible },
            { 'colNum-1': colNum === 1 },
        ]"
        :style="{
            '--maxLabelWidth': maxLabelWidth + 'px',
            '--formItemWidth': 100 / colNum + '%',
        }"
    >
        <a-card :bordered="false">
            <a-form name="advanced_search" class="coverAnt" :model="searchForm" ref="searchForm">
                <a-form-item v-for="(item, i) in visiableSearchs" :key="i" :name="item.key" :label="item.label">
                    <component
                        @input="v => item.cb && item.cb(v, item.options)"
                        @change="v => item.cb && item.cb(v, item.options)"
                        @select="v => item.select && item.select(v, item.options)"
                        @search="v => item.search && item.search(v, item.options)"
                        @blur="v => item.blur && item.blur(v, item.options)"
                        @pressEnter="query"
                        :is="item.component"
                        v-model.trim="searchForm[item.key]"
                        v-bind="{ allowClear: true, ...$attrs, ...item.attr }"
                        :supplySearch="item.supplySearch || {}"
                        :placeholder="getPlaceholder(item.label, item.component)"
                        :style="{
                            width: '100%',
                        }"
                        dropdownClassName="we-search-drop-down"
                        :showSearch="item.component === ComponentSet.SELECT"
                        :showArrow="item.component === ComponentSet.SELECT"
                        optionFilterProp="label"
                        v-on="{ ...$listeners, ...item.events }"
                    >
                        <!-- 组件内部的自定义插槽，slot的值传配置项的key和组件插槽名，通过逗号','分隔 -->
                        <template v-for="slot in Object.keys($scopedSlots)">
                            <slot
                                :name="slot"
                                :slot="slot.split(',')[1]"
                                :item="item"
                                v-if="slot.split(',')[0] === item.key && slot.split(',')[1]"
                            ></slot>
                        </template>
                        <template v-if="item.component === ComponentSet.SELECT">
                            <a-select-option
                                v-for="v in getAddAllOption(item.options, item.customAllOptionLabel, item.hideAll)"
                                :key="v.value"
                                :value="v.value"
                                :label="v.label"
                            >
                                {{ v.label }}
                            </a-select-option>
                        </template>
                    </component>
                </a-form-item>
                <a-form-item
                    :class="['btns', { 'btns-100': btnsWidth === '100%' }]"
                    :style="{
                        '--btnsWidth': btnsWidth,
                    }"
                >
                    <slot name="btns"></slot>
                    <a-tooltip placement="top">
                        <template slot="title">查询</template>
                        <a-button type="primary" @click="query">
                            <we-icon name="search" />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip v-if="showReset" placement="top">
                        <template slot="title">重置</template>
                        <a-button type="default" @click="reset">
                            <we-icon name="reset" />
                        </a-button>
                    </a-tooltip>
                    <slot name="btns-after"></slot>
                    <a-tooltip v-if="searchs.filter(item => !item.hidden).length > max" placement="top">
                        <template slot="title">{{ expand ? '收起' : '展开' }}</template>
                        <a-button type="default" @click="expand = !expand">
                            <we-icon :name="expand ? 'up-to-top' : 'down-to-bottom'" />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip placement="topRight" v-if="!isHideFixed">
                        <template slot="title">{{ isFix ? '默认显示高级搜索' : '默认隐藏高级搜索' }}</template>
                        <a-button type="default" @click="onFix">
                            <we-icon :name="isFix ? 'pin--filled' : 'pin'" />
                        </a-button>
                    </a-tooltip>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script>
import { ComponentSet, ComponentPlaceholder } from '../properties';
import * as Lockr from 'lockr';
Lockr.setPrefix(process.env.VUE_APP_LOCKR);
export default {
    name: 'WeintSearch',
    inject: { compPrefix: { default: '' } },
    props: {
        compKey: { type: String, default: 'searchFix' },
        visible: Boolean,
        searchs: Array,
        searchForm: Object,
        showReset: { type: Boolean, default: true }, // 是否显示重置按钮
        noPadding: { type: Boolean, default: false },
        noBorder: { type: Boolean, default: false }, // 是否取消上边框
        itemMinWidth: { type: Number, default: 420 }, // 搜索控件最小宽度
        isHideFixed: Boolean, // 是否隐藏固钉
        isExpendAll: Boolean, // 是否默认展开
    },
    mounted() {
        if (this.isExpendAll) {
            this.expand = true;
        }
        const localFix = Lockr.get('userConfig')[this.$route.path][this.compUniqueKey];
        this.isFix = localFix === undefined ? true : localFix;
        this.$emit('update:visible', !!this.isFix);
        setTimeout(() => {
            this.resetSearchItemWidth();
            window.addEventListener('resize', this.resetSearchItemWidth);
        });
        console.log(this.$scopedSlots);
    },
    destroyed() {
        window.removeEventListener('resize', this.resetSearchItemWidth);
    },
    activated() {
        setTimeout(() => {
            this.resetSearchItemWidth();
            window.addEventListener('resize', this.resetSearchItemWidth);
        });
    },
    deactivated() {
        window.removeEventListener('resize', this.resetSearchItemWidth);
    },
    data() {
        return {
            ComponentSet,
            expand: false, // 是否展开
            colNum: null,
            isFix: false,
            max: 3,
        };
    },
    computed: {
        compUniqueKey() {
            return this.compPrefix + this.compKey;
        },
        visiableSearchs() {
            return !this.expand
                ? this.searchs.filter(item => !item.hidden).splice(0, this.max)
                : this.searchs.filter(item => !item.hidden);
        },
        maxLabelWidth() {
            let widths = [0, 28, 42, 56, 70, 86, 100];
            return (
                widths[
                    this.visiableSearchs
                        .map(item => item.label?.length)
                        .sort()
                        .reverse()[0]
                ] || 96
            );
        },
        btnsWidth() {
            // 计算查询按钮所占宽度百分比
            let res,
                len = this.visiableSearchs.length,
                colNum = this.colNum;
            if (len < colNum) {
                res = (colNum - (len % colNum)) / this.colNum;
            } else if (len % colNum === 0) {
                res = 1;
            } else {
                res = (colNum - (len % colNum)) / this.colNum;
            }
            return res * 100 + '%';
        },
    },
    methods: {
        resetSearchItemWidth() {
            const formWidth = this.$refs.searchForm.$el.offsetWidth;
            formWidth > this.itemMinWidth && (this.colNum = Math.floor(formWidth / this.itemMinWidth));
            this.max = this.colNum - 1 || 1;
        },
        query() {
            this.$emit('onSearchQuery');
        },
        reset() {
            this.$emit('onSearchReset');
        },
        // 添加placeholder的提示
        getPlaceholder(label, method) {
            const placeholder = ComponentPlaceholder[method];
            if (!placeholder) return '';
            return placeholder.showLabel ? placeholder.name + label : placeholder.name;
        },
        // 在下拉框中添加全部选项，如果有自定义，用自定义label
        getAddAllOption(options, customAllOptionLabel, hideAll) {
            if (hideAll) {
                return options;
            }
            if (options && options.length) {
                return [
                    {
                        label: customAllOptionLabel || '全部',
                        value: '',
                    },
                    ...options,
                ];
            } else {
                return [];
            }
        },
        onFix() {
            this.isFix = !this.isFix;
            let userConfig = Lockr.get('userConfig');
            let pageConfig = userConfig[this.$route.path];
            pageConfig[this.compUniqueKey] = this.isFix;
            Lockr.set('userConfig', { ...userConfig, [this.$route.path]: pageConfig });
        },
    },
};
</script>
<style lang="less" scoped>
.coverAnt {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    ::v-deep .ant-advanced-search-form .ant-form-item {
        margin-bottom: 0;
    }
}
.search-card {
    height: 0;
    overflow: hidden;
    &.visible {
        border-top: 1px solid @gray-2;
        height: auto;
    }
    &.no-border {
        border-top: 0;
    }
    /deep/ .ant-form-item-label {
        // text-align: justify;
        // text-align-last: justify;
        width: var(--maxLabelWidth);
        > label {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 100%;
            display: block;
        }
        label::after {
            display: inline !important;
            content: ':';
            position: relative;
            top: -0.5px;
            margin: 0 8px 0 2px;
        }
    }
    @media (max-width: 575px) {
        /deep/ .ant-form-item-label {
            display: inline;
            margin: 0;
            padding: 0;
            line-height: 40px;
            white-space: nowrap;
            text-align: right;
            > label {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100%;
                display: inline-block;
            }
        }
    }
    /deep/ .ant-card-body {
        padding: 12px 16px 4px 16px;
    }
    /deep/.ant-form-item {
        margin-bottom: 8px;
        // padding-right: 20px;
        display: flex;
        width: calc(var(--formItemWidth) - 16px);
        height: 40px; // 手机小窗口下高度会变大，所以固定一下宽度
    }
    /deep/.ant-form-item > .ant-form-item-control-wrapper {
        flex-grow: 1;
        width: min-content;
    }
    .btns {
        position: relative;
        top: -1px;
        white-space: nowrap;
        text-align: right;
        width: calc(var(--btnsWidth) - 16px);
        padding-top: 4px;
        /deep/ .ant-form-item-children {
            display: flex;
            align-items: center;
            justify-content: right;
            & > * {
                margin-right: 4px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        /deep/.ant-btn {
            padding: 0 8px;
        }
        /deep/.ant-btn:hover:not(.ant-btn-primary),
        /deep/.ant-btn:focus:not(.ant-btn-primary) {
            color: @text-color;
            border-color: rgba(0, 0, 0, 0.36);
        }
        &.btns-100 {
            width: 100% !important;
        }
    }
    /deep/ .ant-calendar-range-picker-input {
        width: calc(50% - 5px);
    }
}
.no-padding {
    /deep/ .ant-card-body {
        padding: 0 0 4px 0;
    }
}
// 只有一列时formItem不需要边距
.colNum-1 {
    /deep/.ant-form-item {
        width: 100% !important;
    }
}
</style>
