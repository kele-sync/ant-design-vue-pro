<template>
    <div class="weint-search-mini">
        <a-input-group v-if="searchsFlt && searchsFlt.length && !showAllSearch" compact>
            <a-select
                :dropdownMatchSelectWidth="false"
                :style="{ width: `${width[0]}px` }"
                v-model="key"
                placeholder="请选择"
                @change="handleChangeKey"
                dropdownClassName="selectDropClass"
            >
                <a-select-option v-for="x in searchsFlt" :key="x.key" :value="x.key">
                    {{ x.label }}
                </a-select-option>
            </a-select>
            <component
                @change="data => onChange(data, curSet.cb)"
                @input.stop="onInput"
                @pressEnter="onEnter"
                :is="curSet.component"
                v-model="value"
                v-bind="curSet.attr"
                :placeholder="placeholders[curSet.component] || '请选择'"
                :style="{ width: `${width[1]}px` }"
                :showSearch="curSet.component === ComponentSet.SELECT"
                :showArrow="curSet.component === ComponentSet.SELECT"
                optionFilterProp="label"
                :options="curSet.options"
                :dropdownMatchSelectWidth="false"
                dropdownClassName="selectDropClass"
                :maxTagCount="1"
                :supplySearch="curSet.supplySearch || {}"
                :allowClear="curSet.attr && curSet.attr.allowClear !== undefined ? curSet.attr.allowClear : true"
            >
                <a-tooltip slot="suffix" title="按回车键搜索">
                    <div @click="onEnter" class="enter-icon">
                        <we-icon name="enter1" />
                    </div>
                </a-tooltip>
            </component>
        </a-input-group>
        <a-button class="more" @click="showMore">
            <span>高级搜索</span>
            <we-icon :name="showAllSearch ? 'chevron--up' : 'chevron--down'" />
        </a-button>
    </div>
</template>

<script>
import { ComponentSet } from '../properties';
import lodash from 'lodash';
const placeholders = {
    [ComponentSet.INPUT]: '请输入',
    [ComponentSet.SELECT]: '请选择',
    [ComponentSet.DATERANGEPICKER]: ['开始时间', '结束时间'],
};
export default {
    name: 'WeintSearchMini',
    props: {
        searchs: Array, // 搜索项配置
        searchForm: Object, // 搜索模型
        width: { type: Array, default: () => [104, 210] }, // 组件宽度
        showAllSearch: Boolean, // 是否展示高级搜索
    },
    data() {
        return {
            ComponentSet,
            defaultSearchForm: {}, // 默认查询条件
            key: undefined, // 当前查询项
            value: undefined, // 当前查询项的值
            curSet: { component: ComponentSet.INPUT }, // 当前查询项的配置
            isInputing: false, // 是否输入框正在输入(输入框输入过程中需要阻止change事件)
            placeholders,
        };
    },
    mounted() {
        this.defaultSearchForm = lodash.cloneDeep(this.searchForm);
    },
    watch: {
        searchForm: {
            handler(v) {
                this.value = v[this.key];
            },
            deep: true,
        },
    },
    computed: {
        isWeSelect() {
            return (
                this.curSet.component === 'weint-select' ||
                this.curSet.component === 'WeintSelect' ||
                this.curSet.component === 'WeSelect' ||
                this.curSet.component === 'we-select'
            );
        },
        searchsFlt() {
            return this.searchs.filter(v => !v.hideInMini && !v.hidden);
        },
    },
    methods: {
        // 选择key
        handleChangeKey() {
            this.isInputing = false;
            this.curSet = this.searchs.find(v => v.key === this.key);
            // this.value = this.searchForm[this.key]; // 如果searchForm中设置了默认值，则展示默认值
            this.$emit('update:searchForm', { ...this.defaultSearchForm });
        },
        // 输入框输入文字
        onInput() {
            this.isInputing = true;
        },
        // 输入框回车
        onEnter() {
            this.isInputing = false;
            this.onChange();
        },
        // 搜索值改变触发onSearch
        onChange(data, cb) {
            this.$nextTick(() => {
                if (!this.key || this.isInputing) return; // 输入框输入过程中阻止change事件
                let params = { [this.key]: this.value };
                let multipleData = {};
                for (let k in params) {
                    if (k.split(',').length > 1 && params[k]) {
                        k.split(',').forEach((v, i) => {
                            if (typeof params[k] === 'string') {
                                multipleData[v] = params[k].split(',')[i];
                            }
                            if (params[k] instanceof Array) {
                                multipleData[v] = params[k][i];
                            }
                        });
                    }
                }
                cb && cb(data);
                params = { ...this.searchForm, ...(this.isWeSelect ? {} : params), ...multipleData }; // 最终查询参数为：默认查询参数 && 组件参数 && 逗号分隔的多参数
                this.$emit('onSearch', params);
            });
        },
        // 展示高级搜索
        showMore() {
            this.$emit('update:showAllSearch', !this.showAllSearch);
            this.key && this.$emit('update:searchForm', { ...this.searchForm, [this.key]: this.value });
        },
        // 重置
        reset() {
            this.$emit('update:searchForm', { ...this.defaultSearchForm });
            this.key = undefined;
            this.value = undefined;
            this.curSet = { component: ComponentSet.INPUT };
        },
    },
};
</script>

<style lang="less" scoped>
.weint-search-mini {
    display: flex;
    flex-wrap: nowrap;
    /deep/.ant-input-group.ant-input-group-compact {
        display: flex;
        margin-right: 8px;
    }
    /deep/.ant-select-selection--multiple .ant-select-selection__rendered {
        height: 30px;
        ul {
            display: flex;
        }
    }
    /deep/.ant-select-selection--multiple .ant-select-selection__choice__content {
        white-space: unset;
        text-overflow: unset;
    }
    .more {
        > .we-icon {
            position: relative;
            left: 4px;
        }
    }
    .enter-icon {
        height: 30px;
        line-height: 26px;
        cursor: pointer;
        color: @font-gy2;
        transition: color 0.2s;
        &:hover {
            color: @font-gy3;
        }
    }
}
</style>
<style lang="less">
.selectDropClass {
    .ant-select-dropdown-menu {
        .we-scroll;
    }
}
</style>
