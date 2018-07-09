import { observable, computed, action, runInAction, toJS } from "mobx"
import models from "./models"
import { callApi } from "./api"
import { updateListById } from "./utils"

const defaultState = {
  list: [],
  selectedItem: {},
  isDirty: false,
  busy: false,
  errorMessage: "",
  saving: false
}

class General {
  @observable
  data = {
    todo: { ...defaultState }
  }


  @action
  async get(model) {
    this.data[model].errorMessage = ""
    this.data[model].busy = true
    try {
      const list = await callApi(`/api/general/${model}`)
      runInAction(() => {
        this.data[model].list = list
        this.data[model].busy = false
      })
    } catch (err) {
      console.error(err)
      runInAction(() => {
        this.data[model].errorMessage = err.message
        this.data[model].busy = false
      })
    }
  }

  @action
  async query(model, body, singleItem = false, endPointOverride = "") {
    return new Promise(async (resolve, reject) => {
      this.data[model].error = ""
      this.data[model].busy = true
      let url = `/api/general/${model}`
      let httpType = "post"
      if(endPointOverride.length > 0){
        url = endPointOverride
        httpType = "get"
        body = undefined
      }
      try {
        const data = await callApi(url, httpType, body)
        runInAction(() => {
          if (singleItem) {
            this.data[model].selectedItem = data[0]
          } else {
            this.data[model].list = data
          }
          this.data[model].busy = false
          resolve()
        })
      } catch (err) {
        console.error(err)
        runInAction(() => {
          this.data[model].error = err.message
          this.data[model].busy = false
          reject(err)
        })
      }
    })
  }

  @action
  async getItem(model, id) {
    this.data[model].errorMessage = ""
    this.data[model].busy = true
    try {
      const item = await callApi(`/api/general/${model}/${id}`)
      runInAction(() => {
        this.data[model].selectedItem = item
        this.data[model].busy = false
      })
    } catch (err) {
      console.error(err)
      runInAction(() => {
        this.data[model].errorMessage = err.message
        this.data[model].busy = false
      })
    }
  }

  @action
  updateItemField(model, field, value) {
    return new Promise((resolve, reject) => {
      if (field.includes(".")) {
        const keys = field.split(".")
        if (keys.length === 3) {
          this.data[model].selectedItem[keys[0]][keys[1]][keys[2]] = value
          this.data[model].selectedItem[keys[0]][keys[1]].isDirty = true
        } else {
          throw new Error("nesting can only be one level deep")
        }
      } else {
        this.data[model].selectedItem[field] = value
      }
      this.data[model].isDirty = true
      resolve()
    })
  }

  @action
  setSelectedItemFromList(model, itemID) {
    const item = this.data[model].list.find(item => item.ID === itemID)
    this.data[model].selectedItem = { ...item }
  }

  @action
  addListItem(model, listName, initial = {}) {
    let defaults = { ...models[listName], isDirty: true }
    defaults[`${model}ID`] = this.data[model].selectedItem.ID
    defaults = { ...defaults, ...initial }
    this.data[model].selectedItem[listName].push(defaults)
    this.data[model].isDirty = true
  }

  @action
  removeListItem(model, listName, item) {
    const selectedItem = this.data[model].selectedItem
    if (item.ID) {
      if (!selectedItem.deletedChildren) {
        selectedItem.deletedChildren = {}
      }
      if (!selectedItem.deletedChildren[listName]) {
        selectedItem.deletedChildren[listName] = []
      }
      selectedItem.deletedChildren[listName].push(item.ID)
    }
    selectedItem[listName].remove(item)
    this.data[model].isDirty = true
  }

  @action
  createSelectedItem(model, addToList = false) {
    return new Promise((resolve, reject) => {
      this.data[model].selectedItem = { ...models[model] }
      if (addToList) {
        this.data[model].list.push({ ...models[model] })
      }
      resolve()
    })
  }

  @action
  clearList(model) {
    this.data[model].list = []
  }

  @action
  clearSelectedItem(model) {
    this.data[model].selectedItem = {}
    this.data[model].isDirty = false
  }

  @action
  async save(model, updateList = false) {
    return new Promise(async (resolve, reject) => {
      this.data[model].errorMessage = ""
      this.data[model].saving = true
      try {
        const body = toJS(this.data[model].selectedItem)
        if (body.ID === "new") {
          delete body.ID
        }
        // only send child records that have been touched
        for (const key in body) {
          if (Array.isArray(body[key])) {
            body[key] = body[key].filter(item => item.isDirty)
          }
        }
        const item = await callApi(`/api/general/${model}`, "put", body)
        runInAction(() => {
          this.data[model].selectedItem = { ...item }
          if (updateList) {
            const index = this.data[model].list.findIndex(
              item => item.ID === "new"
            )
            if (index > -1) {
              this.data[model].list[index] = { ...item }
            } else {
              this.data[model].list = updateListById(
                this.data[model].list,
                item
              )
            }
          }
          this.data[model].saving = false
          this.data[model].isDirty = false
          resolve()
        })
      } catch (err) {
        console.error(err)
        runInAction(() => {
          this.data[model].errorMessage = err.message
          this.data[model].saving = false
          reject(err)
        })
      }
    })
  }
}

export default new General()
