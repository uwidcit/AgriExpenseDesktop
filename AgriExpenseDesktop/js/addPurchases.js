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

    document.getElementById("addMaterialForm").addEventListener("submit", viewModel.submitEdit, false);
    document.querySelector("#addMaterialForm .cancel").addEventListener("click", viewModel.cancelEdit, false);
}

function ViewModel() {
    var
        listView = document.getElementById("pList").winControl,
        listView2 = document.getElementById("ruList").winControl,

       

        addMaterialFlyout = document.getElementById("addMaterialFlyout").winControl,
        addMaterialForm = document.getElementById("addMaterialForm"),
        self = this,
        dataListRU,
      
        dataList;

    this.init = function () {


        myDatabase.purchaseList.getListByItemType(purchaseObjectStoreName, localStorage.getItem("typeButtonClick"), localStorage.getItem("cropCycleCrop"), function (e) {
            dataList = new WinJS.Binding.List(e);

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;

            //left click on one of the items to add
            WinJS.UI.setOptions(listView, {
                oniteminvoked: addMaterialToDoLeftClick
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
        var
            selectionCount = listView.selection.count();
    };

    var addMaterialToDoLeftClick = function (e) {
        e.detail.itemPromise.then(function (item) {

            var dp = document.getElementById("dateDiv").winControl;
            var currentDate = dp.current;

            listView.selection.set(item.index);

            var
             anchor = document.querySelector(".toDo"),
             selectionCount = listView.selection.count();

            if (selectionCount === 1) {
                listView.selection.getItems().then(function (items) {
                    var
                        item = items[0],
                        addMaterialFlyoutElement = document.getElementById("addMaterialFlyout");

                    var toDo = {
                        id: item.data.id,
                        type: item.data.type,
                        name: item.data.name,
                        quantifier: item.data.quantifier,
                        quantity: item.data.quantity,
                        amountRemaining: item.data.amountRemaining,
                        cost: item.data.cost,
                        amountToAdd: item.data.amountToAdd,
                        datePurchased: currentDate,
                        lvIndex: item.index
                    };

                    var process = WinJS.Binding.processAll(addMaterialFlyoutElement, toDo);  //display addMaterial form with values disabled

                    process.then(function () {
                        addMaterialFlyout.show(anchor, "top", "center");
                    });
                });
            }



        });
    };


    this.submitEdit = function (e) {  //get data from form, add to resource use object store, edit quantity in purchase object store
        e.preventDefault();

        var dp = document.getElementById("dateDiv").winControl;
        var currentDate = dp.current;

        var cropCycleIdFromStorage = localStorage.getItem("cropCycleId"); //get crop cycle selected
        var quantityPurchased = document.querySelector("#addMaterialForm .quantity").value;
        var amountRemaining = document.querySelector("#addMaterialForm .amountRemaining").value;
        var cost = document.querySelector("#addMaterialForm .cost").value;
        var amountToAdd = document.querySelector("#addMaterialForm .amountToAdd").value;
        var useCost = ((quantityPurchased / cost) * amountToAdd).toFixed(2); //calculate use cost of that quantity of material
        var quantityLeft = amountRemaining - amountToAdd;

        if (amountToAdd <= amountRemaining) {

            var toDo = {
                purchaseID: document.querySelector("#addMaterialForm .id").value,
                resourceName: document.querySelector("#addMaterialForm .name").value,
                cropCycleID: cropCycleIdFromStorage,
                resourceType: document.querySelector("#addMaterialForm .type").value,
                amountToAdd: amountToAdd,
                quantifier: document.querySelector("#addMaterialForm .quantifier").value,
                cost: cost,
                useCost: useCost,
                datePurchased: currentDate,
                lvIndex: document.querySelector("#addMaterialForm .lvIndex").value
            };

            var resourceType = toDo.resourceType;


            //Add to ruList, edit quantity in purchaseObjectStore

            myDatabase.purchaseList.add(toDo, resourceUseageObjectStoreName, function (e) {
                dataListRU.push(e); //added to Resource Use Object Store
                addMaterialFlyout.hide();
                addMaterialForm.reset();
                getValuesFromObjectStore(cropCycleIdFromStorage, resourceType);
            });


            //get purchase information from addMaterialForm
            var purchaseToDo = {
                id: document.querySelector("#addMaterialForm .id").value, //purchaseID
                type: document.querySelector("#addMaterialForm .type").value,
                name: document.querySelector("#addMaterialForm .name").value,
                quantifier: document.querySelector("#addMaterialForm .quantifier").value,
                quantity: document.querySelector("#addMaterialForm .quantity").value,
                amountRemaining: quantityLeft,
                cost: document.querySelector("#addMaterialForm .cost").value,
                lvIndex: document.querySelector("#addMaterialForm .lvIndex").value
            };

            -
            //now edit remaining quantity in purchase
             myDatabase.purchaseList.update(purchaseToDo, purchaseObjectStoreName, function (e) {
                 addMaterialFlyout.hide();
                 //  appBar.hide();
                 addMaterialForm.reset();
                 listView.selection.clear();

                 dataList.setAt(purchaseToDo.lvIndex, purchaseToDo);
                 window.location = "cycleUsage.html";
             });

        }
        else {
            var dialog = new Windows.UI.Popups.MessageDialog("Not enough available");

            dialog.commands.append(new Windows.UI.Popups.UICommand("Okay", null));
            listView.selection.clear();
            dialog.cancelCommandIndex = 1;

            dialog.showAsync();
        }
    };

    this.cancelEdit = function (e) {
        e.preventDefault();

        addMaterialFlyout.hide();
        addMaterialForm.reset();
        listView.selection.clear();
    };
}


function getValuesFromObjectStore(cropCyID, materialType) {
    //get values for that crop cycle
    myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, materialType, cropCyID, function (e) {
        var resourceList = new WinJS.Binding.List(e);
    });

}