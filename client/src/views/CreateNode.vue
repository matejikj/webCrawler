
<template>
  <v-container>
    <h1>Create new node</h1>
    <v-row>
        <v-col>
          <v-text-field
            v-model="id"
            label="Id"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="title"
            label="Title"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="crawlTime"
            label="crawlTime"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="url"
            label="url"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="links"
            label="Links"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-btn v-on:click="clicked()">
          Odeslat
        </v-btn>
      </v-row>
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
