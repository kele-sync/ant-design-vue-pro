<template>
    <a-tooltip placement="top">
        <template slot="title">重置</template>
        <div @click="$emit('reset')" class="tool-item">
            <!-- <a-icon v-if="loading" type="loading" /> -->
            <we-icon name="reset" />
        </div>
    </a-tooltip>
</template>

<script>
export default {
    name: 'ToolReset',
    props: ['loading'],
    data() {
        return {};
    },
};
</script>
<style scoped lang="less"></style>
