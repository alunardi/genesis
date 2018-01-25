import { Crud } from 'genesis'

/**
 * @param {string} path
 * @param {string} name
 * @param {string} component
 * @param {Function|Object|boolean} props
 * @param {Object} meta
 * @param {Array} children
 * @returns {Object}
 */
export const route = (path, name, component, props = null, meta = {}, children = []) => {
  return {path, name, component, props, meta, children}
}

/**
 *
 * namespace: 'app.user', // ACL
 * permission: [1 to 4], // ACL
 * icon: 'add', // breadcrumb
 * label: 'Criar', // breadcrumb
 * title: 'Criar / ' + label, // window title
 * tooltip: 'Cria um novo registro no(a) ' + title // sub header on layout
 *
 * @param {string} path
 * @param {string} namespace
 * @param {Function} props
 * @param {string} uri
 * @param {string} scope
 * @param {string} component
 * @param {Object} meta
 * @param {string} name
 * @returns {Object}
 */
export const child = (path, namespace, props, uri, scope, component, meta = {}, name = '') => {
  return route(uri, name || (namespace + '.' + scope), component, (route) => props(scope, route), meta)
}

/**
 * @param {string} path
 * @param {string} namespace
 * @param {Function} grid
 * @param {Function} form
 * @param {Object} meta
 * @param {string} id
 * @returns {Array}
 */
export const crud = (path, namespace, grid, form, meta, id = 'id') => {
  const resources = factory(path, namespace, grid, form, meta)
  const configure = Crud.get('configure')
  return [
    route(path, '', configure('Index'), {title: meta.label}, meta, [
      child(path, namespace, grid, '', 'index', configure('Grid'), resources.$read()),
      child(path, namespace, form, 'create', 'create', configure('Form'), resources.$create()),
      child(path, namespace, form, ':' + id, 'view', configure('Form'), resources.$view()),
      child(path, namespace, form, ':' + id + '/edit', 'edit', configure('Form'), resources.$edit())
    ])
  ]
}

/**
 * @param {string} path
 * @param {string} namespace
 * @param {Function} grid
 * @param {Function} form
 * @param {Object} meta
 * @returns {*}
 */
export const factory = (path, namespace, grid, form, meta) => {
  return {
    /**
     * @param {int} permission
     * @param {string} icon
     * @param {string} label
     * @param {string} title
     * @param {string} tooltip
     * @returns {Object}
     */
    $meta (permission, icon, label, title, tooltip) {
      return {namespace, permission, icon, label, title, tooltip}
    },
    /**
     * @param {Object} options
     * @returns {Object}
     */
    $read (options = {}) {
      return Object.assign({}, meta, {namespace: namespace, permission: 1, noBreadcrumb: true}, options)
    },
    /**
     * @param {Object} options
     * @returns {Object}
     */
    $create (options = {}) {
      const create = this.$meta(
        2, 'add', 'Criar', `${meta.label} / Criar`, 'Cria um novo registro no(a) ' + meta.title
      )
      return Object.assign({}, create, options)
    },
    /**
     * @param {Object} options
     * @returns {Object}
     */
    $view (options = {}) {
      const view = this.$meta(
        1, 'search', 'Visualizar', `${meta.label} / Visualizar`, 'Visualiza um registro do(a) ' + meta.title
      )
      return Object.assign({}, view, options)
    },
    /**
     * @param {Object} options
     * @returns {Object}
     */
    $edit (options = {}) {
      // permission, icon, label, title, tooltip
      const edit = this.$meta(
        3, 'edit', 'Editar', `${meta.label} / Editar`, 'Edita um novo registro do(a) ' + meta.title
      )
      return Object.assign({}, edit, options)
    }
  }
}
