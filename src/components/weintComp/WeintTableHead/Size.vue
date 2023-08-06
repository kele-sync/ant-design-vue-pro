<template>
    <a-popover
        v-model="sizeVisible"
        placement="bottomRight"
        title=""
        trigger="click"
        overlayClassName="weint-table-drop-menu-box hide-arrow"
    >
        <template slot="content">
            <div
                @click="() => handleChange(x.class)"
                :class="curSize === x.class ? 'active' : ''"
                v-for="x in tableSize"
                :key="x.class"
            >
                {{ x.title }}
            </div>
        </template>
        <a-tooltip placement="top">
            <template slot="title">尺寸调整</template>
            <div class="tool-item">
                <we-icon name="text--line-spacing" />
            </div>
        </a-tooltip>
    </a-popover>
</template>

<script>
import * as Lockr from 'lockr';
Lockr.setPrefix(process.env.VUE_APP_LOCKR);
export default {
    name: 'ToolSize',
    inject: { compPrefix: { default: '' } },
    props: {
        compKey: { type: String, default: 'tableSize' },
        curSize: String,
    },
    data() {
        return {
            sizeVisible: false,
            tableSize: [
                { title: '紧凑', class: 'small' },
                { title: '中等', class: 'default' },
                { title: '宽松', class: 'large' },
            ],
        };
    },
    computed: {
        compUniqueKey() {
            return this.compPrefix + this.compKey;
        },
    },
    mounted() {
        let confSize = Lockr.get('userConfig')[this.$route.path][this.compUniqueKey];
        if (confSize) {
            this.$emit('update:curSize', confSize);
        }
    },
    methods: {
        setConf(size) {
            let userConfig = Lockr.get('userConfig');
            let pageConfig = userConfig[this.$route.path];
            pageConfig[this.compUniqueKey] = size;
            Lockr.set('userConfig', { ...userConfig, [this.$route.path]: pageConfig });
        },
        handleChange(size) {
            this.$emit('update:curSize', size);
            this.sizeVisible = false;
            this.setConf(size);
        },
    },
};
</script>
<style lang="less">
.weint-table-drop-menu-box {
    padding: 0;
    .ant-popover-inner-content {
        padding: 4px !important;
        > div {
            padding: 3px 12px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
            &:hover {
                background: @gray-2;
            }
            &.active {
                background: @primary-1;
                color: @primary-color;
            }
        }
    }
}
</style>
