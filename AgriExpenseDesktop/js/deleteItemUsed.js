function onAddPurchasesPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializePurchaseUI();

            localStorage.setItem("totalCycleCost", 0); //initialise the total cost of the cycle

            var cycleName = localStorage.getItem("cropCycleName");
            var cycleCrop = localStorage.getItem("cropCycleCrop");
            var cycleTypeOfLand = localStorage.getItem("cropCycleTypeOfLand");
            var cycleLandQuantity = localStorage.getItem("cropCycleLandQuantity");
            var cycleStartDate = localStorage.getItem("cropCycleStartDate");


            var cropCycleIdFromStorage = localStorage.getItem("cropCycleId");
            document.getElementById("cycleNameID").innerHTML = "Cycle Name: " + cycleName;
            document.getElementById("cycleCropID").innerHTML = "Crop: " + cycleCrop;
            document.getElementById("cycleLandTypeID").innerHTML = "Land Type: " + cycleTypeOfLand;
            document.getElementById("cycleLandQuantityID").innerHTML = "Land Quantity: " + cycleLandQuantity;
            document.getElementById("cycleStartDateID").innerHTML = "Start Date: " + cycleStartDate;

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

}

function ViewModel() {
    var
        listView = document.getElementById("pList").winControl,
        listView2 = document.getElementById("ruList").winControl,

        self = this,
        dataListRU,

        dataList;

    this.init = function () {


        myDatabase.purchaseList.getListByItemTypeAndCycle(resourceUseageObjectStoreName, localStorage.getItem("deleteTypeButtonClick"), localStorage.getItem("cropCycleId"), function (e) {
            dataList = new WinJS.Binding.List(e);

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;

            //left click on one of the items to add
              WinJS.UI.setOptions(listView, {
                oniteminvoked: deleteItemLeftClick
            });  
        });  

        myDatabase.purchaseList.getDataForEachCycle(resourceUseageObjectStoreName, localStorage.getItem("cropCycleId"), function (e) {
            dataListRU = new WinJS.Binding.List(e);
            listView2.itemDataSource = dataListRU.dataSource;

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
        
    };

    var deleteItemLeftClick = function (e) {
        
        e.detail.itemPromise.then(function (item) {
            
            listView.selection.set(item.index);

            var dialog = new Windows.UI.Popups.MessageDialog("Are you sure you want to delete?");

            dialog.commands.append(new Windows.UI.Popups.UICommand("OK", function (command) {
             
                            var
                                dbKey = item.data.id,
                                lvKey = item.key;

                            myDatabase.purchaseList.remove(dbKey, resourceUseageObjectStoreName, function () {
                                listView.itemDataSource.remove(lvKey);
                            });
            }));

            dialog.commands.append(new Windows.UI.Popups.UICommand("Cancel", null));

            dialog.defaultCommandIndex = 1;
            dialog.cancelCommandIndex = 1;

            dialog.showAsync();

        }); 
    };



}

