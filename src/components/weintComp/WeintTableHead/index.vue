<template>
    <div class="weint-table-head">
        <div class="btns" v-if="$slots.default">
            <slot></slot>
        </div>
        <div :class="['right', { hasBtn: $slots.default }]">
            <div v-if="$slots.searchs" class="searchs">
                <slot name="searchs"></slot>
            </div>
            <div v-if="$slots.tools" class="tools">
                <slot name="tools"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WeintTableHead',
};
</script>

<style lang="less" scoped>
.weint-table-head {
    padding: 0 16px;
    display: flex;
    flex-wrap: wrap;
    // user-select: none;
    margin-top: 16px;
    justify-content: right;
    .btns {
        flex-grow: 999;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        > * {
            margin-right: 8px;
        }
    }
    .right {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        max-width: 100%;
        &.hasBtn {
            flex-grow: 1;
        }
        .tools {
            height: 32px;
            display: flex;
            border: 1px solid #d9d9d9;
            border-right: 0 !important;
            border-radius: @border-radius-base;
            margin-left: 8px;
            .tool-item {
                display: flex;
                align-items: center;
            }
            > * {
                font-size: 16px;
                padding: 0 7px;
                cursor: pointer;
                border-right: 1px solid #d9d9d9;
                color: @text-color;
                transition: color 0.2s;
                &:hover {
                    color: @font-gy4;
                }
                &:last-child {
                    border-radius: @border-radius-base;
                }
            }
        }
    }
}
</style>

<style lang="less">
.hide-arrow {
    .ant-popover-arrow {
        display: none;
    }
}
</style>
