<template>
    <a-card ref="weintDialog" :bordered="false" :class="['weint-dialog']">
        <div slot="title">
            {{ dialogInfo.title }}
            <div class="dialog-action-box">
                <span class="dialog-action size-icon small-icon" @click="() => setSize('small')">
                    <we-icon name="subtract" />
                </span>
                <span class="dialog-action size-icon middle-icon" @click="() => setSize('middle')">
                    <we-icon name="copy" />
                </span>
                <span class="dialog-action size-icon large-icon" @click="() => setSize('large')">
                    <we-icon name="checkbox" />
                </span>
                <span class="dialog-action" @click="close">
                    <we-icon name="close1" />
                </span>
            </div>
        </div>
        <div v-if="dialogInfo.visible" class="weint-dialog-visible">
            <div class="content">
                <slot></slot>
            </div>
            <div v-if="$slots.footer" class="footer">
                <slot name="footer"></slot>
            </div>
            <div v-else class="footer">
                <slot name="footer-btns-front"></slot>
                <a-button v-if="dialogInfo.Oper === 'DETAIL'" type="primary" @click="close">关闭</a-button>
                <template v-else>
                    <a-button type="default" @click="close">{{ cancelText }}</a-button>
                    <a-button v-if="showSubmit" :loading="confirmLoading" type="primary" @click="confirm">
                        {{ okText }}
                    </a-button>
                </template>
                <slot name="footer-btns-after"></slot>

                <!-- 兼容老版本插槽 -->
                <slot name="customer-footer"></slot>
            </div>
        </div>
    </a-card>
</template>

<script>
export default {
    name: 'WeintDialog',
    props: {
        confirmLoading: Boolean,
        dialogInfo: {
            type: Object,
            default: () => ({}),
        },
        okText: {
            type: String,
            default: '确定',
        },
        cancelText: {
            type: String,
            default: '取消',
        },
        size: {
            type: String,
            default: 'small',
        },
        showSubmit: { type: Boolean, default: true },
    },
    data() {
        return {};
    },
    watch: {
        'dialogInfo.visible': {
            handler(v) {
                this.change(v);
            },
        },
        size(v) {
            this.$dialog.setSize(v);
        },
    },
    methods: {
        // visible状态改变
        change(v) {
            if (v === true) {
                this.$dialog.push(this.$refs['weintDialog'].$el, { size: this.size, close: this.close });
                this.escWatch();
            } else if (v === false) {
                this.$dialog.remove(this.$refs['weintDialog'].$el);
            }
        },
        // 关闭
        close() {
            this.$emit('onClose');
        },
        // 确定
        confirm() {
            this.$emit('onConfirm');
        },
        // 设置尺寸
        setSize(size) {
            if (
                this.$slots.default &&
                this.$slots.default[0] &&
                this.$slots.default[0].componentInstance &&
                this.$slots.default[0].componentInstance.resetFormItemWidth
            ) {
                setTimeout(() => {
                    this.$slots.default[0].componentInstance.resetFormItemWidth(); // 动画结束后重新计算表单列数
                }, 500);
            }
            this.$dialog.setSize(size);
        },
        // 监听esc退出
        escWatch() {
            let dom = document.getElementById('weint-dialog');
            setTimeout(() => {
                dom.focus();
                dom.onkeydown = e => {
                    if (e.keyCode === 27) {
                        this.dialogInfo.visible = false;
                        this.$dialog.close();
                    }
                };
            });
        },
    },
};
</script>

<style lang="less" scope>
.weint-dialog {
    display: none;
    .weint-dialog-visible {
        height: 100%;
    }
    .dialog-action-box {
        display: flex;
        float: right;
        align-items: center;
    }
    .dialog-action {
        cursor: pointer;
        color: @font-gy3;
        transition: color 0.2s;
        line-height: 16px;
        margin-left: 10px;
        > svg {
            font-size: 22px;
        }
        &:hover {
            color: @font-gy4;
        }
        &.middle-icon {
            transform: rotateY(180deg) scale(0.88);
            > svg {
                font-size: 18px;
            }
        }
        &.large-icon {
            > svg {
                font-size: 18px;
            }
        }
    }
    .ant-card-head {
        border-bottom: 1px solid @component-border;
        margin-bottom: 0;
    }
    .ant-card-body {
        padding: 0;
        height: calc(100% - 56px);
        position: relative;
        .content {
            .we-scroll;
            padding: 24px;
            overflow: auto;
            height: calc(100% - 64px);
        }
        .footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: right;
            height: 64px;
            align-items: center;
            border-top: 1px solid @component-border;
            padding: 0 16px;
            > * {
                margin-left: 8px;
            }
        }
    }
}
</style>
