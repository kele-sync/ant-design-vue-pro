<template>
    <div
        v-show="contextMenuInfo.visible"
        class="context-menu-container"
        :style="{ left: contextMenuInfo.x + 'px', top: contextMenuInfo.y + 'px' }"
    >
        <a-menu>
            <template v-for="x in menus">
                <a-menu-item
                    :class="[x.type]"
                    @mousedown.stop
                    @click="() => handleChoose(x)"
                    :key="x.type"
                    :disabled="x.disabled"
                    v-if="!x.hidden"
                >
                    <we-icon :name="MENUS[x.type].icon" />
                    {{ x.label }}
                </a-menu-item>
            </template>
        </a-menu>
        <div v-if="!menus.find(v => !v.hidden)" class="nodata">暂无操作</div>
    </div>
</template>

<script>
const MENUS = {
    DETAIL: { icon: 'view' },
    EDIT: { icon: 'edit' },
    DELETE: { icon: 'trash-can1' },
};
export default {
    props: {
        contextMenuInfo: Object,
        menus: { type: Array, default: () => [] },
    },
    data() {
        return { MENUS };
    },
    watch: {
        'contextMenuInfo.visible'(visible) {
            window[visible ? 'addEventListener' : 'removeEventListener']('mousedown', this.close);
        },
    },
    methods: {
        // 关闭右键菜单
        close() {
            this.$emit('update:contextMenuInfo', { ...this.contextMenuInfo, visible: false });
        },
        // 点击右键菜单
        handleChoose(x) {
            this.close();
            this.$emit('onChoose', x);
        },
    },
};
</script>

<style lang="less">
.context-menu-container {
    width: 150px;
    position: fixed;
    z-index: @context-menu-zindex;
    border-radius: 8px;
    box-shadow: @shadow-1;
    // border: 1px solid @gray-4;
    overflow: hidden;
    background: #fff;

    > ul {
        padding: 4px;

        > li {
            margin: 0 !important;
            padding: 4px;
            color: @text-color;
            transition: background 0.2s;
            padding: 5px 12px !important;
            height: 34px !important;
            line-height: 24px !important;
            border-radius: 4px;
            display: flex;
            align-items: center;

            > .we-icon {
                margin-right: 5px;
            }

            &.ant-menu-item-selected {
                background: unset !important;
            }

            &:hover:not(.ant-menu-item-disabled) {
                color: @text-color;
                background: @gray-2 !important;
            }

            &:active {
                background: unset !important;
            }

            &.DELETE {
                color: @error-color;

                &:hover {
                    color: @error-color !important;
                }
            }

            &.ant-menu-item-disabled.DELETE {
                color: @error-disabled !important;
            }
        }
    }

    .nodata {
        padding-bottom: 8px;
        text-align: center;
    }
}
</style>
