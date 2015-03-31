
function onResourcesPageLoad() { //open and read info from database when the page loads
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializeResourcesUI(); //set up the user interface

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

function initializeResourcesUI() {
    var viewModel = new ViewModel();
    viewModel.init(); //get relevant information from the database and put it in lists

    
   // document.getElementById("addForm").addEventListener("submit", viewModel.submitAdd, false); //execute submitAdd method when submit button for addForm is clicked
   // document.getElementById("editForm").addEventListener("submit", viewModel.submitEdit, false); //execute submitEdit method when submit button for editForm is clicked
    document.getElementById("deleteCommand").addEventListener("click", viewModel.deleteToDo, false); //execute deleteToDo method when delete command is selected
  //  document.getElementById("editCommand").addEventListener("click", viewModel.editToDo, false); //execute editToDo method when edit command is selected.
  //  document.querySelector("#editForm .cancel").addEventListener("click", viewModel.cancelEdit, false); //execute cancelEdit methos when cancel button on edit form is clicked
}

function ViewModel() {

    var
        fertlizerListView = document.getElementById("fertilizerList").winControl, //assign list of fertilizers to fertlizerListView
        chemicalListView = document.getElementById("chemicalList").winControl, //assign list of chemicals to chemcialListView
        plantingMaterialListView = document.getElementById("plantingMaterialList").winControl, //assign list of planting materials to plantingMaterialLIstView
        soilAmendmentListView = document.getElementById("soilAmendmentList").winControl, //assign list of soil amendments to soilAmendmentsListView

        appBar = document.getElementById("appBar").winControl, //control for the menu that comes up on the bottom
       // editFlyout = document.getElementById("editFlyout").winControl, //control for the edit purchase form
        self = this,
        fertilizerDataList,
        chemicalDataList,
        plantingMaterialDataList,
        soilAmendmentDataList;

    this.init = function () {

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

            fertlizerListView.selection.clear(); //de-select all items from the list
            fertlizerListView.onselectionchanged = self.selectionChanged; //get item that the user selects
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

            chemicalListView.selection.clear();
            chemicalListView.onselectionchanged = self.selectionChanged;

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

            plantingMaterialListView.selection.clear();
            plantingMaterialListView.onselectionchanged = self.selectionChanged;
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

            soilAmendmentListView.selection.clear();
            soilAmendmentListView.onselectionchanged = self.selectionChanged;
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

        //count number of items selected in each list to determine which list to use
        var selectionCountF = fertlizerListView.selection.count();
        var selectionCountC = chemicalListView.selection.count();
        var selectionCountPM = plantingMaterialListView.selection.count();
        var selectionCountSA = soilAmendmentListView.selection.count();
        var selectionCount;

       
        if ((selectionCountF > 0) && (selectionCountC === 0) && (selectionCountPM === 0) && (selectionCountSA === 0)) {
            localStorage.setItem("listTypeToUse", "fertlizerListView");
            selectionCount = selectionCountF;
            console.log("list : " + localStorage.getItem("listTypeToUse"));
           
        }

        if ((selectionCountF === 0) && (selectionCountC > 0) && (selectionCountPM === 0) && (selectionCountSA === 0)) {
            localStorage.setItem("listTypeToUse", "chemicalListView");
            selectionCount = selectionCountC;
            console.log("list : " + localStorage.getItem("listTypeToUse"));

        }

        if ((selectionCountF === 0) && (selectionCountC === 0) && (selectionCountPM > 0) && (selectionCountSA === 0)) {
            localStorage.setItem("listTypeToUse", "plantingMaterialListView");
            selectionCount = selectionCountPM;
            console.log("list : " + localStorage.getItem("listTypeToUse"));

        }

        if ((selectionCountF === 0) && (selectionCountC === 0) && (selectionCountPM === 0) && (selectionCountSA > 0)) {
            localStorage.setItem("listTypeToUse", "soilAmendmentListView");
            selectionCount = selectionCountSA;
            console.log("list : " + localStorage.getItem("listTypeToUse"));
        }
        
        var
            //selectionCount = fertlizerListView.selection.count(), //get number of items selected
            selectionCommands = document.querySelectorAll(".appBarSelection"), //commands if more than one item is selected
            singleSelectionCommands = document.querySelectorAll(".appBarSingleSelection"); //commands if only one item is selected

        console.log("selection count : " + selectionCount);

        if (selectionCount === 1) { //1 item selected
            appBar.showCommands(selectionCommands);

            appBar.sticky = true;
            appBar.show(); //show menu at the bottom
        }       
        else {
            appBar.hideCommands(selectionCommands);

            appBar.sticky = false;
            appBar.hide(); //hide menu at the bottom
        }
    };

    //delete an item from an object store in the database
    this.deleteToDo = function () {
       
        var listTypeToUse = localStorage.getItem("listTypeToUse");

        if (listTypeToUse == "fertlizerListView") {

            var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");
            dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
                var selectionCount = fertlizerListView.selection.count(); //count number of items selected
                if (selectionCount > 0) {
                    fertlizerListView.selection.getItems().then(function (items) {
                        items.forEach(function (item) { //for each item that is selected
                            var
                                dbKey = item.data.id, //get the id of the item which was autogenerated
                                lvKey = item.key; //get the key for the item

                            myDatabase.purchaseList.remove(dbKey, otherFertilizerObjectStoreName, function () {
                                fertlizerListView.itemDataSource.remove(lvKey); //remove item from the object store using the keys
                            });
                        });
                    });
                }
            }));

            dialog.commands.append(new Windows.UI.Popups.UICommand("Cancel", null));

            dialog.defaultCommandIndex = 1;
            dialog.cancelCommandIndex = 1;
            dialog.showAsync();
        }

        if (listTypeToUse == "chemicalListView") {

            var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");
            dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
                var selectionCount = chemicalListView.selection.count(); //count number of items selected
                if (selectionCount > 0) {
                    chemicalListView.selection.getItems().then(function (items) {
                        items.forEach(function (item) { //for each item that is selected
                            var
                                dbKey = item.data.id, //get the id of the item which was autogenerated
                                lvKey = item.key; //get the key for the item

                            myDatabase.purchaseList.remove(dbKey, otherChemicalObjectStoreName, function () {
                                chemicalListView.itemDataSource.remove(lvKey); //remove item from the object store using the keys
                            });
                        });
                    });
                }
            }));

            dialog.commands.append(new Windows.UI.Popups.UICommand("Cancel", null));

            dialog.defaultCommandIndex = 1;
            dialog.cancelCommandIndex = 1;
            dialog.showAsync();
        }

        if (listTypeToUse == "plantingMaterialListView") {

            var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");
            dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
                var selectionCount = plantingMaterialListView.selection.count(); //count number of items selected
                if (selectionCount > 0) {
                    plantingMaterialListView.selection.getItems().then(function (items) {
                        items.forEach(function (item) { //for each item that is selected
                            var
                                dbKey = item.data.id, //get the id of the item which was autogenerated
                                lvKey = item.key; //get the key for the item

                            myDatabase.purchaseList.remove(dbKey, otherPlantingMaterialObjectStoreName, function () {
                                plantingMaterialListView.itemDataSource.remove(lvKey); //remove item from the object store using the keys
                            });
                        });
                    });
                }
            }));

            dialog.commands.append(new Windows.UI.Popups.UICommand("Cancel", null));

            dialog.defaultCommandIndex = 1;
            dialog.cancelCommandIndex = 1;
            dialog.showAsync();
        }

        if (listTypeToUse == "soilAmendmentListView") {

            var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");
            dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
                var selectionCount = soilAmendmentListView.selection.count(); //count number of items selected
                if (selectionCount > 0) {
                    soilAmendmentListView.selection.getItems().then(function (items) {
                        items.forEach(function (item) { //for each item that is selected
                            var
                                dbKey = item.data.id, //get the id of the item which was autogenerated
                                lvKey = item.key; //get the key for the item

                            myDatabase.purchaseList.remove(dbKey, otherSoilAmendmentObjectStoreName, function () {
                                soilAmendmentListView.itemDataSource.remove(lvKey); //remove item from the object store using the keys
                            });
                        });
                    });
                }
            }));

            dialog.commands.append(new Windows.UI.Popups.UICommand("Cancel", null));

            dialog.defaultCommandIndex = 1;
            dialog.cancelCommandIndex = 1;
            dialog.showAsync();
        }


    };


    //edit an item in purchaseObjectStore in the database
    this.editToDo = function () {

        var listTypeToUse = localStorage.getItem("listTypeToUse");

        var
            anchor = document.querySelector(".toDo"), //position to put the editForm on the screen
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
                    lvIndex: item.index
                };

                //put the previous name as part of the label because it cannot be done in the actual edit form because the form is dynamic
                document.getElementById('labelName').innerText = "Name : " + toDo.name;
             

                var process = WinJS.Binding.processAll(editFlyoutElement, toDo);
                process.then(function () {
                    editFlyout.show(anchor, "top", "center"); //where to position the editForm
                });
            });
        }
    };



    this.submitEdit = function (e) {
        e.preventDefault();

        var listTypeToUse = localStorage.getItem("listTypeToUse");

        var toDo = {
            id: document.querySelector("#editForm .id").value,
            type: document.querySelector("#editForm .type").value,
            name: document.querySelector("#editForm .name").value,
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
