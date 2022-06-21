
<template>
  <v-container fluid>
    <h1>Visualisation</h1>
    <v-row>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            Use Google's location service?
          </v-card-title>
          <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              Disagree
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-col cols="2">
        <v-switch
          v-model="switch1"
          label="Zobrazit domény"
          @change="switchChanged()"
        ></v-switch>
        <v-combobox
          v-model="select"
          :items="items"
          label="Vyber records"
          multiple
          outlined
          dense
        ></v-combobox>
        <v-btn
          @click="getVisualization"
        >
          Zobraz
        </v-btn>
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
      </v-col>
      <v-col cols="10">
        <svg xmlns="http://www.w3.org/2000/svg"
          :width="(width)+'px'"
          :height="height+'px'"
          v-if="bounds.minX">
          <defs>
            <!-- arrowhead marker definition -->
            <marker id="arrow" viewBox="0 0 10 10" refX="35" refY="5"
                markerWidth="4" markerHeight="4"
                orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <line v-for="(link, i) in graph.links"
                v-bind:key="`link-${i}`"
                :x1="coords[link.source.index].x"
                :y1="coords[link.source.index].y"
                :x2="coords[link.target.index].x"
                :y2="coords[link.target.index].y"
                stroke="black" stroke-width="1"
                marker-end="url(#arrow)"
                />

          <circle v-for="(node, i) in graph.nodes"
            v-tooltip="node.label"
            v-bind:key="`circle-${i}`"
            :cx="coords[i].x"
            :cy="coords[i].y"
            :r="10" :fill="node.color"
            stroke="white" stroke-width="1"
            v-on:dblclick="funcao(node)"
            class="circle"
          />

        </svg>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from '../router'
import NodeDataService from '../services/NodeDataService'
import WebpageDataService from '../services/WebpageDataService'
import * as d3 from 'd3'
import { link, select } from 'd3'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'

export default {
  name: 'Query',
  directives: {
    VTooltip
  },
  sockets: {
  },
  methods: {
    funcao: function (node) {
      this.dialog = true
    },
    getVisualization () {
      NodeDataService.getAll().then((data) => {
        this.graph.nodes = data.data.nodes
        this.graph.links = data.data.links
        this.initializeGraph()
      })
    },
    switchChanged () {
      if (this.switch1) {
        let myArray = []
        const links = []
        myArray = this.graph.nodes.map(x => {
          const domain = (new URL(x.id)).hostname
          if (links[domain] === undefined) {
            links[domain] = []
          }
          x.links.forEach(y => links[domain].push((new URL(y)).hostname))
          return domain
        })
        myArray = [...new Set(myArray)]
        for (const key in links) {
          links[key] = [...new Set(links[key])]
        }
        this.graph.nodes = []
        this.graph.links = []
        myArray.forEach(x => {
          this.graph.nodes.push({
            id: x,
            label: x
          })
        })
        myArray.forEach(domain => {
          links[domain].forEach(link => {
            const left = this.graph.nodes.find(y => y.id === domain)
            const right = this.graph.nodes.find(y => y.id === link)
            this.graph.links.push({
              source: this.graph.nodes.indexOf(left),
              target: this.graph.nodes.indexOf(right)
            })
          })
        })
        this.initializeGraph()
      } else {
        NodeDataService.getAll().then((data) => {
          this.graph.nodes = data.data.nodes
          this.graph.links = data.data.links
          this.initializeGraph()
        })
      }
    },
    initializeGraph () {
      this.simulation = d3.forceSimulation(this.graph.nodes)
        .force('charge', d3.forceManyBody().strength(d => -100))
        .force('link', d3.forceLink(this.graph.links))
        .force('x', d3.forceX())
        .force('y', d3.forceY())
    }
  },
  computed: {
    bounds () {
      return {
        minX: Math.min(...this.graph.nodes.map(n => n.x)),
        maxX: Math.max(...this.graph.nodes.map(n => n.x)),
        minY: Math.min(...this.graph.nodes.map(n => n.y)),
        maxY: Math.max(...this.graph.nodes.map(n => n.y))
      }
    },
    coords () {
      return this.graph.nodes.map(node => {
        return {
          x: (node.x - this.bounds.minX) * (this.width - 10 * this.padding) / (this.bounds.maxX - this.bounds.minX),
          y: this.padding + (node.y - this.bounds.minY) * (this.height - 2 * this.padding) / (this.bounds.maxY - this.bounds.minY)
        }
      })
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },
  created () {
    WebpageDataService.getAll().then((data) => {
      data.data.forEach(x => {
        this.items.push(x.url)
      })
    })
  },
  mounted () {
  },
  data: () => ({
    dialog: false,
    switch1: false,
    select: [],
    items: [],
    nodes: [],
    graph: {
      nodes: [],
      links: []
    },
    width: Math.max(document.documentElement.clientWidth - 150, window.innerWidth - 150 || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    padding: 20,
    colors: ['#2196F3', '#E91E63', '#7E57C2', '#009688', '#00BCD4', '#EF6C00', '#4CAF50', '#FF9800', '#F44336', '#CDDC39', '#9C27B0']
  })
}
</script>

<style>

.tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }

.circle {
  cursor: pointer;
  text-decoration: underline;
}

.mujContainer {
  font-size: 0.8em;
  font-style: normal;
  font-family: Arial, Helvetica, sans-serif;
}
          /* :label="`Switch 1: ${switch1.toString()}`" */

</style>
