<template>
    <div>
        <div v-for="(item, i) in detailFormList" :key="i">
            <!-- 分割线 -->
            <div v-if="item[0].component == 'a-divider'">
                <a-divider orientation="center">
                    <a-icon type="tags" />
                    {{ item[0].title }}
                </a-divider>
            </div>
            <!-- 分割线插槽 -->
            <slot v-else-if="item[0].dividerSlot" :name="item[0].dividerSlot"></slot>
            <!-- 描述信息 -->
            <a-descriptions v-else size="middle" :column="computeColNum" class="weint-form-detail-container">
                <template v-for="x in item">
                    <a-descriptions-item
                        :key="x.key"
                        :label="x.label || x.labelText"
                        :span="(x.detailAttr && x.detailAttr.span) || 1"
                    >
                        <!-- slot -->
                        <div v-if="x.detailAttr && x.detailAttr.slot">
                            <slot :name="x.detailAttr.slot" v-bind="{ value: dialogForm[x.key] }"></slot>
                        </div>
                        <!-- 图片 -->
                        <template v-else-if="x.detailAttr && x.detailAttr.isImg">
                            <img preview="1" class="img" :src="dialogForm[x.key]" />
                        </template>
                        <!-- 文件 -->
                        <template v-else-if="x.detailAttr && x.detailAttr.isFile">
                            <a :href="dialogForm[x.key]" download>点击下载</a>
                        </template>
                        <!-- 树 -->
                        <span v-else-if="x.component === 'a-tree-select'" class="text">
                            {{ getLabelFromTreedata(x) }}
                        </span>
                        <!-- 开关 -->
                        <span v-else-if="x.component === 'a-switch'" class="text">
                            {{ dialogForm[x.key] ? x.attr.checkedChildren : x.attr.unCheckedChildren }}
                        </span>
                        <!-- 文本 -->
                        <span v-else class="text">
                            <span>
                                {{
                                    x.fomartValueFuc
                                        ? x.fomartValueFuc(x, dialogForm)
                                        : getLabelFromOptions(x.options, dialogForm[x.key], x) !== ''
                                        ? getLabelFromOptions(x.options, dialogForm[x.key], x)
                                        : '--'
                                }}
                            </span>
                        </span>
                    </a-descriptions-item>
                </template>
            </a-descriptions>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visiableFormList: Array,
        dialogForm: Object,
        computeColNum: Number,
    },
    computed: {
        // 查看详情数据列表
        detailFormList() {
            let i = 0,
                arr = [];
            this.visiableFormList.map(item => {
                if (item.component === 'a-divider' || item.dividerSlot) {
                    if (i === 0 && !arr[i]) arr[i] = [item];
                    else if (i === 0 && arr[i]) arr[++i] = [item];
                    else arr[++i] = [item];
                    i++;
                } else {
                    arr[i] ? arr[i].push(item) : (arr[i] = [item]);
                }
            });
            return arr;
        },
    },
    methods: {
        // 获得树形结构的label
        getLabelFromTreedata(item) {
            let tree = item.attr.treeData;
            let value = this.dialogForm[item.key];
            let childrenName = item.attr.childrenName || 'childs';
            let key = item.key;
            let treeItem = {};
            function getTreedata(tree, value, childrenName, key) {
                for (let item of tree) {
                    if (!item[childrenName] && item.id !== value) {
                        continue;
                    }
                    if (item.id === value) {
                        treeItem[key] = item.name;
                    } else {
                        getTreedata(item[childrenName], value, childrenName, key);
                    }
                }
            }
            getTreedata(tree, value, childrenName, key);
            return treeItem[key] || '';
        },
        // 获得普通枚举的label
        getLabelFromOptions(options, value, item) {
            if (!options) {
                return value;
            } else {
                if (item.attr && item.attr.mode == 'multiple') {
                    if (value && value.length > 0) {
                        return options
                            .filter(v => value.indexOf(v.value) != -1)
                            .map(e => e.label)
                            .join(',');
                    } else {
                        return '';
                    }
                } else {
                    let res = options.find(v => v.value === value);
                    return res ? res.label : value;
                }
            }
        },
    },
};
</script>

<style></style>
