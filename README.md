## General Store
The general store is a [mobx](https://github.com/mobxjs/mobx) store.  

When adding a new table add it to the data object in general.js and to the default object in models.js. Add fields and an array reference to child tables.  

| Method | general api call | Description |  
| --- | --- | --- |
get(model) | /api/general/${model}` | sets data[model].list
query(model, body, singleItem = false) | `/api/general/${model}`, "post", body | sets data[model].selectedItem or data[model].list
getItem(model, id) | `/api/general/${model}/${id}` | data[model].selectedItem
updateItemField(model, field, value) || data[model].selectedItem or data[model].childTableName[index].fieldName where fieldName looks like "childTableName.index.fieldName 
setSelectedItemFromList(model, itemID) || data[model].selectedItem
addListItem(model, listName, initial = {}) || data[model].selectedItem[listName].push
removeListItem(model, listName, item) || selectedItem.deletedChildren[listName].push(item.ID) / selectedItem[listName].remove
createSelectedItem(model, addToList = false) ||
clearList(model) ||
clearSelectedItem(model)
save(model, updateList = false) | callApi(`/api/general/${model}`, "put", body) | saves data[model].selectedItem
	

