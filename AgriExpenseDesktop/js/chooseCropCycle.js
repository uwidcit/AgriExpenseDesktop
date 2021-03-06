﻿var cropCycleId;


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
}


function ViewModel() {
    var
        listView = document.getElementById("cycleList").winControl,
        self = this,
        dataList;

    this.init = function () {
        myDatabase.purchaseList.getList(cycleObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;

            WinJS.UI.setOptions(listView, {
                oniteminvoked: selectItemLeftClick
            });
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
            selectionCount = listView.selection.count();

        if (selectionCount > 1) {
       
            listView.selection.clear();
        }

        if (selectionCount === 1) {
            listView.selection.getItems().then(function (items) {
                var
                    item = items[0],
                    cropCycleBlock = document.getElementById("purchasesItemTemplate");

                var toDo = {
                    id: item.data.id,
                    name: item.data.name,
                };

                var toDo2 = {
                    personName: localStorage.getItem("personName"),
                    paymentPlan: localStorage.getItem("paymentPlan"),
                    time: localStorage.getItem("time"),
                    cost: localStorage.getItem("cost"),
                    cycleID: toDo.id
                };
              

                //Store entry in labourStore in database
                var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to hire " + toDo2.personName + " for " + toDo.name+"?");
                dialog.commands.append(new Windows.UI.Popups.UICommand("Yes", function (command) {
                    myDatabase.purchaseList.add(toDo2, labourObjectStoreName, function (e) {
                        dataList.push(e);
                        window.location = 'labour.html';
                    });
               }));

                dialog.commands.append(new Windows.UI.Popups.UICommand("Cancel", function (command) {
                    listView.selection.clear();
                }));
                dialog.defaultCommandIndex = 1;
                dialog.cancelCommandIndex = 1;
                dialog.showAsync();

            });

            
        }

        else {
            
        }
    };


    var selectItemLeftClick = function (e) {
        e.detail.itemPromise.then(function (item) {
            listView.selection.set(item.index);
        });
    };



}