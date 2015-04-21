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
    document.getElementById("deleteCommand").addEventListener("click", viewModel.deleteToDo, false); //execute deleteToDo method when delete command is selected
    
}

function ViewModel() {
    var
        listView = document.getElementById("cycleList").winControl,
        labourListView = document.getElementById("labourList").winControl,
        employeeListView = document.getElementById("employeeList").winControl,
        addForm = document.getElementById("addForm"),
        appBar = document.getElementById("appBar").winControl,
        self = this,
        employeeList,
        dataList;

    this.init = function () {
        myDatabase.purchaseList.getList(cycleObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);
            listView.itemDataSource = dataList.dataSource;
        });

        myDatabase.purchaseList.getList(labourObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);
            labourListView.itemDataSource = dataList.dataSource;

            labourListView.onselectionchanged = self.selectionChanged;

            WinJS.UI.setOptions(labourListView, {
                oniteminvoked: appBarOptionsLeftClick
            });
        });

        myDatabase.purchaseList.getList(historicalLabourStoreName, function (e) {
            employeeList = new WinJS.Binding.List(e);
            employeeListView.itemDataSource = employeeList.dataSource;
            employeeListView.selection.selectAll(); //select all from the list

            //push to array
            var selectionCount = employeeListView.selection.count();
            

            if (selectionCount > 0) {
                employeeListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var pname = item.data.name;
                        labourArray.push(pname);
                    });
                });

                //populate list (select box) in labour form here
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

    //when user left clicks on an item in the list of hired employees
    var isSelected = false;
    var appBarOptionsLeftClick = function (e) {
        e.detail.itemPromise.then(function (item) {
            if (isSelected == false) {
                labourListView.selection.set(item.index); //select the item they click on
                isSelected = true;
            }
            else if (isSelected == true) {
                labourListView.selection.clear(); //if they click of the item again, de-select it
                isSelected = false;
            }
        });
    };

    this.selectionChanged = function (args) {
        var
            selectionCount = labourListView.selection.count(),
            selectionCommands = document.querySelectorAll(".appBarSelection"),
            singleSelectionCommands = document.querySelectorAll(".appBarSingleSelection");

        if (selectionCount === 1) { //1 item selected
            appBar.showCommands(selectionCommands);

           // if (selectionCount > 1) { //more than one item selected
               // appBar.hideCommands(singleSelectionCommands);
          //  }

            appBar.sticky = true;
            appBar.show(); //show menu at the bottom
        }
        else {
            appBar.hideCommands(selectionCommands);

            appBar.sticky = false;
            appBar.hide(); //hide menu at the bottom
        }

   
    };

    this.deleteToDo = function () {
        var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");

        dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
            var selectionCount = labourListView.selection.count();
            if (selectionCount > 0) {
                labourListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var
                            dbKey = item.data.id,
                            lvKey = item.key;

                        myDatabase.purchaseList.remove(dbKey, labourObjectStoreName, function () {
                            labourListView.itemDataSource.remove(lvKey);
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

     
            var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to hire " + toDo.personName + " for many crop cycles?");
            dialog.commands.append(new Windows.UI.Popups.UICommand("Yes", function (command) {
                myDatabase.purchaseList.add(toDo, labourObjectStoreName, function (e) {
                    dataList.push(e);
                    addForm.reset();
                    window.location = "labour.html";
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