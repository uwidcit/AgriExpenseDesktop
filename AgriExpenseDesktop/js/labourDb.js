
function onLabourPageLoad() {
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

    //REMOVE THIS
    viewModel.init();

    document.getElementById("addForm").addEventListener("submit", viewModel.doCheck, false);
    
}

function ViewModel() {
    var
        listView = document.getElementById("cycleList").winControl,
        addForm = document.getElementById("addForm"),
        self = this,
        labourList,
        dataList;

    this.init = function () {
        myDatabase.purchaseList.getList(cycleObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);
        });

        myDatabase.purchaseList.getList(labourObjectStoreName, function (e) {
            labourList = new WinJS.Binding.List(e);

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
           // selectionCommands = document.querySelectorAll(".appBarSelection"),
           // singleSelectionCommands = document.querySelectorAll(".appBarSingleSelection");

        if (selectionCount > 0) {
            //get crop cycle id and pass it in to another funtion that then stores stuff
            var dialog = new Windows.UI.Popups.MessageDialog("Select this cycle?");
            dialog.commands.append(new Windows.UI.Popups.UICommand("Yes", null));
            dialog.commands.append(new Windows.UI.Popups.UICommand("No", null));


            //DO STUFF HERE
            var toDo = {
                personName: document.querySelector("#addForm .personName").value,
                paymentPlan: document.querySelector("#addForm .paymentPlan").value,
                time: document.querySelector("#addForm .time").value,
                cost: document.querySelector("#addForm .cost").value,
                cycleID: document.querySelector("#getIdForm .id").value  //FIX THISSS
            };

            
            
            myDatabase.purchaseList.add(toDo, labourObjectStoreName, function (e) {
                labourList.push(e);
                addForm.reset();
                listView.itemDataSource = dataList.hide;
            });

            
           // listView.selection.clear();
           
            if (selectionCount > 1) {
               
            }

           
        }
        
    };

    this.doCheck = function (e) {
        e.preventDefault();

        var one = document.getElementById("one").checked;
        var many = document.getElementById("many").checked;
        
        if (many == true) {
            cycleId = -1;
            var toDo = {
                personName: document.querySelector("#addForm .personName").value,
                paymentPlan: document.querySelector("#addForm .paymentPlan").value,
                time: document.querySelector("#addForm .time").value,
                cost: document.querySelector("#addForm .cost").value,
                cycleID: cycleId
            };

            myDatabase.purchaseList.add(toDo, labourObjectStoreName, function (e) {
                labourList.push(e);
                addForm.reset();
            });

        }

        else if (one == true){
            //display cycle list
            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;
        }
      
    };



}




