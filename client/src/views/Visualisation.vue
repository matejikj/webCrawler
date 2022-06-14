
<template>
  <v-container fluid>
    <h1>Visualisation</h1>
    <v-row>
      <v-col cols="2">
        <v-switch
          v-model="switch1"
          label="dfas"
          @change="switchChanged()"
        ></v-switch>
        <v-combobox
          v-model="select"
          :items="items"
          label="Combobox"
          multiple
          outlined
          dense
        ></v-combobox>
      </v-col>
      <v-col cols="10">
        <svg xmlns="http://www.w3.org/2000/svg"
          :width="(width)+'px'"
          :height="height+'px'"
          v-if="bounds.minX">
          <defs>
            <!-- arrowhead marker definition -->
            <marker id="arrow" viewBox="0 0 10 10" refX="25" refY="5"
                markerWidth="6" markerHeight="6"
                orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <line v-for="(link, i) in graph.links"
                v-bind:key='(i+1) * 1000 + 1'
                :x1="coords[link.source.index].x"
                :y1="coords[link.source.index].y"
                :x2="coords[link.target.index].x"
                :y2="coords[link.target.index].y"
                stroke="black" stroke-width="2"
                marker-end="url(#arrow)"
                />

          <circle v-for="(node, i) in graph.nodes"
            v-bind:key='(i+1) * 100 + 1'
            :cx="coords[i].x"
            :cy="coords[i].y"
            :r="20" :fill="colors[Math.ceil(Math.sqrt(node.index))]"
            stroke="white" stroke-width="1"
          />

          <text v-for="(node, i) in graph.nodes"
            v-bind:key='(i+1) * 10 + 1'
            :x="coords[i].x"
            :y="coords[i].y"
          >
            {{ node.label }}
          </text>

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
import { select } from 'd3'

export default {
  name: 'Query',
  components: {
  },
  sockets: {
  },
  methods: {
    switchChanged () {
      console.log(this.select)
    },
    initialize () {
      NodeDataService.getAll().then((data) => {
        // console.log(data.data)
        // data.data.foreach( x => {
        //   console.log(x.label)
        // })
        this.graph.nodes = []
        this.graph.links = []
        let visitedNodes = []
        console.log(data.data)
        data.data.forEach(webpage => {
          const label = webpage.label
          webpage.nodes.forEach(node => {
            if (visitedNodes.indexOf(node.url) === -1) {
              visitedNodes.push(node.url)
              this.graph.nodes.push({
                id: node.url,
                label: node.url
              })
            } else {
              let finded = this.graph.nodes.find(x => x.id === node.url)
              finded.label = node.url
            }
            node.links.forEach(link => {
              if (visitedNodes.indexOf(link) === -1) {
                visitedNodes.push(link)
                this.graph.nodes.push({
                  id: link
                })
              }
              let left = this.graph.nodes.find(x => x.id === node.url)
              let right = this.graph.nodes.find(x => x.id === link)
              this.graph.links.push({
                source: this.graph.nodes.indexOf(left),
                target: this.graph.nodes.indexOf(right)
              })
            })
          })
        })
        console.log(this.graph.nodes)
        console.log(this.graph.links)
        this.initializeGraph()
      })
    },
    initializeWebpages () {
      NodeDataService.getAll().then((data) => {
        data.data.forEach(x => {
          this.items.push(x.url)
        })
      })
    },
    initializeGraph () {
      this.simulation = d3.forceSimulation(this.graph.nodes)
        .force('charge', d3.forceManyBody().strength(d => -100))
        .force('link', d3.forceLink(this.graph.links))
        .force('x', d3.forceX())
        .force('y', d3.forceY())
      console.log(this.simulation)
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
    this.initialize()
    this.initializeWebpages()
  },
  mounted () {
    console.log('AA')
  },
  data: () => ({
    switch1: true,
    select: [],
    items: [],
    graph: {
      nodes: [],
      links: []
    },
    width: Math.max(document.documentElement.clientWidth - 150, window.innerWidth - 150 || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    padding: 20,
    colors: ['#2196F3', '#E91E63', '#7E57C2', '#009688', '#00BCD4', '#EF6C00', '#4CAF50', '#FF9800', '#F44336', '#CDDC39', '#9C27B0'],
  })
}
</script>

<style>
.mujContainer {
  font-size: 0.8em;
  font-style: normal;
  font-family: Arial, Helvetica, sans-serif;
}
          /* :label="`Switch 1: ${switch1.toString()}`" */

</style>
