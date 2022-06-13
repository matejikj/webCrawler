
<template>
  <v-container>
    <h1>Visualisation</h1>
    <svg xmlns="http://www.w3.org/2000/svg"
       :width="width+'px'"
       :height="height+'px'"
       @mousemove="drag($event)"
       @mouseup="drop()"
       v-if="bounds.minX">
      <line v-for="(link, i) in graph.links"
            v-bind:key='(i+1) * 1000 + 1'
            :x1="coords[link.source.index].x"
            :y1="coords[link.source.index].y"
            :x2="coords[link.target.index].x"
            :y2="coords[link.target.index].y"
            stroke="black" stroke-width="2"/>

      <circle v-for="(node, i) in graph.nodes"
            v-bind:key='(i+1) * 100 + 1'
              :cx="coords[i].x"
              :cy="coords[i].y"
              :r="20" :fill="colors[Math.ceil(Math.sqrt(node.index))]"
              stroke="white" stroke-width="1"
              @mousedown="currentMove = {x: $event.screenX, y: $event.screenY, node: node}"/>

      <text v-for="(node, i) in graph.nodes"
            v-bind:key='(i+1) * 10 + 1'
              :x="coords[i].x"
              :y="coords[i].y"
              >
        {{ node.label }}
      </text>

    </svg>
  </v-container>
</template>

<script>
import router from '../router'
import NodeDataService from '../services/NodeDataService'
import * as d3 from 'd3'

export default {
  name: 'Query',
  components: {
  },
  sockets: {
  },
  methods: {
    drag (e) {
      if (this.currentMove) {
        this.currentMove.node.fx = this.currentMove.node.x - (this.currentMove.x - e.screenX) * (this.bounds.maxX - this.bounds.minX) / (this.width - 2 * this.padding)
        this.currentMove.node.fy = this.currentMove.node.y - (this.currentMove.y - e.screenY) * (this.bounds.maxY - this.bounds.minY) / (this.height - 2 * this.padding)
        this.currentMove.x = e.screenX
        this.currentMove.y = e.screenY
      }
    },
    drop () {
      delete this.currentMove.node.fx
      delete this.currentMove.node.fy
      this.currentMove = null
      this.simulation.alpha(1)
      this.simulation.restart()
    },
    initialize () {
      NodeDataService.getAll().then((data) => {
        // console.log(data.data)
        // data.data.foreach( x => {
        //   console.log(x.label)
        // })
        this.graph.nodes = []
        this.graph.links = []
        console.log(data.data)
        data.data.forEach(webpage => {
          const label = webpage.label
          webpage.nodes.forEach(node => {
            const newNode = {
              id: node.url,
              label: 'aa'
            }
            if (this.graph.nodes.indexOf(newNode) === -1) {
              this.graph.nodes.push(newNode)
            }
            node.links.forEach(link => {
              const newNodeLink = {
                id: link,
                label: 'aa'
              }
              if (this.graph.nodes.indexOf(newNodeLink) === -1) {
                this.graph.nodes.push(newNodeLink)
              }
              const newLink = {
                source: this.graph.nodes.indexOf(newNode),
                target: this.graph.nodes.indexOf(newNodeLink)
              }
              if (this.graph.links.indexOf(newLink) === -1) {
                this.graph.links.push(newLink)
              }
            })
          })
        })
        console.log(this.graph.nodes)
        console.log(this.graph.links)
        this.initializeGraph()
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
          x: this.padding + (node.x - this.bounds.minX) * (this.width - 2 * this.padding) / (this.bounds.maxX - this.bounds.minX),
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
  },
  mounted () {
    console.log('AA')
  },
  data: () => ({
    id: null,
    label: 'test',
    url: 'https://jmatejik.eu',
    regexp: "a[href^='/']",
    tags: 'test, smycka',
    active: false,
    periodicity: 'hour',
    periodicityItems: ['minute', 'hour', 'day'],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'label', value: 'label' },
      { text: 'status', value: 'status' },
      { text: 'start', value: 'start' },
      { text: 'end', value: 'end' },
      { text: 'sitesCrawled', value: 'sitesCrawled' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    graph: {
      nodes: [],
      links: []
    },
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 80,
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 40,
    padding: 20,
    colors: ['#2196F3', '#E91E63', '#7E57C2', '#009688', '#00BCD4', '#EF6C00', '#4CAF50', '#FF9800', '#F44336', '#CDDC39', '#9C27B0'],
    simulation: null,
    currentMove: null,
    editedIndex: -1
  })
}
</script>

<style>
.mujContainer {
  font-size: 0.8em;
  font-style: normal;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
