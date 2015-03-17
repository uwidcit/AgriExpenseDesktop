
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
    var viewModel = new ViewModel();
    viewModel.init();

    document.getElementById("addForm").addEventListener("submit", viewModel.submitAdd, false);
    document.getElementById("editForm").addEventListener("submit", viewModel.submitEdit, false);
    document.getElementById("deleteCommand").addEventListener("click", viewModel.deleteToDo, false);
    document.getElementById("editCommand").addEventListener("click", viewModel.editToDo, false);
    document.querySelector("#editForm .cancel").addEventListener("click", viewModel.cancelEdit, false);
    document.getElementById('inputType').value = localStorage.getItem("typeSelected");
    localStorage.setItem("typeSelected", "");
}

function ViewModel() {
    var
        listView = document.getElementById("otherPurchaseList").winControl,
        appBar = document.getElementById("appBar").winControl,
        editFlyout = document.getElementById("editFlyout").winControl,
        addForm = document.getElementById("addForm"),
        editForm = document.getElementById("editForm"),
        self = this,
        dataList;

    this.init = function () {
        myDatabase.purchaseList.getList(otherPurchaseObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;
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

                        myDatabase.purchaseList.remove(dbKey, otherPurchaseObjectStoreName, function () {
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
        };

        if (toDo.type == "Fertilizer") {
            myDatabase.purchaseList.add(toDo, otherFertilizerObjectStoreName, function (e) {
                dataList.push(e);
                addForm.reset();
            });
       
        }
        else if (toDo.type == "Chemical") {
            myDatabase.purchaseList.add(toDo, otherChemicalObjectStoreName, function (e) {
                dataList.push(e);
                addForm.reset();
            });
        }
        else if (toDo.type == "Planting Material") {
            myDatabase.purchaseList.add(toDo, otherPlantingMaterialObjectStoreName, function (e) {
                dataList.push(e);
                addForm.reset();
            });
        }
        else if (toDo.type == "Soil Amendment") {
            myDatabase.purchaseList.add(toDo, otherSoilAmendmentObjectStoreName, function (e) {
                dataList.push(e);
                addForm.reset();
            });
        }

        myDatabase.purchaseList.add(toDo, otherPurchaseObjectStoreName, function (e) {
            dataList.push(e);
            addForm.reset();
        });

        //window.location("purchases.html");
    };

    this.submitEdit = function (e) {
        e.preventDefault();

        var toDo = {
            id: document.querySelector("#editForm .id").value,
            type: "Other",
            name: document.querySelector("#editForm .name").value,
            quantifier: document.querySelector("#editForm .quantifier").value,
            quantity: document.querySelector("#editForm .quantity").value,
            cost: document.querySelector("#editForm .cost").value,
            lvIndex: document.querySelector("#editForm .lvIndex").value
        };

        myDatabase.purchaseList.update(toDo, otherPurchaseObjectStoreName, function (e) {
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
