<template>
    <div
        v-show="visible"
        :class="['weint-card', { border: border }, { 'no-border': !border }]"
        :style="{ margin: formatMargin }"
    >
        <div class="weint-card-header" v-if="title">
            <span class="weint-card-title">{{ title }}</span>
            <div class="weint-card-extra">
                <slot name="extra"></slot>
            </div>
        </div>
        <div class="weint-card-content" :style="{ padding: contentPadding }">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WeintCard',
    props: {
        title: String,
        padding: { type: [String, Number, Boolean], default: 0 },
        margin: { type: [String, Number, Boolean], default: 0 },
        visible: { type: Boolean, default: true },
        border: { type: Boolean, default: true }, // 容器默认有边框，一般弹窗中会使用无边框
    },
    computed: {
        formatMargin() {
            if (typeof this.margin === 'number') {
                return this.margin + 'px';
            } else if (typeof this.margin === 'string') {
                return this.margin;
            } else if (typeof this.margin === 'boolean') {
                return this.margin ? '0 0 16px 0' : 0;
            } else {
                return 0;
            }
        },
        contentPadding() {
            if (typeof this.padding === 'number') {
                return this.padding + 'px';
            } else if (typeof this.padding === 'string') {
                return this.padding;
            } else if (typeof this.padding === 'boolean') {
                return this.padding ? '16px' : 0;
            } else {
                return 0;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.weint-card {
    background: #fff;
    overflow: hidden;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    .weint-card-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        > .weint-table {
            flex-grow: 1;
        }
    }
    /deep/.opation-container .ant-btn {
        margin-bottom: 0 !important;
    }
    &.border {
        box-shadow: @shadow-1;
        border-radius: 6px;
        // 有边框时去掉weint-table自带的左右两侧边框
        /deep/.ve-table.ve-table-border-around {
            border-right: 0;
            border-left: 0;
        }
        /deep/.empty-data {
            border-left: 0 !important;
            border-right: 0 !important;
        }
    }
    &.no-border {
        // 没有边框时去掉首尾的两侧padding
        /deep/.weint-table-head {
            padding: 0;
        }
        /deep/.weint-pagination {
            padding: 0;
        }
    }
    .weint-card-header {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        border-bottom: 1px solid @gray-3;
        .weint-card-title {
            flex-shrink: 0;
            font-size: 15px;
            font-weight: 600;
            color: @font-gy4;
        }
        .weint-card-extra {
            flex-grow: 1;
            display: flex;
            justify-content: right;
        }
    }
}
</style>
