<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="webpages"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Webpages</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
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
                        v-model="label"
                        label="label"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="regexp"
                        label="regexp"
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
                      <v-checkbox
                        v-model="active"
                        label="active?"
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="tags"
                        label="tags"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
import WebpageDataService from '../services/WebpageDataService'
import Webpage from '../models/Webpage'

export default {
  name: 'Query',
  components: {
  },
  sockets: {
  },
  methods: {
    initialize () {
      WebpageDataService.getAll().then((data) => {
        this.webpages = data.data
      })
      // this.webpages = []
    },
    editItem (item) {
      this.editedIndex = this.webpages.indexOf(item)
      this.$data.id = item.id
      this.title = item.title
      this.url = item.url
      this.crawlTime = item.crawlTime
      this.links = item.links
      this.owner = item.owner
      this.dialog = true
    },
    deleteItem (item) {
      this.editedIndex = this.webpages.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.webpages.splice(this.editedIndex, 1)
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
        if (typeof this.tags === 'string') {
          this.tags = this.tags.split(',')
        }
        const data = {
          id: this.id,
          title: this.title,
          url: this.url,
          crawlTime: this.crawlTime,
          links: this.links,
          owner: this.owner
        }
        WebpageDataService.update(data.id, data)
          .then(response => {
            console.log(response.data)
          })
          .catch(e => {
            console.log(e)
          })
        Object.assign(this.webpages[this.editedIndex], data)
      } else {
        const a = this.tags.split(',')
        this.tags = a
        const data = {
          id: this.id,
          title: this.title,
          url: this.url,
          crawlTime: this.crawlTime,
          links: this.links,
          owner: this.owner
        }
        WebpageDataService.create(data)
          .then(response => {
            this.id = response.data.id
            console.log(response.data)
          })
          .catch(e => {
            console.log(e)
          })
        this.webpages.push(data)
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
    label: 'fdsa',
    url: 'aa.com',
    regexp: '22',
    tags: 'aaa, hhh, jjj',
    active: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'label', value: 'label' },
      { text: 'url', value: 'url' },
      { text: 'regexp', value: 'regexp' },
      { text: 'active', value: 'active' },
      { text: 'tags', value: 'tags' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    webpages: [],
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
