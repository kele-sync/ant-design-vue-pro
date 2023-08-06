import { ComponentOpr } from '../properties';

export default {
    data() {
        return {
            embedKey: '', // 当前tab下的embedKey
        };
    },
    mounted() {
        this.embedKey = this.tabList[0]?.embedKey;
    },
    methods: {
        // 切换tab
        changeTab(e) {
            this.embedKey = e;
        },
        // 输入校验
        customCheck() {
            for (let i = 0; i < this.tabList.length; i++) {
                const tab = this.tabList[i];
                const tabEmbedKey = tab.embedKey;
                if (!this.dialogForm[tabEmbedKey]) {
                    this.$set(this.dialogForm, tabEmbedKey, []);
                }
                const embedList = this.dialogForm[tabEmbedKey];
                if (tab.noCheck) continue;
                if (embedList.length == 0) {
                    this.$message.error(`请添加${tab.embedTitle}`);
                    return false;
                }
                if (this.$refs[tabEmbedKey] && this.$refs[tabEmbedKey][0]) {
                    const returnInfo = this.$refs[tabEmbedKey][0].checkRequired();
                    if (returnInfo) {
                        this.$message.error(`请输入${tab.embedTitle}中${returnInfo}`);
                        return false;
                    }
                }
            }
            return true;
        },
        // 操作按钮
        handleEmbedOperation(operation, row, index) {
            this[operation.key](row, index);
        },
        [ComponentOpr.ENBEDDELETE](row, index) {
            this.$refs[this.embedKey][0].deleteRow(index);
        },
        [ComponentOpr.ENBEDCOPY](row, index) {
            this.$refs[this.embedKey][0].copyRow(row, index);
        },
    },
};
