<template>
    <div
        v-show="visible"
        :class="['weint-dialog', 'animate__animated', 'animate__faster', 'animate__fadeIn', size]"
        id="weint-dialog"
        :tabindex="1"
    >
        <div id="weint-dialog-left" />
        <div id="weint-dialog-right" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            cardList: [],
            size: '',
        };
    },
    mounted() {},
    methods: {
        // 插入弹窗
        push(el, { size, close }) {
            if (this.cardList[0] && this.cardList[0].el === el) return; // 解决弹窗重复弹出的问题

            this.visible = true;

            if (this.cardList.length === 0) {
                // 朦层背景渐变动画
                let root = document.getElementById('weint-dialog');
                root.classList.remove('animate__fadeOut');
                root.classList.add('animate__fadeIn');
                // 设置右侧主弹窗的尺寸
                this.size = size;
            }

            // 对所有窗口样式进行调整
            Object.assign(el.style, {
                height: '100%',
                width: '100%',
                display: 'block',
                position: 'absolute',
                left: 0,
                top: 0,
            });

            // 插入窗口dom
            let target = this.cardList.length === 0 ? 'weint-dialog-right' : 'weint-dialog-left';
            document.getElementById(target).appendChild(el);
            el.classList.add('animate__animated');
            el.classList.add('animate__faster');
            el.classList.remove('animate__fadeOutRight');
            el.classList.add('animate__fadeInRight');

            // 这个类会影响到弹窗中的fixed定位，所以动画结束后移除
            setTimeout(() => {
                el.classList.remove('animate__fadeInRight');
            }, 500);

            // 更新cardList
            this.cardList = [...this.cardList.filter(v => v.el !== el), { el, close }];
        },
        // 移除弹窗
        remove(el) {
            this.cardList.forEach((v, index) => {
                if (v.el === el) {
                    if (index === 0) {
                        // 移除主窗口时关闭整个dialog
                        this.close();
                    } else {
                        // 移除次窗口时删除该窗口的dom节点，并更新cardList
                        el.classList.remove('animate__fadeInRight');
                        el.classList.add('animate__fadeOutRight');
                        setTimeout(() => this.removeEle(el), 500);
                        this.cardList.splice(index, 1);
                    }
                }
            });
        },
        // 关闭所有弹窗
        close() {
            // 朦层背景渐变动画
            let root = document.getElementById('weint-dialog');
            root.classList.remove('animate__fadeIn');
            root.classList.add('animate__fadeOut');

            // 清除所有次窗口
            this.cardList.forEach(({ el, close }, index) => {
                if (index > 0) {
                    close && close();
                    this.removeEle(el);
                }
            });

            // 动画结束后关闭dialog
            let el = this.cardList[0].el;
            el.classList.remove('animate__fadeInRight');
            el.classList.add('animate__fadeOutRight');
            setTimeout(() => {
                // 移除主窗口并清空数组
                this.removeEle(el);
                this.cardList = [];
                this.visible = false;
                this.size = '';
            }, 500);
        },
        removeEle(el) {
            el.parentNode && el.parentNode.removeChild(el);
        },
        // 重置弹窗尺寸
        setSize(v) {
            this.size = v;
        },
    },
};
</script>

<style lang="less" scoped>
.weint-dialog {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: @weint-dialog-zindex;
    background: rgba(0, 0, 0, 0.6);
    padding: 16px;
    display: flex;
    justify-content: right;
    #weint-dialog-left,
    #weint-dialog-right {
        height: 100%;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        transition: all 0.5s;
    }
    #weint-dialog-left {
        min-width: 400px;
        margin-right: 16px;
        flex-grow: 1;
        /deep/.size-icon {
            display: none;
        }
    }
    #weint-dialog-right {
        min-width: 400px;
        width: 25%;
    }
    &.small {
        #weint-dialog-right {
            width: 25%;
        }
    }
    &.middle {
        #weint-dialog-right {
            width: 50%;
        }
    }
    &.large {
        #weint-dialog-right {
            width: 75%;
        }
    }
}
</style>
