<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="executions"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Executions</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import router from '../router'
import ExecutionDataService from '../services/ExecutionDataService'

export default {
  name: 'Query',
  components: {
  },
  sockets: {
  },
  methods: {
    initialize () {
      ExecutionDataService.getAll().then((data) => {
        // console.log(data.data)
        // data.data.foreach( x => {
        //   console.log(x.label)
        // })
        this.executions = []
        data.data.forEach(x => {
          const label = x.label
          console.log(x)
          x.executions.forEach(y => {
            y.label = label
            this.executions.push(y)
          })
        })
        console.log(this.executions)
      })
      // this.executions = []
    },
    deleteItem (item) {
      this.editedIndex = this.executions.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      console.log(this.editedItem.id)
      ExecutionDataService.delete(this.editedItem.id)
      this.executions.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex > -1) {
        const tagSplit = this.tags.split(',')
        const data = {
          id: this.id,
          label: this.label,
          url: this.url,
          regexp: this.regexp,
          tags: tagSplit,
          periodicity: this.periodicity,
          active: this.active
        }
        console.log(data)
        ExecutionDataService.update(data.id, data)
          .then(response => {
            console.log(response.data)
          })
          .catch(e => {
            console.log(e)
          })
        Object.assign(this.executions[this.editedIndex], data)
      } else {
        const tagSplit = this.tags.split(',')
        const data = {
          label: this.label,
          url: this.url,
          regexp: this.regexp,
          tags: tagSplit,
          periodicity: this.periodicity,
          active: this.active
        }
        ExecutionDataService.create(data)
          .then(response => {
            this.executions.push(response.data)
            this.id = response.data.id
            console.log(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      }
      this.close()
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
    executions: [],
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
