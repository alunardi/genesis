export default {
  props: {
    tabs: {
      type: Array,
      default: () => ([])
    },
    tab: {
      type: String,
      default: () => ''
    },
    fields: {
      type: Array,
      default: () => ([])
    },
    data: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: () => (false)
    },
    watches: {
      type: Object,
      default: () => ({})
    },
    change: {
      type: Function
    }
  }
}
