import weIcon from './index.vue';
export default {
    install: Vue => {
        const svg = require.context('./icons', true, /\.svg$/);
        const requireAll = requireContext => requireContext.keys().map(requireContext);
        requireAll(svg);
        Vue.component('we-icon', weIcon);
    },
};
