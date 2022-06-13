
<template>
  <v-container>
    <h1>Visualisation</h1>
    <svg id="svg" ref="svg" width="100%" height="60vh">
    </svg>
  </v-container>
</template>

<script>
import router from '../router'
import NodeDataService from '../services/NodeDataService'

export default {
  name: 'Query',
  components: {
  },
  sockets: {
  },
  methods: {
    initialize () {
      NodeDataService.getAll().then((data) => {
        // console.log(data.data)
        // data.data.foreach( x => {
        //   console.log(x.label)
        // })
        this.nodes = []
        this.links = []
        console.log(data.data)
        data.data.forEach(webpage => {
          const label = webpage.label
          webpage.nodes.forEach(node => {
            const newNode = {
              id: node.url
            }
            node.links.forEach(link => {
              const newLink = {
                source: node.url,
                target: link
              }
              this.links.push(newLink)
            })
            this.nodes.push(newNode)
          })
        })
        console.log(this.nodes)
        console.log(this.links)
      })
      // this.nodes = []
    },
    initializeGraph () {
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
    nodes: [],
    links: [],
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
