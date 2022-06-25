
<template>
  <v-container fluid>
    <h1>Visualisation</h1>
    <v-row>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600"
      >
        <v-card>
          <v-card-title class="text-h5">
            Node info
          </v-card-title>
          <v-card-text v-if="this.dialogItem.isCrawled">
            Crawled by websites:
            <ul>
              <li v-bind:key="`li-${index}`" v-for="(item, index) in this.dialogItem.crawledBy">
                {{ item }}
                <v-icon
                  small
                  class="mr-2"
                  @click="runExecution(item)"
                >
                  mdi-arrow-right-drop-circle
                </v-icon>
              </li>
            </ul>
          </v-card-text>
          <v-card-text v-if="!this.dialogItem.isCrawled">
            URL: {{ this.dialogItem.id }}
          </v-card-text>
          <v-card-text v-if="!this.dialogItem.isCrawled">
            <v-icon
                  small
                  class="mr-2"
                  @click="addNewWebsiteRecord()"
                >
                  mdi-plus-circle
                </v-icon>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="darken-1"
              text
              @click="dialog = false"
            >
              Zavřít
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-col cols="2">
        <v-switch
          v-model="switch1"
          label="Zobrazit domény"
          @change="paintVis()"
        ></v-switch>
        <v-switch
          v-model="switchLiveModeChecker"
          label="Live mode"
          @change="switchLiveMode()"
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
          @click="paintVis"
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
            v-on:dblclick="showDialog(node)"
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
import ExecutionDataService from '../services/ExecutionDataService'
import WebpageDataService from '../services/WebpageDataService'
import * as d3 from 'd3'
import { VTooltip } from 'v-tooltip'

export default {
  name: 'Visualisation',
  directives: {
    VTooltip
  },
  sockets: {
  },
  methods: {
    runExecution (item) {
      console.log(item)
      const regexp = this.dialogItem.regexps.find(x => x.url === item)
      const data = {
        url: item,
        regexp: regexp.regexp
      }
      ExecutionDataService.create(data)
        .then(response => {
          this.alertVisible = true
        })
        .catch(e => {
          console.log(e)
        })
    },
    addNewWebsiteRecord: function (item) {
      const data = {
        label: this.dialogItem.id,
        url: this.dialogItem.id,
        regexp: 'a[href]',
        tags: '',
        periodicity: 'hour',
        active: true
      }
      WebpageDataService.create(data)
        .then(response => {
          console.log(response)
          this.switchLiveModeChecker = true
          this.switchLiveMode()
        })
        .catch(e => {
          console.log(e)
        })
    },
    switchLiveMode: function () {
      if (this.switchLiveModeChecker) {
        this.myInterval = setInterval(this.setColor, 2000)
      } else {
        clearInterval(this.myInterval)
      }
    },
    setColor: function () {
      this.paintVis()
    },
    showDialog: function (node) {
      this.dialogItem = node
      console.log(this.dialogItem)
      this.dialog = true
    },
    getVis () {
      NodeDataService.getAll(this.select).then((data) => {
        this.graph.nodes = data.data.nodes
        this.graph.links = data.data.links
        this.initializeGraph()
      })
    },
    getDomainVis () {
      NodeDataService.getAll(this.select).then((data) => {
        this.graph.nodes = data.data.nodes
        this.graph.links = data.data.links
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
      })
    },
    paintVis () {
      if (this.switch1) {
        this.getDomainVis()
      } else {
        this.getVis()
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
          x: 10 + (node.x - this.bounds.minX) * (this.width - 2 * this.padding) / (this.bounds.maxX - this.bounds.minX),
          y: this.padding + (node.y - this.bounds.minY) * (this.height - 2 * this.padding) / (this.bounds.maxY - this.bounds.minY)
        }
      })
    }
  },
  created () {
    WebpageDataService.getAll().then((data) => {
      data.data.forEach(x => {
        this.items.push(x.url)
      })
    })
  },
  beforeDestroy () {
    clearInterval(this.myInterval)
  },
  data: () => ({
    myInterval: undefined,
    switchLiveModeChecker: false,
    dialog: false,
    switch1: false,
    dialogItem: {},
    select: [],
    items: [],
    nodes: [],
    graph: {
      nodes: [],
      links: []
    },
    width: Math.max(document.documentElement.clientWidth * 9.8 / 12, window.innerWidth * 9 / 12 || 0),
    height: Math.max(document.documentElement.clientHeight - 120, window.innerHeight - 120 || 0),
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
