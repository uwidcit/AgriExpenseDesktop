
function onPurchasesPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializePurchaseUI();

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
    //location.reload();
    var viewModel = new ViewModel();
    viewModel.init();

    document.getElementById("addForm").addEventListener("submit", viewModel.submitAdd, false);
    document.getElementById("editForm").addEventListener("submit", viewModel.submitEdit, false);
    document.getElementById("deleteCommand").addEventListener("click", viewModel.deleteToDo, false);
    document.getElementById("editCommand").addEventListener("click", viewModel.editToDo, false);
    document.querySelector("#editForm .cancel").addEventListener("click", viewModel.cancelEdit, false);
}

function ViewModel() {
    var
        listView = document.getElementById("purchaseList").winControl,
        otherPurchaseListView = document.getElementById("otherPurchaseList").winControl,
        fertlizerListView = document.getElementById("fertilizerList").winControl,
        chemicalListView = document.getElementById("chemicalList").winControl,
        plantingMaterialListView = document.getElementById("plantingMaterialList").winControl,
        soilAmendmentListView = document.getElementById("soilAmendmentList").winControl,

        appBar = document.getElementById("appBar").winControl,
        editFlyout = document.getElementById("editFlyout").winControl,
        addForm = document.getElementById("addForm"),
        editForm = document.getElementById("editForm"),
        self = this,
        otherPurchaseDataList,
        fertilizerDataList,
        chemicalDataList,
        plantingMaterialDataList,
        soilAmendmentDataList,
        dataList;

    this.init = function () {
        
        myDatabase.purchaseList.getList(purchaseObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;
        });

        myDatabase.purchaseList.getList(otherPurchaseObjectStoreName, function (e) {
            otherPurchaseDataList = new WinJS.Binding.List(e);

            otherPurchaseListView.itemDataSource = otherPurchaseDataList.dataSource;
           
            otherPurchaseListView.selection.selectAll();
            var selectionCount = otherPurchaseListView.selection.count();
            
            //push to otherPurchaseArray
            if (selectionCount > 0) {
                otherPurchaseListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var name = item.data.name;
                        otherPurchaseArray.push(name);
                    });
                });
            }
        });

        myDatabase.purchaseList.getList(otherFertilizerObjectStoreName, function (e) {
            fertilizerDataList = new WinJS.Binding.List(e);

            fertlizerListView.itemDataSource = fertilizerDataList.dataSource;
           
            fertlizerListView.selection.selectAll();
            var selectionCount = fertlizerListView.selection.count();

            //push to fertlizerArray
            if (selectionCount > 0) {
                fertlizerListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var name = item.data.name;
                        fertilizerArray.push(name);
                    });
                });
            }


        });

        myDatabase.purchaseList.getList(otherChemicalObjectStoreName, function (e) {
            chemicalDataList = new WinJS.Binding.List(e);

            chemicalListView.itemDataSource = chemicalDataList.dataSource;
          
            chemicalListView.selection.selectAll();
            var selectionCount = chemicalListView.selection.count();

            //push to chemicalArray
            if (selectionCount > 0) {
                chemicalListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var name = item.data.name;
                        chemicalArray.push(name);
                    });
                });
            }


        });

        myDatabase.purchaseList.getList(otherPlantingMaterialObjectStoreName, function (e) {
            plantingMaterialDataList = new WinJS.Binding.List(e);

            plantingMaterialListView.itemDataSource = plantingMaterialDataList.dataSource;
           
            plantingMaterialListView.selection.selectAll();
            var selectionCount = plantingMaterialListView.selection.count();

            //push to fertlizerArray
            if (selectionCount > 0) {
                plantingMaterialListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var name = item.data.name;
                        cropArray.push(name);
                    });
                });
            }


        });

        myDatabase.purchaseList.getList(otherSoilAmendmentObjectStoreName, function (e) {
            soilAmendmentDataList = new WinJS.Binding.List(e);

            soilAmendmentListView.itemDataSource = soilAmendmentDataList.dataSource;
           
            soilAmendmentListView.selection.selectAll();
            var selectionCount = soilAmendmentListView.selection.count();

            //push to fertlizerArray
            if (selectionCount > 0) {
                soilAmendmentListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var name = item.data.name;
                        soilAmendmentArray.push(name);
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

    this.selectionChanged = function (args) {
        var
            selectionCount = listView.selection.count(),
            selectionCommands = document.querySelectorAll(".appBarSelection"),
            singleSelectionCommands = document.querySelectorAll(".appBarSingleSelection");

        if (selectionCount > 0) {
            appBar.showCommands(selectionCommands);

            if (selectionCount > 1) {
                appBar.hideCommands(singleSelectionCommands);
            }

            appBar.sticky = true;
            appBar.show();
        }
        else {
            appBar.hideCommands(selectionCommands);

            appBar.sticky = false;
            appBar.hide();
        }
    };

    this.deleteToDo = function () {
        var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");

        dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
            var selectionCount = listView.selection.count();
            if (selectionCount > 0) {
                listView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var
                            dbKey = item.data.id,
                            lvKey = item.key;

                        myDatabase.purchaseList.remove(dbKey, purchaseObjectStoreName, function () {
                            listView.itemDataSource.remove(lvKey);
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

    this.editToDo = function () {
        var
            anchor = document.querySelector(".toDo"),
            selectionCount = listView.selection.count();

        if (selectionCount === 1) {
            listView.selection.getItems().then(function (items) {
                var
                    item = items[0],
                    editFlyoutElement = document.getElementById("editFlyout");

                var toDo = {
                    id: item.data.id,
                    type: item.data.type,
                    name: item.data.name,
                    quantifier: item.data.quantifier,
                    quantity: item.data.quantity,
                    cost: item.data.cost,
                    lvIndex: item.index
                };

                var process = WinJS.Binding.processAll(editFlyoutElement, toDo);

                process.then(function () {
                    editFlyout.show(anchor, "top", "center");
                });
            });
        }
    };

    this.submitAdd = function (e) {
        e.preventDefault();

        var toDo = {
            type: document.querySelector("#addForm .type").value,
            name: document.querySelector("#addForm .name").value,
            quantifier: document.querySelector("#addForm .quantifier").value,
            quantity: document.querySelector("#addForm .quantity").value,
            cost: document.querySelector("#addForm .cost").value,
            amountRemaining: document.querySelector("#addForm .quantity").value

        };

        myDatabase.purchaseList.add(toDo, purchaseObjectStoreName, function (e) {
            dataList.push(e);

            addForm.reset();

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
