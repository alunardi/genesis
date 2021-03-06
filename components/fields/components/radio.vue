<template>
  <field :class="classNames" v-bind="{id, inline, problems, label, validate, title, tooltip, editable, visible}">
    <div slot="component">
      <div v-show="editable" class="q-radio-container" :class="{'has-error': problems.length}">
        <q-radio v-model="model" v-for="option in options" :disable="disabled"
                 :key="option.value" :val="option.value" :label="option.label" @input="updateValue(model)"/>
        <div class="pull-right field-clear-wrapper" v-if="!disabled">
          <q-button v-if="cleanable" v-bind="{small: true, round: true, color: 'negative', icon: 'clear'}"
                      class="field-clear" @click="clearValue"/>
        </div>
      </div>
      <div v-show="!editable" class="html" v-html="html"></div>
    </div>
  </field>
</template>

<script type="text/javascript">
  import { get } from 'lodash'
  import Field from 'genesis/components/fields/components/base.vue'
  import FieldAbstract from 'genesis/components/fields/abstract'

  export default {
    extends: FieldAbstract,
    components: {
      Field
    },
    name: 'field-radio',
    props: {
      options: {
        type: Array,
        default: () => ([])
      }
    },
    data: () => ({
      model: undefined
    }),
    computed: {
      html () {
        return get(this.options.find(option => String(option.value) === String(this.value)), 'label')
      }
    },
    methods: {
      /**
       * @param {*} value
       */
      applyValue (value) {
        if (value === undefined) {
          return
        }
        this.model = value
      },
      /**
       */
      clearValue () {
        this.model = this.cleaning
        this.updateValue(this.model)
      }
    },
    watch: {
      value (value) {
        this.applyValue(value)
      }
    },
    mounted () {
      this.applyValue(this.value)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .field-radio
    .q-radio-container
      position relative
      padding 7px 0 0 0
    .q-radio.q-option
      margin 0 10px 0 0
      .q-option-label
        margin-left 4px !important
        font-size 13px
        font-family Roboto
    .field-clear-wrapper
      position absolute
      top 0
      right 0
      opacity 0
      transition opacity .6s
    &:hover .field-clear-wrapper
      opacity 1
    .html
      height 38px
      color #515151
      padding 9px 8px
      font-family Roboto
      font-size 14.4px
</style>
