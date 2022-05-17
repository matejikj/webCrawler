
<template>
  <v-container>
    <h1>Visualisation</h1>
    <svg id="svg" ref="svg" width="100%" height="60vh">
    <g>
      <template v-for="(c, index) in links">
        <tree-link class="movable" v-bind:key="index" v-bind:linkData="c"></tree-link>
      </template>
    </g>
    <g>
      <template v-for="(c, index) in circles">
        <circle
          v-bind:key="index"
          v-bind:content="`
            label: ${c.label}</br>
            id: ${c.index}
          `"
          v-tippy='{interactive : true, animateFill: false, placement:"right", animation:"shift-toward", delay:100, arrow : true}'
          class="circle"
          :id="c.id"
          :r="c.r"
          :cx="c.x"
          :cy="c.y"
          :fill="c.fill"
          :stroke="c.stroke"
          :stroke-width="c.strokewidth"
        >
        </circle>
        <tree-node class="movable" @nodeClicked="nodeClicked" v-bind:key="index" v-bind:nodeData="c"></tree-node>
      </template>
    </g>
  </svg>
  </v-container>
</template>

<script>
import router from '../router'
import NodeDataService from '../services/NodeDataService'
import Node from '../models/Node'
import * as d3 from 'd3'

export default {
  name: 'Query',
  components: {
  },
  sockets: {
  },
  methods: {
    clicked () {
      const a = this.links.split(',')
      this.links = a
      const data = {
        id: this.id,
        title: this.title,
        url: this.url,
        crawlTime: this.crawlTime,
        links: this.links,
        owner: this.owner
      }
      NodeDataService.create(data)
        .then(response => {
          this.id = response.data.id
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  mounted () {
    console.log('AA')
  },
  data: () => ({
    nodes: [],
    id: null,
    title: 'fdsa',
    url: 'aa.com',
    crawlTime: '22',
    links: 'aaa, hhh, jjj',
    owner: {}
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
