
function onPurchasesPageLoad() { //open and read info from database when the page loads
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializePurchaseUI(); //set up the user interface

        });
    });
}

function initializeDb() {
    return new WinJS.Promise(function (completed, error, progress) {
        myDatabase.data.init(function () {
            completed();
        });
    });
}

function initializePurchaseUI() {
    var viewModel = new ViewModel();
    viewModel.init(); //get relevant information from the database and put it in lists

    //get elements from html page "purchases.html"
    document.getElementById("addForm").addEventListener("submit", viewModel.submitAdd, false); //execute submitAdd method when submit button for addForm is clicked
    document.getElementById("editForm").addEventListener("submit", viewModel.submitEdit, false); //execute submitEdit method when submit button for editForm is clicked
    document.getElementById("deleteCommand").addEventListener("click", viewModel.deleteToDo, false); //execute deleteToDo method when delete command is selected
    document.getElementById("editCommand").addEventListener("click", viewModel.editToDo, false); //execute editToDo method when edit command is selected.
    document.querySelector("#editForm .cancel").addEventListener("click", viewModel.cancelEdit, false); //execute cancelEdit methos when cancel button on edit form is clicked
}

function ViewModel() {
    
    var
        listView = document.getElementById("purchaseList").winControl, //assign list of purchases to listView
        otherPurchaseListView = document.getElementById("otherPurchaseList").winControl, //assign list of other purchases to otherPurchaseListView
        fertlizerListView = document.getElementById("fertilizerList").winControl, //assign list of fertilizers to fertlizerListView
        chemicalListView = document.getElementById("chemicalList").winControl, //assign list of chemicals to chemcialListView
        plantingMaterialListView = document.getElementById("plantingMaterialList").winControl, //assign list of planting materials to plantingMaterialLIstView
        soilAmendmentListView = document.getElementById("soilAmendmentList").winControl, //assign list of soil amendments to soilAmendmentsListView
        quantifierListView = document.getElementById("quantifierList").winControl, //assign list of quantifiers to quantifierListView

        appBar = document.getElementById("appBar").winControl, //control for the menu that comes up on the bottom
        editFlyout = document.getElementById("editFlyout").winControl, //control for the edit purchase form
        addForm = document.getElementById("addForm"),
        editForm = document.getElementById("editForm"),
        self = this,
        otherPurchaseDataList,
        fertilizerDataList,
        chemicalDataList,
        plantingMaterialDataList,
        soilAmendmentDataList,
        initialDataList, //purchase list ONLY without "Other" Purchase List
        quantifierDataList,
        dataList;

    this.init = function () {
        
        //get list of purchases from purchase object store in database
        myDatabase.purchaseList.getList(purchaseObjectStoreName, function (e) {
            
            dataList = new WinJS.Binding.List(e); //put list of purhases in dataList
            dataList.reverse(); //reverse the order of the list so that the most recently added would appear to be first

            listView.itemDataSource = dataList.dataSource; //put list of purchases in the list view in "purchases.html"
            listView.onselectionchanged = self.selectionChanged; //execute selectionChanged method when an item is selected

            WinJS.UI.setOptions(listView, {
                oniteminvoked: selectItemLeftClick
            });
        });

        //get list of "other" purchases from other purchase object store in the database i.e. purchases of type "Other"
        myDatabase.purchaseList.getList(otherPurchaseObjectStoreName, function (e) {
            otherPurchaseDataList = new WinJS.Binding.List(e); //assign list of "Other" purchasesin otherPurchaseDataList

            otherPurchaseListView.itemDataSource = otherPurchaseDataList.dataSource; //put the list of "other" purchases in the listview in "purchases.html"
           
            otherPurchaseListView.selection.selectAll(); //select all items in the list
            var selectionCount = otherPurchaseListView.selection.count(); //count the number of items selected
            
            //push to otherPurchaseArray
            if (selectionCount > 0) {
                otherPurchaseListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) { //for each item in the "other" purchase list
                        var name = item.data.name; //get name of item added
                        otherPurchaseArray.push(name); //put the name of all "other" items in otherPurchaseArray found in "globalStores.js"
                    });
                });
            }

        });

        //get list of all additional fertilizers (fertilizers added by the farmer) from otherFertlizerObjectStore stored in the database
        myDatabase.purchaseList.getList(otherFertilizerObjectStoreName, function (e) {
            fertilizerDataList = new WinJS.Binding.List(e);  //assign list of "other" fertlizers to fertlizerDataList

            fertlizerListView.itemDataSource = fertilizerDataList.dataSource; //put the list of other fertilizers in the fertilizer listview in "purchases.html"
           
            fertlizerListView.selection.selectAll(); //select all items in the list
            var selectionCount = fertlizerListView.selection.count(); //count the number of items selected

            //push to newFertlizerArray
            if (selectionCount > 0) {
                fertlizerListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) { //for each item in the "other" fertilizer list
                        var name = item.data.name; //get the name of the item added
                        newFertilizerArray.push(name); //put the name of all "other" fertlizers in newFertlierArray found in "globalStores.js"
                    });
                });
            }
        });

        //get list of all additional chemicals (chemicals added by the farmer) from otherChemicalObjectStore stored in the database
        myDatabase.purchaseList.getList(otherChemicalObjectStoreName, function (e) {
            chemicalDataList = new WinJS.Binding.List(e); //assign list of "other" chemicals to chemicalDataList

            chemicalListView.itemDataSource = chemicalDataList.dataSource; //put the list of other chemicals in the chamical listview in "purchases.html"
          
            chemicalListView.selection.selectAll(); //select all items in the list
            var selectionCount = chemicalListView.selection.count(); //count the selected items

            //push to newChemicalArray
            if (selectionCount > 0) {
                chemicalListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) { //for each item in the "other" chemical list
                        var name = item.data.name; //get the name of the item added
                        newChemicalArray.push(name); //put the name of all "other" chemicals in newChemical array found in "globalStores.js"
                    });
                });
            }


        });

        //get list of all additional planting materials (planting materials added by the farmer) from otherPlantingMaterialObjectStore stored in the database
        myDatabase.purchaseList.getList(otherPlantingMaterialObjectStoreName, function (e) {
            plantingMaterialDataList = new WinJS.Binding.List(e); //assign list of "other" planting material to plantingMaterialDataList

            plantingMaterialListView.itemDataSource = plantingMaterialDataList.dataSource; //put list of other planting materials in the planting material listview in "purchases.html"
           
            plantingMaterialListView.selection.selectAll(); //select all items in the list
            var selectionCount = plantingMaterialListView.selection.count(); //count the selected items

            //push to newCropArray
            if (selectionCount > 0) {
                plantingMaterialListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) { //for each item in the "other" planting material list
                        var name = item.data.name; //get name of item added
                        newCropArray.push(name); //put the name of all "other" planting materials in newCropArray found in "globalStores.js"
                    });
                });
            }
        });


        //get list of all additional soil amendments (soil amendments added by the farmer) from otherSoilAmendmetObjectStoes stored in the database
        myDatabase.purchaseList.getList(otherSoilAmendmentObjectStoreName, function (e) {
            soilAmendmentDataList = new WinJS.Binding.List(e); //assign list of "other" soil amendment to soilAmendmentDataList

            soilAmendmentListView.itemDataSource = soilAmendmentDataList.dataSource; //put list of "other" soil amendments in the soil amendments listview in "purchases.html"
           
            soilAmendmentListView.selection.selectAll(); //select all items in list
            var selectionCount = soilAmendmentListView.selection.count(); //count the selected items

            //push to newSoilAmendmentArray
            if (selectionCount > 0) {
                soilAmendmentListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) { //for each item in the list
                        var name = item.data.name; //get name of item added
                        newSoilAmendmentArray.push(name); //put the name of all "other" soil amendments in the newSoilAmendmentArray found in "globalStores.js"
                    });
                });
            }
        });

        //get a list of all "other" quantifiers (quantifiers added by the farmer) in otherQuantifierObjectStore in the database
        myDatabase.purchaseList.getList(otherQuantifierObjectStoreName, function (e) {
            quantifierDataList = new WinJS.Binding.List(e); //assign list of "other" quantifiers to quantifierDataList

            quantifierListView.itemDataSource = quantifierDataList.dataSource; //put list of "other" quantifiers in quantifier list view in "purchases.html"

            quantifierListView.selection.selectAll(); //select all items in the list
            var selectionCount = quantifierListView.selection.count(); //count the selected items

            if (selectionCount > 0) {
                quantifierListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) { //for each item in the list
                        var name = item.data.name; //get the name of the quantifier
                        totalQuantifierArray.push(name); //put the name of all "other" quantifiers in the totalQuantifierArray in "globalStores.js"
                    });
                });
            }
        });
    };



    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    //used for selecting items in a list
    this.selectionChanged = function (args) {
        var
            selectionCount = listView.selection.count(), //get number of items selected
            selectionCommands = document.querySelectorAll(".appBarSelection"), //commands if more than one item is selected
            singleSelectionCommands = document.querySelectorAll(".appBarSingleSelection"); //commands if only one item is selected

        if (selectionCount > 0) { //1 or more item selected
            appBar.showCommands(selectionCommands);

            if (selectionCount > 1) { //more than one item selected
                appBar.hideCommands(singleSelectionCommands);
            }

            appBar.sticky = true;
            appBar.show(); //show menu at the bottom
        }
        else {
            appBar.hideCommands(selectionCommands);

            appBar.sticky = false;
            appBar.hide(); //hide menu at the bottom
        }
    };

    var selectItemLeftClick = function (e) {
        e.detail.itemPromise.then(function (item) {
            listView.selection.set(item.index);
        });
    };

    //delete an item from an object store in the database
    this.deleteToDo = function () {
        var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");

        dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
            var selectionCount = listView.selection.count(); //count number of items selected
            if (selectionCount > 0) {
                listView.selection.getItems().then(function (items) {
                    items.forEach(function (item) { //for each item that is selected
                        var
                            dbKey = item.data.id, //get the id of the item which was autogenerated
                            lvKey = item.key; //get the key for the item

                        myDatabase.purchaseList.remove(dbKey, purchaseObjectStoreName, function () {
                            listView.itemDataSource.remove(lvKey); //remove item from the object store using the keys
                        });
                    });
                });
            }
        }));

        dialog.commands.append(new Windows.UI.Popups.UICommand("Cancel", null));

        dialog.defaultCommandIndex = 1;
        dialog.cancelCommandIndex = 1;

        dialog.showAsync();
    };


    //edit an item in purchaseObjectStore in the database
    this.editToDo = function () {
        var
            anchor = document.querySelector(".toDo"), //position to place the editForm on the screen
            selectionCount = listView.selection.count(); //count the number of items selected

        if (selectionCount === 1) { //only one item would be selected for this option to be available

            //get element to edit
            listView.selection.getItems().then(function (items) {
                var
                    item = items[0], //item selected would be the first item since only one item can be returned
                    editFlyoutElement = document.getElementById("editFlyout");

                //get values in edit form
                var toDo = {
                    id: item.data.id,
                    type: item.data.type,
                    name: item.data.name,
                    quantifier: item.data.quantifier,
                    quantity: item.data.quantity,
                    amountRemaining: item.data.amountRemaining,
                    cost: item.data.cost,
                    lvIndex: item.index
                };

                //put the previous type, name and quantifier as part of the label because it cannot be done in the actual edit form because the form is dynamic
                document.getElementById('labelType').innerText = "Type : " + "(Previous: "+toDo.type+")";
                document.getElementById('labelName').innerText = "Name : " + "(Previous: "+toDo.name+")";
                document.getElementById('labelQuantifier').innerText = "Quantifier : " +"(Previous: " +toDo.quantifier+")";

                var process = WinJS.Binding.processAll(editFlyoutElement, toDo);

                process.then(function () {
                    editFlyout.show(anchor, "top", "center"); //where to position the editForm
                });
            });
        }
    };

    //add an element to the purchaseObjectStore in the database
    this.submitAdd = function (e) {
        e.preventDefault();

        //get values from addForm in "purchases.html"
        var toDo = {
            type: document.querySelector("#addForm .type").value,
            name: document.querySelector("#addForm .name").value,
            quantifier: document.querySelector("#addForm .quantifier").value,
            quantity: document.querySelector("#addForm .quantity").value,
            cost: document.querySelector("#addForm .cost").value,
            amountRemaining: document.querySelector("#addForm .quantity").value, //it would originally be the quantity purchased but will decrease as this item is used
        };

        myDatabase.purchaseList.add(toDo, purchaseObjectStoreName, function (e) {
            dataList.push(e);//add to object store in the database

            addForm.reset(); //reset form
            window.location = "purchases.html"; //refresh page

        });
    };

    this.submitEdit = function (e) {
        e.preventDefault();

        var toDo = {
            id: document.querySelector("#editForm .id").value,
            type: document.querySelector("#editForm .type").value,
            name: document.querySelector("#editForm .name").value,
            quantifier: document.querySelector("#editForm .quantifier").value,
            quantity: document.querySelector("#editForm .quantity").value,
            amountRemaining: document.querySelector("#editForm .quantity").value, //would be initially set to whatever quantity the farmer changes it to
            cost: document.querySelector("#editForm .cost").value,
            lvIndex: document.querySelector("#editForm .lvIndex").value
        };

        myDatabase.purchaseList.update(toDo, purchaseObjectStoreName, function (e) {
            editFlyout.hide();
            appBar.hide();
            editForm.reset();
            listView.selection.clear();

            dataList.setAt(toDo.lvIndex, toDo);
        });
    };

    this.cancelEdit = function (e) {
        e.preventDefault();

        editFlyout.hide();
        appBar.hide();
        editForm.reset();
        listView.selection.clear();
    };
}
