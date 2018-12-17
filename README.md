## General Store
General Store (GS) implements a [mobx](https://github.com/mobxjs/mobx) store that intgrates with [General EndPoint](https://github.com/andrewt3000/generalEndPoint).  
GS contains an observable property named data, and several actions which are documented below. GS is injected into data-aware General Components.

When adding a new table to the database:
1) Add the table to the data object in general.js 
2) Add the table to the default object in models.js. 
\*Add an array reference to child tables from the parent.  

| Method | General EndPoint call | Description | Data changed
| --- | --- | --- | -- |
get(model) | /api/general/${model}` | gets all records for a table | data[model] properties: list, errorMessage and busy.
getItem(model, id) | `/api/general/${model}/${id}` | gets record by ID | data[model].selectedItem
query(model, body, singleItem = false) | `/api/general/${model}`, "post", body | gets data based on [jql](https://github.com/andrewt3000/generalEndPoint#jql) query |  sets data[model].selectedItem or data[model].list
save(model, updateList = false) | callApi(`/api/general/${model}`, "put", body) | saves data[model].selectedItem

| Method |  Data changed |  
| --- | --- |
updateItemField(model, field, value) | data[model].selectedItem or data[model].childTableName[index].fieldName where fieldName looks like "childTableName.index.fieldName 
setSelectedItemFromList(model, itemID) | data[model].selectedItem
addListItem(model, listName, initial = {}) | data[model].selectedItem[listName].push
removeListItem(model, listName, item) | selectedItem.deletedChildren[listName].push(item.ID) / selectedItem[listName].remove
createSelectedItem(model, addToList = false) | selectedItem is set to blank template and optionally added to list.
clearList(model) | list = []
clearSelectedItem(model) | selectedItem = {}
	

