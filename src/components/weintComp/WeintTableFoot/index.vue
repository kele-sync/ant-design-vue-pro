<template>
    <div
        :style="{ '--paddingLeft': paddingLeft }"
        :class="`weint-table-foot ${selectedRows && selectedRows.length ? 'show' : 'hide'}`"
    >
        <div class="foot-left">
            <span>已选中 {{ selectedRows.length }} 条数据</span>
            <a @click="$emit('update:selectedRows', [])" style="margin-left: 10px">清空</a>
        </div>
        <div class="foot-actions">
            <!-- <a-button
                v-for="(x, i) in actions"
                :key="i"
                v-bind="{
                    ...x,
                    type: x.name === '批量删除' ? 'danger' : '',
                    ghost: x.name === '批量删除',
                }"
                @click="() => x.click && x.click(selectedRows)"
            >
                {{ x.name }}
            </a-button> -->
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'WeintTableFoot',
    inject: ['getCollapsed'],
    props: ['selectedRows', 'actions'],
    computed: {
        ...mapState('setting', ['menuMainW', 'menuSecondaryW']),
        paddingLeft() {
            return this.getCollapsed() ? `${this.menuMainW}px` : `${this.menuMainW + this.menuSecondaryW}px`;
        },
    },
};
</script>

<style lang="less" scoped>
.weint-table-foot {
    width: 100vw;
    background: @white;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    padding-left: var(--paddingLeft);
    border-top: 1px solid @component-border;
    z-index: @weint-table-foot-zindex;
    overflow: hidden;
    transition: all 0.2s;
    &.show {
        height: 56px;
        opacity: 1;
    }
    &.hide {
        height: 0;
        opacity: 0;
    }
    .foot-left {
        flex-shrink: 0;
        padding: 0 16px;
    }
    .foot-actions {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: right;
        padding: 0 16px;
        > * {
            margin-left: 8px;
        }
    }
}
</style>
