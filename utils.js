import moment from "moment"

export const paritial = (fn, ...args) => fn.bind(null, ...args)

const _pipe = (f, g) => (...args) => g(f(...args))

export const pipe = (...fns) => fns.reduce(_pipe)

export const updateListById = (array, updatedItem, id = "ID") => {
  return array.map(item => {
    if (item[id] !== updatedItem[id]) {
      return item
    }
    return {
      ...item,
      ...updatedItem
    }
  })
}

export const transformList = (list, value, text) =>
  list.map(item => ({ value: item[value], text: item[text] }))

export const transformListFromString = text => {
  const list = text.split(",")
  return list.map((item, index) => ({ key: index, value: item, text: item }))
}

export const createReducer = (initialState, handlers) => {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

export const fixDate = dateIn => {
  if (dateIn) {
    const date = new Date(dateIn)
    return moment(
      new Date(date.getTime() - date.getTimezoneOffset() * -60000)
    ).format("MM/DD/YYYY")
  }
  return "-"
}

export const fixDateTime = dateIn => {
  if (dateIn) {
    const date = new Date(dateIn)
    return moment(new Date(date.getTime())).format("MM/DD/YYYY h:mm:ss a ")
  }
  return "-"
}
