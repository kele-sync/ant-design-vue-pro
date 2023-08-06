<template>
    <svg @click="$emit('click')" class="we-icon" aria-hidden="true" :style="{ width: '1em', height: '1em' }">
        <use :xlink:href="`#${name}`" />
    </svg>
</template>

<script>
export default {
    name: 'WeIcon',
    inheritAttrs: false,
    props: {
        name: {
            type: String,
            default: '',
        },
    },
};
</script>

<style scoped lang="less">
.we-icon {
    vertical-align: sub;
    font-size: 16px;
}
</style>
