/**
 * source支持 sessionStorage localStorage
 */
module.exports = class Storage {
  constructor (
    props = {
      source: window.sessionStorage
    }
  ) {
    this.props = props
  }
  get (key) {
    function isJSON (str) {
      if (typeof str === 'string') {
        try {
          JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      }
    }
    const data = this.source
    const timeout = data[`${key}__expires__`]
    // 过期失效
    if (new Date().getTime() >= timeout) {
      this.remove(key)
      return
    }
    return isJSON(data[key]) ? JSON.parse(data[key]) : data[key]
  }
  // 设置缓存
  // timeout：过期时间（分钟）
  set (key, value, timeout = 50) {
    let data = this.source
    data[key] = typeof value === 'object' ? JSON.stringify(value) : value
    if (timeout) {
      data[`${key}__expires__`] = new Date().getTime() + 1000 * 60 * timeout
    }
    return value
  }
  clear () {
    this.source.clear()
  }
  remove (key) {
    let data = this.source
    let value = data[key]
    delete data[key]
    delete data[`${key}__expires__`]
    return value
  }
}
