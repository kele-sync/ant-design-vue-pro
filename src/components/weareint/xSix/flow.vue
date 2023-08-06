<template>
  <div style="display: flex">
    <div id="stencil"></div>
    <div id="container" @click="clickContainer"></div>
    <MenuBar
      v-if="showContextMenu && canBeDeleted"
      ref="menuBar"
      @callBack="contextMenuFn"
    />
  </div>
</template>

<script>
// import { Graph, Shape, Addon } from "@antv/x6";
import { Graph, Addon, Shape } from "@antv/x6";
import MenuBar from "./components/menuBar";

// import '@antv/x6-vue-shape'
export default {
  name: "xSix",
  components: { MenuBar },
  props: {
    stencilNodes: Array,
    registerNodes: Array,
    edgeSetting: Object,
    stencilSetting: Object,
    ports: Object,
    nodes: Object,
  },
  data() {
    return {
      showContextMenu: false,
      graph: null,
      stencil: null,
      clickItem: false,
      canBeDeleted: true,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initGraph();
      this.initStencil();
      this.createStencilNodes();
      this.initFunction();
      this.initShortcutKey();
      this.fromJSON();
    });
  },
  methods: {
    fromJSON() {
      this.graph.fromJSON(this.nodes);
    },
    clickContainer() {
      this.showContextMenu = false;
      if (this.clickItem) {
        this.clickItem = false;
      } else {
        this.$emit("clickGraph");
      }
    },
    freeze() {
      this.canBeDeleted = false;
      this.graph.freeze();
    },
    initStencil() {
      this.stencilSetting.target = this.graph;
      const stencil = new Addon.Stencil(this.stencilSetting);
      document.getElementById("stencil").appendChild(stencil.container);
      this.stencil = stencil;
    },
    initGraph() {
      const self = this;
      const graph = new Graph({
        container: document.getElementById("container"),
        width: 800,
        height: 600,
        grid: {
          size: 10, // 网格大小 10px
          visible: true, // 渲染网格背景
        },
        frozen: self.frozen,
        highlighting: {
          magnetAdsorbed: {
            name: "stroke",
            args: {
              attrs: {
                fill: "#5F95FF",
                stroke: "#5F95FF",
              },
            },
          },
        },
        // resizing: true,
        // rotating: true,
        connecting: {
          router: {
            name: "manhattan",
            args: {
              padding: 1,
            },
          },
          connector: {
            name: "rounded",
            args: {
              radius: 8,
            },
          },
          anchor: "center",
          connectionPoint: "anchor",
          allowBlank: false,
          snap: {
            radius: 20,
          },
          createEdge() {
            return new Shape.Edge(self.edgeSetting);
          },
          validateConnection({ targetMagnet }) {
            return !!targetMagnet;
          },
        },
        selecting: {
          enabled: true,
          rubberband: true,
          // showNodeSelectionBox: true,
          // showEdgeSelectionBox: true,
        },
        resizing: true,
        snapline: true,
        keyboard: true,
        clipboard: true,
      });
      this.graph = graph;
      this.registerNode();
    },

    initFunction() {
      const self = this;
      this.graph.on("node:click", (e) => {
        const keydownEvent = (event) => {
          if (event.code === "Delete") {
            this.graph.removeNode(e.node.id);
            this.$emit("removeItem");
            this.showContextMenu = false;
          }
          window.document.removeEventListener("keydownEvent", keydownEvent);
        };
        window.document.addEventListener("keydown", keydownEvent);
        this.clickItem = true;
        this.showContextMenu = false;
        self.$nextTick(() => {
          this.$emit("clickNode", e);
        });
      });
      this.graph.on("edge:click", (e) => {
        this.clickItem = true;
        this.showContextMenu = false;
        self.$nextTick(() => {
          this.$emit("clickNode", e, "edge");
        });
      });
      this.graph.on("edge:contextmenu", ({ e, x, y, edge }) => {
        if (this.canBeDeleted) {
          this.showContextMenu = true;
          this.$nextTick(() => {
            console.log("e.offsetX,e.offsetY:", e.offsetX, e.offsetY, x, y, e);
            this.$refs.menuBar.initFn(e.offsetX, e.offsetY, {
              type: "edge",
              item: edge,
            });
          });
        }
      });

      this.graph.on("node:contextmenu", ({ e, node }) => {
        if (this.canBeDeleted) {
          this.showContextMenu = true;
          this.$nextTick(() => {
            this.$refs.menuBar.initFn(e.offsetX, e.offsetY, {
              type: "node",
              item: node,
            });
          });
        }
      });
      this.graph.on("node:mouseenter", () => {
        const container = document.getElementById("container");
        const ports = container.querySelectorAll(".x6-port-body");
        this.showPorts(ports, true);
      });
      this.graph.on("node:mouseleave", () => {
        const container = document.getElementById("container");
        const ports = container.querySelectorAll(".x6-port-body");
        this.showPorts(ports, false);
      });

      this.graph.on("node:change:data", ({ node }) => {
        const edges = this.graph.getIncomingEdges(node);
        const { status } = node.getData();
        edges?.forEach((edge) => {
          if (status === "running") {
            edge.attr("line/strokeDasharray", 5);
            edge.attr(
              "line/style/animation",
              "running-line 30s infinite linear"
            );
          } else {
            edge.attr("line/strokeDasharray", "");
            edge.attr("line/style/animation", "");
          }
        });
      });
    },
    toJSON() {
      return this.graph.toJSON();
    },
    createStencilNodes() {
      const nodeList = this.stencilNodes.map((e) => {
        return this.graph.createNode(e);
      });
      this.stencil.load(nodeList, "group1");
    },
    contextMenuFn(type, node) {
      switch (type) {
        case "remove":
          if (node.type == "edge") {
            this.graph.removeEdge(node.item.id);
          } else if (node.type == "node") {
            this.graph.removeNode(node.item.id);
          }
          break;
      }
      this.$emit("removeItem");
      this.showContextMenu = false;
    },
    registerNode() {
      this.registerNodes.map((e) => {
        e.value.ports = this.ports;
        Graph.registerNode(e.name, e.value, true);
      });
    },
    initShortcutKey() {
      this.graph.bindKey(["meta+c", "ctrl+c"], () => {
        const cells = this.graph.getSelectedCells();
        if (cells.length) {
          this.graph.copy(cells);
        }
        return false;
      });
      this.graph.bindKey(["meta+x", "ctrl+x"], () => {
        const cells = this.graph.getSelectedCells();
        if (cells.length) {
          this.graph.cut(cells);
        }
        return false;
      });
      this.graph.bindKey(["meta+v", "ctrl+v"], () => {
        if (!this.graph.isClipboardEmpty()) {
          const cells = this.graph.paste({ offset: 32 });
          this.graph.cleanSelection();
          this.graph.select(cells);
        }
        return false;
      });

      //undo redo
      this.graph.bindKey(["meta+z", "ctrl+z"], () => {
        if (this.graph.history.canUndo()) {
          this.graph.history.undo();
        }
        return false;
      });
    },
    showPorts(ports, show) {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? "visible" : "hidden";
      }
    },
  },
};
</script>

