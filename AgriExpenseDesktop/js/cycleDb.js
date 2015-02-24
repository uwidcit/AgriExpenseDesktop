var cropCycleId;


function onCyclesPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializeCycleUI();

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

function initializeCycleUI() {
    var viewModel = new ViewModel();
    viewModel.init();

    document.getElementById("addForm").addEventListener("submit", viewModel.submitAdd, false);
    document.getElementById("editForm").addEventListener("submit", viewModel.submitEdit, false);
    document.getElementById("deleteCommand").addEventListener("click", viewModel.deleteToDo, false);
    document.getElementById("editCommand").addEventListener("click", viewModel.editToDo, false);
    document.getElementById("addMaterialCommand").addEventListener("click", viewModel.getCropCycleInfo, false);
    document.querySelector("#editForm .cancel").addEventListener("click", viewModel.cancelEdit, false);
}


function ViewModel() {
    var
        listView = document.getElementById("cycleList").winControl,
        appBar = document.getElementById("appBar").winControl,
        editFlyout = document.getElementById("editFlyout").winControl,
        addForm = document.getElementById("addForm"),
        editForm = document.getElementById("editForm"),
        self = this,
        dataList;

    this.init = function () {
        myDatabase.purchaseList.getList(cycleObjectStoreName, function (e) {
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

                        myDatabase.purchaseList.remove(dbKey, cycleObjectStoreName, function () {
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
                    name: item.data.name,
                    crop: item.data.crop,
                    typeOfLand: item.data.typeOfLand,
                    quantity: item.data.quantity,
                    startDate: item.data.startDate,
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

        var dp = document.getElementById("dateDiv").winControl;
        var currentDate = dp.current;

        var toDo = {
            name: document.querySelector("#addForm .name").value,
            crop: document.querySelector("#addForm .crop").value,
            typeOfLand: document.querySelector("#addForm .typeOfLand").value,
            quantity: document.querySelector("#addForm .quantity").value,
            startDate: currentDate
        };
        
        myDatabase.purchaseList.add(toDo, cycleObjectStoreName, function (e) {
            dataList.push(e);

            addForm.reset();
        });
    };

    this.submitEdit = function (e) {
        e.preventDefault();

        var toDo = {
            id: document.querySelector("#editForm .id").value,
            name: document.querySelector("#editForm .name").value,
            crop: document.querySelector("#editForm .crop").value,
            typeOfLand: document.querySelector("#editForm .typeOfLand").value,
            quantity: document.querySelector("#editForm .quantity").value,
            startDate: document.querySelector("#editForm .startDate").value,
            lvIndex: document.querySelector("#editForm .lvIndex").value
        };

        myDatabase.purchaseList.update(toDo, cycleObjectStoreName, function (e) {
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

    this.getCropCycleInfo = function (e)
    {
        var
           anchor = document.querySelector(".toDo"),
           selectionCount = listView.selection.count();

        if (selectionCount === 1)
        {
            listView.selection.getItems().then(function (items)
            {
                var
                    item = items[0];

                var toDo = {
                    id: item.data.id,
                    name: item.data.name,
                    lvIndex: item.index
                };

                localStorage.setItem("cropCycleId", item.data.id); //Add Crop Cycle Id to local storage to access later

                window.location = 'addPurchases.html'; //navigate to page where they can select from purchases
            });
        }
       
    }

   
}