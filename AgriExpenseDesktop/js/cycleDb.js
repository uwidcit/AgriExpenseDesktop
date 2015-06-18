

function onCyclesPageLoad() { //call this each time the page loads
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
    document.querySelector("#editForm .cancel").addEventListener("click", viewModel.cancelEdit, false);
}


function ViewModel() {
    var
        listView = document.getElementById("cycleList").winControl, //list of all cycles
        resourcesUsedListView = document.getElementById("resourcesUsedList").winControl, //list of all resouces used in that cycle
        appBar = document.getElementById("appBar").winControl, //bar at the bottom with edit and delete
        editFlyout = document.getElementById("editFlyout").winControl, //edit form flyout
        addForm = document.getElementById("addForm"), //add new cycle form
        editForm = document.getElementById("editForm"), //edit cycle form
        self = this,
        resourcesUsedDataList, //resources used in this cycle. Need a reference for this because we need to cascade the deletes if a cycle is deleted.
        dataList; //reference to crop cycles listview

        this.init = function () {

        

        myDatabase.purchaseList.getList(cycleObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);
            dataList.reverse(); //put most recent cycle first

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;

            //left click on a crop cycle
            WinJS.UI.setOptions(listView, {
                oniteminvoked: itemClick
            });

            //if the cycle has been selected to be edited or deleted from cycleUsage.html
            var getSelection = localStorage.getItem("cycleSelected");
            if (getSelection == "yes") {
               
                var ind = parseInt(localStorage.getItem("cropCycleIndex"));
                listView.selection.set(ind); //select cycle in list

                //cycle was selected to be edited
                if (localStorage.getItem("cycleEdit") == "yes") {
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

                                document.getElementById('labelCropName').innerText = "Crop : " + "(Previous: " + toDo.crop + ")";
                                document.getElementById('labelLandType').innerText = "Land Type : " + "(Previous: " + toDo.typeOfLand + ")";

                                var process = WinJS.Binding.processAll(editFlyoutElement, toDo);

                                process.then(function () {
                                    editFlyout.show(anchor, "top", "center");
                                });
                            });
                        }

                }

                //cycle was selected to be deleted
                else if (localStorage.getItem("cycleDelete") == "yes") {
                        var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");

                        dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
                            var selectionCount = listView.selection.count();
                            if (selectionCount > 0) {
                                listView.selection.getItems().then(function (items) {
                                    items.forEach(function (item) {
                                        var
                                            dbKey = item.data.id, //crop cycle id
                                            lvKey = item.key;

                                        myDatabase.purchaseList.remove(dbKey, cycleObjectStoreName, function () {
                                            listView.itemDataSource.remove(lvKey);

                                            //Also delete resources used for that cycle from resourceObjectStore
                                            myDatabase.purchaseList.getDataForEachCycle(resourceUseageObjectStoreName, dbKey, function (e) { //get list of all items used in this crop cycle, pass in crop cycle ID
                                                resourcesUsedDataList = new WinJS.Binding.List(e);
                                                resourcesUsedListView.itemDataSource = resourcesUsedDataList.dataSource;

                                                resourcesUsedListView.selection.selectAll();
                                                resourcesUsedListView.selection.getItems().then(function (items) {
                                                    items.forEach(function (item) {
                                                        var
                                                            idOfItem = item.data.id,
                                                            lvKey2 = item.key; //key for resources Used

                                                        myDatabase.purchaseList.remove(idOfItem, resourceUseageObjectStoreName, function () {
                                                            resourcesUsedListView.itemDataSource.remove(lvKey2);
                                                        })
                                                    })
                                                })

                                            });

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

                //reset boolean variables
                localStorage.setItem("cycleEdit", "no");
                localStorage.setItem("cycleDelete", "no");
                localStorage.setItem("cycleSelected", "no"); 
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

                document.getElementById('labelCropName').innerText = "Crop : " + "(Previous: " + toDo.crop + ")";
                document.getElementById('labelLandType').innerText = "Land Type : " + "(Previous: " + toDo.typeOfLand + ")";

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
        var year = dp.current.getFullYear().toString();
        var month1 = dp.current.getMonth() + 1;
        var month = month1.toString();
        var date = dp.current.getDate().toString();

        var stringDate = date + " / " + month + " / " + year;
        var currentDate = stringDate;
        

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

            var dialog = new Windows.UI.Popups.MessageDialog("Cycle Successfully Added");

            dialog.commands.append(new Windows.UI.Popups.UICommand("Okay", null));

            dialog.defaultCommandIndex = 1;
            dialog.cancelCommandIndex = 1;

            dialog.showAsync();
            window.location = "cycles.html"; //refresh page
        });
    };

    this.submitEdit = function (e) {
        e.preventDefault();

        var dp = document.getElementById("startDateEdit").winControl;
        var year = dp.current.getFullYear().toString();
        var month1 = dp.current.getMonth() + 1;
        var month = month1.toString();
        var date = dp.current.getDate().toString();

        var stringDate = date + " / " + month + " / " + year;
        var currentDate = stringDate;

        var toDo = {
            id: document.querySelector("#editForm .id").value,
            name: document.querySelector("#editForm .name").value,
            crop: document.querySelector("#editForm .crop").value,
            typeOfLand: document.querySelector("#editForm .typeOfLand").value,
            quantity: document.querySelector("#editForm .quantity").value,
            startDate: currentDate,
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

    var itemClick = function (e) {
        e.detail.itemPromise.then(function (item) {
            localStorage.setItem("cropCycleId", item.data.id); //Add Crop Cycle Id to local storage to access later
            localStorage.setItem("cropCycleIndex", item.index);
            localStorage.setItem("cropCycleName", item.data.name);
            localStorage.setItem("cropCycleCrop", item.data.crop);
            localStorage.setItem("cropCycleTypeOfLand", item.data.typeOfLand);
            localStorage.setItem("cropCycleLandQuantity", item.data.quantity);
            localStorage.setItem("cropCycleStartDate", item.data.startDate);

            window.location = 'cycleUsage.html'; //navigate to page where they can select from purchases
        });
    };
   
}