<style>
#container {
  display: flex;
  border: 1px solid #dfe3e8;
  width: calc(100% - 100px);
  height: 100%;
}

#stencil {
  width: 100px;
  position: relative;
  border-right: 1px solid #dfe3e8;
}

.x6-widget-stencil {
  background-color: #fff;
}

.x6-widget-stencil-title {
  background-color: #fff;
}

.x6-widget-stencil-group-title {
  background-color: #fff !important;
}

.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0px;
  border: 1px solid #239edd;
}

.x6-widget-transform > div {
  border: 1px solid #239edd;
}

.x6-widget-transform > div:hover {
  background-color: #3dafe4;
}

.x6-widget-transform-active-handle {
  background-color: #3dafe4;
}

.x6-widget-transform-resize {
  border-radius: 0;
}

.x6-widget-selection-inner {
  border: 1px solid #239edd;
}

.x6-widget-selection-box {
  opacity: 0;
}

.my-selecting {
  border: 1px solid red;
  display: block;
  z-index: 0;
}

.x6-node-selected .node {
  border-color: #189;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}

.x6-node-selected .node.custom-rect {
  border-color: #52c41a;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}

.x6-node-selected .node.failed {
  border-color: #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #fedcdc;
}

.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 2px !important;
}

.section-cot {
  display: flex;
}

.section-cot #container {
  position: relative;
  flex: 1;
}

.section-cot #container #draw-cot {
  width: 100%;
  height: 100%;
}
</style>
