export default {
    methods: {
        // 输入校验
        customCheck() {
            if (this.$refs[this.editTableRef]) {
                const returnInfo = this.$refs[this.editTableRef].checkRequired();
                if (returnInfo) {
                    this.$message.error(`请输入${returnInfo}`);
                    return false;
                }
            }
            return true;
        },
    },
};
