<template>
  <field :class="classNames" v-bind="{id, inline, problems, label, validate, title, tooltip, editable, visible}">
    <div slot="component">
      <div v-show="editable" class="q-select-container" :class="{'has-error': problems.length}">

        <input v-if="model === undefined && placeholder" :placeholder="placeholder" class="field-placeholder" readonly/>

        <q-select ref="input" class="input full-width cursor-pointer" :class="{'disabled': disable}"
                  v-model="model"
                  v-bind="{name, disable, options, multiple, radio, toggle, filter, separator, chips}"
                  @change="$emit('input', model)"/>
        <div class="pull-right field-clear-wrapper" v-if="!disabled">
          <q-button v-if="cleanable" v-bind="{small: true, round: true, color: 'negative', icon: 'clear'}"
                    class="field-clear" @click="clearValue"/>
        </div>
      </div>

      <div v-show="!editable" class="html ellipsis" v-html="html"></div>
    </div>
  </field>
</template>

<script type="text/javascript">
  import Field from 'genesis/components/fields/components/base.vue'
  import FieldAbstract from 'genesis/components/fields/abstract'

  export default {
    extends: FieldAbstract,
    components: {
      Field
    },
    name: 'field-select',
    props: {
      type: {
        type: String,
        default: 'radio'
      },
      options: {
        type: Array,
        default: () => ([])
      },
      multiple: {
        type: Boolean,
        default: () => false
      },
      radio: {
        type: Boolean,
        default: () => false
      },
      toggle: {
        type: Boolean,
        default: () => false
      },
      chips: {
        type: Boolean,
        default: () => false
      },
      filter: {
        type: Boolean,
        default: () => false
      },
      separator: {
        type: Boolean,
        default: () => false
      },
      source: {
        type: Function
      },
      empty: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      model: undefined
    }),
    computed: {
      disable () {
        return this.disabled
      },
      html () {
        if (typeof this.model === 'undefined') {
          return ''
        }
        if (!this.options.length) {
          return ''
        }
        let model = this.model
        if (this.type === 'radio') {
          model = [this.model]
        }
        const selected = this.options.filter(option => model.includes(option.value))
        if (!selected.length) {
          return ''
        }
        return selected.map(item => item.label).join(', ')
      }
    },
    methods: {
      /**
       * @param {*} value
       */
      applyValue (value) {
        this.$emit('event', 'selected', this, this.getObjects(this.model))

        if (!this.multiple) {
          this.model = value
          return
        }
        if (Array.isArray(value)) {
          this.model = value
        }
      },
      /**
       */
      clearValue () {
        this.model = this.cleaning
        this.updateValue(this.model)
      },
      /**
       * @param value
       * @returns {{}}
       */
      getObjects (value) {
        let objects = []

        if (!Array.isArray(this.options)) {
          return {}
        }

        if (Array.isArray(value)) {
          this.options.forEach((_object) => {
            if (value.includes(_object.value)) {
              objects.push(_object)
            }
          })

          return objects
        }

        this.options.forEach((_object) => {
          if (value === _object.value) {
            objects.push(_object)
          }
        })

        return objects.shift()
      }
    },
    watch: {
      value (value) {
        this.applyValue(value)
      }
    },
    created () {
      if (this.multiple) {
        this.model = []
      }
      if (this.source) {
        this.source(options => options.forEach(option => this.options.push(option)))
      }
    },
    mounted () {
      this.applyValue(this.value)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~variables'

  .field-select
    .input
      height auto
      min-height 37px
    .field-placeholder
      font-family Roboto
      font-size 13px
      border none
      background transparent
      position absolute
      z-index 10
      top 10px
      left 8px
      width 90%
    .q-select-container
      position relative
    .q-if-control
      position absolute
      right 0
      top -1px
      background $field-button-background
      color $field-button-color
      min-height 37px
      height 100%
      width 30px
    .q-if-disabled:before
      background none
    .q-select.q-if
      padding 6px 8px
    .has-error .q-picker-textfield
      background rgba(249, 125, 125, 0.2)
    .field-clear-wrapper
      position absolute
      right 35px
      top 4px
      opacity 0
      transition opacity .6s
    &:hover .field-clear-wrapper
      opacity 1
    .html
      height 36px
      color #515151
      padding 9px 8px
      font-family Roboto
      font-size 14.4px
</style>
