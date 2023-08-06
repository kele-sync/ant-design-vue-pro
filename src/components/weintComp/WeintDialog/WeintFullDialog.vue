<template>
    <div
        v-show="dialogInfo.visible"
        ref="weint-dialog-full"
        id="weint-dialog-full"
        :class="['weint-dialog-full', 'animate__animated', 'animate__faster', { isFixWidth }]"
        :style="{ '--headerH': `${headerH}px` }"
        :tabindex="1"
    >
        <div v-if="dialogInfo.visible" class="weint-dialog-visible">
            <div class="header">
                <div class="title">
                    <span>{{ dialogInfo.title }}</span>
                    <div class="header-actions" :style="{ marginRight: hasScroll && isFixWidth ? '17px' : '0px' }">
                        <a-tooltip placement="bottomRight">
                            <template slot="title">定宽/流式布局</template>
                            <span @click="isFixWidth = !isFixWidth" class="header-actions-item">
                                <we-icon name="fit-to-width" />
                            </span>
                        </a-tooltip>
                    </div>
                </div>
            </div>
            <div ref="content" class="content"><slot></slot></div>
            <div class="footer">
                <div class="footer-box">
                    <a-button @click="close">
                        <we-icon name="undo" />
                        返回
                    </a-button>
                    <a-button v-if="isShowSubmit" @click="confirm" :loading="confirmLoading">
                        <we-icon v-if="!confirmLoading" name="check--mark" />
                        {{ okText }}
                    </a-button>
                    <slot name="footer"></slot>
                </div>
                <div :class="['footer-box', 'scroll-top', { show: scrollTop >= 200 }]">
                    <a-tooltip v-if="scrollTop >= 200" placement="top">
                        <template slot="title">回到顶部</template>
                        <div @click="toTop" class="footer-box-item top">
                            <we-icon name="up-to-top" />
                        </div>
                    </a-tooltip>
                    <div v-else @click="toTop" class="footer-box-item top">
                        <we-icon name="up-to-top" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'WeintFullDialog',
    props: {
        confirmLoading: Boolean,
        dialogInfo: {
            type: Object,
            default: () => ({}),
        },
        isShowSubmit: { type: Boolean, default: true },
        okText: {
            type: String,
            default: '提交',
        },
    },
    data() {
        return {
            isFixWidth: true, // 是否定宽
            scrollTop: 0, // 内容区域滚动距离
            hasScroll: false, // 内容区域是否有滚动条
        };
    },
    computed: {
        ...mapState('setting', ['headerH']),
    },
    watch: {
        dialogInfo: {
            handler(v) {
                if (v.visible === true) {
                    this.animateStart();
                    this.$nextTick(() => {
                        this.$refs.content.addEventListener('scroll', this.getScrollTop);
                    });
                    setTimeout(() => {
                        this.hasScroll = this.$refs.content.clientWidth !== this.$refs.content.offsetWidth;
                    });
                    this.escWatch();
                } else if (v.visible === false) {
                    // this.$nextTick(() => {
                    //     this.$refs.content.removeEventListener('scroll', this.getScrollTop);
                    // });
                }
            },
            deep: true,
        },
    },
    methods: {
        // 关闭
        close() {
            this.animateStart('out');
            setTimeout(() => {
                this.$emit('onClose');
            }, 500);
        },
        // 提交
        confirm() {
            this.$emit('onConfirm');
        },
        // 回到顶部
        toTop() {
            if (this.$refs.content.scrollTop < 200) {
                return;
            }
            this.$refs.content.scrollTop = 0;
        },
        // 获取滚动距离
        getScrollTop() {
            this.scrollTop = this.$refs.content.scrollTop;
        },
        // 开始动画
        animateStart(type) {
            let removeClass = 'animate__zoomOut';
            let addClass = 'animate__zoomIn';
            if (type === 'out') {
                removeClass = 'animate__zoomIn';
                addClass = 'animate__zoomOut';
            }
            this.$refs['weint-dialog-full'].classList.remove(removeClass);
            this.$refs['weint-dialog-full'].classList.add(addClass);
        },
        // 监听esc退出
        escWatch() {
            let dom = document.getElementById('weint-dialog-full');
            setTimeout(() => {
                dom.focus();
                dom.onkeydown = e => {
                    e.keyCode === 27 && this.close();
                };
            });
        },
    },
};
</script>
<style lang="less" scoped>
.weint-dialog-full {
    position: fixed;
    width: 100%;
    height: calc(100% - var(--headerH));
    top: var(--headerH);
    bottom: 0;
    left: 0;
    right: 0;
    z-index: @weint-dialog-zindex;
    background: @gray-1;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    overflow: hidden;
    outline: 0;
    .weint-dialog-visible {
        height: 100%;
    }
    .header {
        width: 100%;
        background: #fff;
        border-bottom: 1px solid @component-border;
        .title {
            margin: auto;
            height: 48px;
            line-height: 48px;
            font-weight: 600;
            display: flex;
            width: 100%;
            justify-content: space-between;
            padding: 0 16px;
            background: #fff;
            font-size: 16px;
            .header-actions {
                display: flex;
                align-items: center;
                .header-actions-item {
                    border: 1px solid @border-color-base;
                    border-radius: 4px;
                    line-height: 22px;
                    height: 28px;
                    width: 28px;
                    cursor: pointer;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .we-icon {
                        font-size: 18px;
                        color: @font-gy3;
                        transition: color 0.2s;
                    }
                    &:hover {
                        .we-icon {
                            color: @font-gy4;
                        }
                    }
                }
            }
        }
    }
    .content {
        .we-scroll;
        height: calc(100% - 48px);
        overflow: auto;
        padding: 16px;
        padding-bottom: 60px !important;
        margin: auto;
    }
    .footer {
        position: absolute;
        left: calc(50% + 28px);
        bottom: 16px;
        transform: translate(-50%);
        display: flex;
        z-index: @weint-dialog-zindex;
        .footer-box {
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.54);
            padding: 6px;
            display: flex;
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
            .footer-box-item,
            /deep/ .ant-btn {
                border: 0;
                color: rgba(255, 255, 255, 0.8);
                line-height: 32px;
                padding: 0 12px;
                margin-right: 8px;
                background: rgba(0, 0, 0, 0.35);
                border-radius: 4px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                cursor: pointer;
                > * {
                    margin-left: 5px !important;
                }
                > *:first-child {
                    margin-left: 0 !important;
                }
                > .anticon-loading {
                    width: 16px;
                }
                &:last-child {
                    margin-right: 0;
                }
                &:hover {
                    background: rgba(0, 0, 0, 0.5);
                    color: rgba(255, 255, 255, 1);
                }
                &.top {
                    padding: 0 9px;
                }
                &[disabled] {
                    background: rgba(255, 255, 255, 0.15);
                    cursor: not-allowed;
                }
            }
        }
    }
    .scroll-top {
        opacity: 0;
        transition: opacity 0.2s;
        .footer-box-item {
            cursor: unset !important;
        }
        &.show {
            opacity: 1;
            .footer-box-item {
                cursor: pointer !important;
            }
        }
    }
    &.isFixWidth {
        .title {
            // width: 1200px !important;
            padding: 0 calc(50% - 600px);
        }
        .content {
            // width: 1200px !important;
            padding: 16px calc(50% - 600px);
        }
    }
    /deep/.weint-card {
        min-height: unset !important;
    }
}
</style>
