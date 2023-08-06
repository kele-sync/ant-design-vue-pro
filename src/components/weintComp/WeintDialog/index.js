import index from './index.vue';
export default {
    install: function (Vue) {
        const instance = Vue.extend(index);
        let dialog = new instance();
        document.body.appendChild(dialog.$mount().$el);
        Vue.prototype.$dialog = {
            push(v, params = {}) {
                dialog.push(v, params);
            },
            remove(v) {
                dialog.remove(v);
            },
            close(v) {
                dialog.close();
            },
            setSize(v) {
                dialog.setSize(v);
            },
        };
    },
};
