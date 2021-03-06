<template>
  <field :class="classNames" v-bind="{id, inline, problems, label, validate, title, tooltip, editable, visible}">
    <div slot="component">
      <div v-show="editable" :class="{'component': true, 'has-error': problems.length}">
        <template v-if="!embed">
          <i class="material-icons" @click="openWidget">access_time</i>
          <q-datetime ref="widget" v-model="widget" type="time" ok-label="Ok" cancel-label="Cancelar" v-bind="bind"
                      clear-label="Limpar"></q-datetime>
          <input ref="input" class="input full-width" autocomplete="off"
                 v-mask="pattern"
                 v-model="model" v-bind="{id, name, placeholder, maxlength, disabled}"
                 @keypress="keypress" @keyup="keyup" @blur="blur" @focus="focus" @keydown.enter.stop.prevent="enter"
                 @input="updateValue($event.target.value)"/>
          <div class="input-bar"></div>
        </template>

        <template v-else>
          <div class="row justify-center">
            <q-inline-datetime v-model="widget" type="time" v-bind="bind"/>
          </div>
        </template>

      </div>
      <div v-show="!editable" class="html" v-html="html"></div>
    </div>
  </field>
</template>

<script type="text/javascript">
  import { VueMaskDirective } from 'v-mask'
  import Field from 'genesis/components/fields/components/base.vue'
  import FieldAbstract from 'genesis/components/fields/abstract'
  import { formatTime } from 'genesis/support/format'
  import { mask, padLeft, padRight, unMask } from 'genesis/support/utils'

  export default {
    name: 'field-time',
    components: {
      Field
    },
    props: {
      embed: {
        type: Boolean,
        default: false
      },
      format24h: {
        type: Boolean,
        default: () => true
      },
      min: {
        type: [String, Number]
      },
      max: {
        type: [String, Number]
      }
    },
    computed: {
      html () {
        return this.model
      },
      bind () {
        const {format24h} = this

        let min, max

        min = formatTime(mask(this.pattern, String(this.min)), null, 'HH:mm')
        max = formatTime(mask(this.pattern, String(this.max)), null, 'HH:mm')

        return {min, max, format24h}
      }
    },
    data: () => ({
      widget: '',
      updated: false,
      pattern: '##:##',
      model: '',
      maxlength: 5,
      programmatically: true
    }),
    directives: {
      'mask': VueMaskDirective
    },
    extends: FieldAbstract,
    methods: {
      /**
       */
      openWidget () {
        this.$refs.widget.open()
      },
      /**
       * @param {string} value
       */
      updateValue (value) {
        this.updated = true
        const emited = Number(unMask(this.pattern, value))
        const val = this.value

        if ((emited !== val)) {
          this.$emit('input', emited, this)
        }
      },
      /**
       * @param {int} value
       */
      watchValue (value) {
        if (!this.updated) {
          this.padLeft(value)
        }
        this.updated = true
      },
      /**
       * @param {string} value
       */
      applyValue (value) {
        this.updated = true
        this.model = mask(this.pattern, unMask(this.pattern, value))
      },
      /**
       * @param {string} value
       */
      padLeft (value) {
        this.model = mask(this.pattern, padLeft(unMask(this.pattern, value), 4))
      },
      /**
       * @param {string} value
       */
      padRight (value) {
        this.model = mask(this.pattern, padRight(unMask(this.pattern, value), 4))
      },
      /**
       * @param {string} $event
       */
      blur ($event) {
        this.padRight($event.target.value)
        this.updateValue($event.target.value)
      }
    },
    mounted () {
      if (typeof this.value !== 'undefined') {
        this.updated = false
        this.watchValue(this.value)
      }
    },
    watch: {
      value (value) {
        if (typeof value === 'undefined') {
          return
        }
        this.updated = false
        this.watchValue(value)
      },
      model (value) {
        this.widget = formatTime(value, null, 'HH:mm')
      },
      widget (value) {
        if (!value) {
          return
        }
        value = formatTime(value)
        this.applyValue(value)
        this.updateValue(value)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~variables'

  .field-time
    .component
      position relative
      & > input
        height 37px
      & > .material-icons
        background $field-button-background
        color $field-button-color
        position absolute
        cursor pointer
        right 0
        top 0
        padding 8px 4px 9px 5px
        font-size 20px
        z-index 10
        border-radius 2px
      & > .q-datetime-input
        position absolute
        top 0
        right 0
        width 28px
        height 28px
        padding 0
        margin 0
        overflow hidden
        border none
        min-width inherit
        min-height inherit
        box-shadow none
    .html
      height 35px
      color #515151
      padding 8px
      font-family Roboto
      font-size 14.4px
</style>
