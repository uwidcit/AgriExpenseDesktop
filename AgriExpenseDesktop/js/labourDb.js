function onLabourPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializeLabourUI();

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

function initializeLabourUI() {
    var viewModel = new ViewModel();
    viewModel.init();
    document.getElementById("addForm").addEventListener("submit", viewModel.submitAdd, false);

    
}

function ViewModel() {
    var
        listView = document.getElementById("cycleList").winControl,
        labourListView = document.getElementById("labourList").winControl,
        employeeListView = document.getElementById("employeeList").winControl,
        addForm = document.getElementById("addForm"),
        self = this,
        employeeList,
        dataList;

    this.init = function () {
        myDatabase.purchaseList.getList(cycleObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);
            listView.itemDataSource = dataList.dataSource;

            //  listView.onselectionchanged = self.selectionChanged;
        });

        myDatabase.purchaseList.getList(labourObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);
            labourListView.itemDataSource = dataList.dataSource;

            //  listView.onselectionchanged = self.selectionChanged;
        });

        myDatabase.purchaseList.getList(historicalLabourStoreName, function (e) {
            employeeList = new WinJS.Binding.List(e);
            employeeListView.itemDataSource = employeeList.dataSource;
            employeeListView.selection.selectAll(); //select all from the list
            //DO IT HERE
            var selectionCount = employeeListView.selection.count();
            console.log("Selection count : " + selectionCount);

            if (selectionCount > 0) {
                employeeListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var pname = item.data.name;
                        labourArray.push(pname);
                        for (var i = 0; i < labourArray.length; i++) {
                            console.log(labourArray[i]);
                        }
                    });
                });

                //populate list in form here
                var lselect = document.getElementById("labourSelect");
                for (var i = 0; i < labourArray.length; i++) {
                    var opt = labourArray[i];
                    var el = document.createElement("option");
                    el.textContent = opt;
                    el.value = opt;
                    lselect.appendChild(el);
                }
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

        if (selectionCount > 1) {
            //clear all selections somehow

        }

        if (selectionCount === 1) {
            //get information that is in cycle id - store in local storage or something
            listView.selection.getItems().then(function (items) {
                var
                    item = items[0],
                    cropCycleBlock = document.getElementById("purchasesItemTemplate");

                var toDo = {
                    id: item.data.id,
                    name: item.data.name,
                };

                localStorage.setItem("selectedCropCycleId", toDo.id);

            });
 
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





    this.submitAdd = function (e) {
        e.preventDefault();

        var one = document.getElementById("oneCycle").checked;
        var many = document.getElementById("manyCycles").checked;

        //Many Crop Cycles - Simply add it to the database
        if (many == true) {
            cycleId = -1;
            var toDo = {
                personName: document.querySelector("#addForm .personName").value,
                paymentPlan: document.querySelector("#addForm .paymentPlan").value,
                time: document.querySelector("#addForm .time").value,
                cost: document.querySelector("#addForm .cost").value,
                cycleID: cycleId
            };

            console.log("person Name : " + toDo.personName);
            console.log("cycle id : " + toDo.cycleID);

            var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to hire " + toDo.personName + " for many crop cycles?");
            dialog.commands.append(new Windows.UI.Popups.UICommand("Yes", function (command) {
                myDatabase.purchaseList.add(toDo, labourObjectStoreName, function (e) {
                    dataList.push(e);
                    addForm.reset();
                });
            }));

            dialog.commands.append(new Windows.UI.Popups.UICommand("Cancel", null));
            dialog.defaultCommandIndex = 1;
            dialog.cancelCommandIndex = 1;
            dialog.showAsync();

        }

        else if (one == true) { //bring up list of crop cycles for them to choose from
            var toDo = {
                personName: document.querySelector("#addForm .personName").value,
                paymentPlan: document.querySelector("#addForm .paymentPlan").value,
                time: document.querySelector("#addForm .time").value,
                cost: document.querySelector("#addForm .cost").value,
            };

            localStorage.setItem("personName", toDo.personName);
            localStorage.setItem("paymentPlan", toDo.paymentPlan);
            localStorage.setItem("time", toDo.time);
            localStorage.setItem("cost", toDo.cost);

            window.location = 'chooseCropCycle.html'; //navigate to page where they can select from purchases


    
        }
       

    };

};