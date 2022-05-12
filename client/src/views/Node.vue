
<template>
  <v-container>

  </v-container>
</template>

<script>
import router from '../router'
import NodeDataService from '../services/NodeDataService'
import Node from '../models/Node'

export default {
  name: 'Query',
  components: {
  },
  sockets: {
  },
  computed: {
  },
  mounted () {
    console.log('AA')
    this.retrieveTutorials()
  },
  data: () => ({
    nodes: []
  }),
  methods: {
    click: function () {
      router.push('/')
    },
    retrieveTutorials () {
      NodeDataService.getAll()
        .then((response) => {
          this.nodes = response.data
          console.log(response.data)
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>

<style>
.mujContainer {
  font-size: 0.8em;
  font-style: normal;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
