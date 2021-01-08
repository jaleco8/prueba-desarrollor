<template>
  <div class="q-pa-md">
    <div class="q-pa-md">
      <div class="row">
        <div class="col">
          <q-select rounded outlined v-model="model" :options="options" dark @input="val => { getFotos(model) }" label="Seleccione un destino" />
        </div>
      </div>
    </div>
    <div class="q-pa-md row items-center justify-center" v-if="loading">
      <q-circular-progress
        indeterminate
        size="50px"
        :thickness="0.22"
        color="light-blue"
        track-color="grey-3"
        class="q-ma-md"
      />
    </div>

    <div class="q-pa-md row items-start" v-show="model">
      <template v-for="excursion in arrExcursiones">
        <div class="col-3 no-padding">
          <q-img
            spinner-size="2rem"
            :src="excursion.image"
            transition="scale"
            class="excursion-image"
          >
            <div class="absolute-full text-subtitle2 flex flex-center excursion-title">
              {{ excursion.title }}
            </div>
          </q-img>  
        </div>
      </template>
    </div>
    <div class="q-pa-md row items-center justify-center text-white" v-if="model && arrExcursiones.length <= 0">
      <div
        class="absolute column items-center"
        :style="{
          opacity: 0.70,
          top: 40 + '%',
          left: 0,
          right: 0
        }"
      >
        <img src="../assets/sin-resultado.png" style="width: 250px; height: auto">
        <div class="text-h3 text-white text-center">Sin excursiones...</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      model: null,
      options: [],
      arrDestination: [],
      arrExcursiones: [],
      loading: false,
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.$axios.get('ports.json')
        .then((response) => {
          let arrTmp = new Set()
          for (const key of response.data) {
            this.arrDestination.push({
                name: key.destination,
                code: key.code
            })
            arrTmp.add(key.destination)
          }
          this.options = Array.from(arrTmp)
          this.$nextTick(() => {
            this.options = this.options.sort()
          })
        })
        .catch(() => {
          console.log('error')
        })
    },
    getFotos (destino) {
      this.loading = true
      var getCode = this.arrDestination.find(arrDestination => arrDestination.name === destino);
      console.log(getCode);
      this.arrExcursiones = [];
      this.$axios.get('shorex.json')
        .then((response) => {
          for (const key of response.data) {
            if(key.code.substring(0,3) === getCode.code) {
              this.arrExcursiones.push({
                  title: key.title,
                  image: key.imagePath
              })
            }
          }
          this.loading = false
          console.log(this.arrExcursiones);
        })
        .catch((e) => {
          console.log('error: ', e)
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.row > div
  padding: 10px 15px

.row + .row
  margin-top: 1rem
.my-card
  width: 100%
  max-width: 250px

.excursion-image .excursion-title
  visibility: hidden
  opacity: 0
  transition: .3s

.excursion-image:hover .excursion-title
  visibility: visible
  opacity: 1
  transition: .3s
</style>
