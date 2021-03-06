﻿
function onQuantifierPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializeEmployeesUI();

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

function initializeEmployeesUI() {
    var viewModel = new ViewModel();
    viewModel.init();

    document.getElementById("addForm").addEventListener("submit", viewModel.submitAdd, false);
    document.getElementById("deleteCommand").addEventListener("click", viewModel.deleteToDo, false);

}

function ViewModel() {
    var
        listView = document.getElementById("quantifierList").winControl,
        appBar = document.getElementById("appBar").winControl,
        addForm = document.getElementById("addForm"),
        self = this,
        dataList;

    this.init = function () {
        myDatabase.purchaseList.getList(otherQuantifierObjectStoreName, function (e) {
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

    var isSelected = false;
    var selectItemLeftClick = function (e) {
        e.detail.itemPromise.then(function (item) {
            if (isSelected == false) {
                listView.selection.set(item.index); //select the item they click on
                isSelected = true;
            }
            else if (isSelected == true) {
                listView.selection.clear(); //if they click on it again, de-select it
                isSelected = false;
            }
        });
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

                        myDatabase.purchaseList.remove(dbKey, otherQuantifierObjectStoreName, function () {
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

        var toDo = {
            name: document.querySelector("#addForm .name").value,
        };

        myDatabase.purchaseList.add(toDo, otherQuantifierObjectStoreName, function (e) {
            dataList.push(e);
            addForm.reset();
            var dialog = new Windows.UI.Popups.MessageDialog("Item Successfully Added");

            dialog.commands.append(new Windows.UI.Popups.UICommand("Okay", null));

            dialog.defaultCommandIndex = 1;
            dialog.cancelCommandIndex = 1;

            dialog.showAsync();


            window.location = "addOtherPurchase.html";           
        });
    };


}
