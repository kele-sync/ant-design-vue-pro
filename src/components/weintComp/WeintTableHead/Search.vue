<template>
    <a-tooltip placement="top">
        <template slot="title">{{ showSearch ? '关闭表头查询' : '开启表头查询' }}</template>
        <div class="tool-item">
            <we-icon @click="$emit('update:showSearch', !showSearch)" name="search--locate1" />
        </div>
    </a-tooltip>
</template>

<script>
export default {
    name: 'ToolSearch',
    props: ['showSearch'],
    data() {
        return {};
    },
};
</script>
