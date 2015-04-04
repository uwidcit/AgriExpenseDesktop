
function onAddPurchasesPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializePurchaseUI();

            var cycleName = localStorage.getItem("cropCycleName");
            var cycleCrop = localStorage.getItem("cropCycleCrop");
            var cycleTypeOfLand = localStorage.getItem("cropCycleTypeOfLand");
            var cycleLandQuantity = localStorage.getItem("cropCycleLandQuantity");
            var cycleStartDate = localStorage.getItem("cropCycleStartDate");


            var cropCycleIdFromStorage = localStorage.getItem("cropCycleId");
            document.getElementById("cycleNameID").innerHTML = "Cycle Name: "+cycleName;
            document.getElementById("cycleCropID").innerHTML = "Crop: " + cycleCrop;
            document.getElementById("cycleLandTypeID").innerHTML = "Land Type: " + cycleTypeOfLand;
            document.getElementById("cycleLandQuantityID").innerHTML = "Land Quantity: " + cycleLandQuantity;
            document.getElementById("cycleStartDateID").innerHTML = "Start Date: " + cycleStartDate;
          //  document.getElementById("cycleTotalCost").innerHTML = "TotalCost: ";

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

function initializePurchaseUI()
{
    var viewModel = new ViewModel();
    viewModel.init();

    document.getElementById("addMaterialForm").addEventListener("submit", viewModel.submitEdit, false);
    document.getElementById("addMaterialCommand").addEventListener("click", viewModel.addMaterialToDo, false);
    document.querySelector("#addMaterialForm .cancel").addEventListener("click", viewModel.cancelEdit, false);
}

function ViewModel()
{
    var
        listView = document.getElementById("pList").winControl,
        listView2 = document.getElementById("ruList").winControl,

        chemicalListView = document.getElementById("chemicalList").winControl,
        fertilizerListView = document.getElementById("fertilizerList").winControl,
        plantingMaterialListView = document.getElementById("plantingMaterialList").winControl,
        soilAmendmentListView = document.getElementById("soilAmendmentList").winControl,
        otherListView = document.getElementById("otherList").winControl,
        labourListView = document.getElementById("labourList").winControl,

        appBar = document.getElementById("appBar").winControl,
        addMaterialFlyout = document.getElementById("addMaterialFlyout").winControl,
        addMaterialForm = document.getElementById("addMaterialForm"),
        self = this,
        dataListRU,
        chemicalDataList,
        fertilizerDataList,
        plantingMaterialDataList,
        soilAmendmentDataList,
        otherDataList,
        labourDataList,
        dataList;

    this.init = function ()
    {
        myDatabase.purchaseList.getList(purchaseObjectStoreName, function (e)
        {
            dataList = new WinJS.Binding.List(e);

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;
        });

        myDatabase.purchaseList.getDataForEachCycle(resourceUseageObjectStoreName, localStorage.getItem("cropCycleId"), function (e) {
            dataListRU = new WinJS.Binding.List(e);
            listView2.itemDataSource = dataListRU.dataSource;
      
        });

        

        //Filter by Material Type - Chemical
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Chemical", localStorage.getItem("cropCycleId"), function (e) {
            chemicalDataList = new WinJS.Binding.List(e);
            chemicalListView.itemDataSource = chemicalDataList.dataSource;
    
        });

        //Filter by Material Type - Fertilizer
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Fertilizer", localStorage.getItem("cropCycleId"), function (e) {
            fertilizerDataList = new WinJS.Binding.List(e);
            fertilizerListView.itemDataSource = fertilizerDataList.dataSource;
            
        });

        //Filter by Material Type - Planting Material
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Planting Material", localStorage.getItem("cropCycleId"), function (e) {
            plantingMaterialDataList = new WinJS.Binding.List(e);
            plantingMaterialListView.itemDataSource = plantingMaterialDataList.dataSource;
            
        });

        //Filter by Material Type - Soil Amendment
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Soil Amendment", localStorage.getItem("cropCycleId"), function (e) {
            soilAmendmentDataList = new WinJS.Binding.List(e);
            soilAmendmentListView.itemDataSource = soilAmendmentDataList.dataSource;
          
          });

        //Filter by Material Type - Other
        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, "Other", localStorage.getItem("cropCycleId"), function (e) {
              otherDataList = new WinJS.Binding.List(e);
              otherListView.itemDataSource = otherDataList.dataSource;
          
        });

        myDatabase.purchaseList.getLabourForEachCycle(labourObjectStoreName, localStorage.getItem("cropCycleId"), function (e) {
            labourDataList = new WinJS.Binding.List(e);
            labourListView.itemDataSource = labourDataList.dataSource;

        });
    
    };


    var delay = (function ()
    {
        var timer = 0;
        return function (callback, ms)
        {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    this.selectionChanged = function (args)
    {
        var
            selectionCount = listView.selection.count(),
            selectionCommands = document.querySelectorAll(".appBarSelection"),
            singleSelectionCommands = document.querySelectorAll(".appBarSingleSelection");

        if (selectionCount > 0)
        {
            appBar.showCommands(selectionCommands);

            if (selectionCount > 1)
            {
                appBar.hideCommands(singleSelectionCommands);
            }

            appBar.sticky = true;
            appBar.show();
        }
        else
        {
            appBar.hideCommands(selectionCommands);

            appBar.sticky = false;
            appBar.hide();
        }
    };



    this.addMaterialToDo = function ()
    {
        var dp = document.getElementById("dateDiv").winControl;
        var currentDate = dp.current;

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
    };


    this.submitEdit = function (e) {  //get data from form, add to resource use object store, edit quantity in purchase object store
        e.preventDefault();

        var dp = document.getElementById("dateDiv").winControl;
        var currentDate = dp.current;

        var cropCycleIdFromStorage = localStorage.getItem("cropCycleId"); //get crop cycle selected
        var amountRemaining = document.querySelector("#addMaterialForm .amountRemaining").value;
        var cost = document.querySelector("#addMaterialForm .cost").value;
        var amountToAdd = document.querySelector("#addMaterialForm .amountToAdd").value;
        var useCost = ((amountRemaining / cost) * amountToAdd).toFixed(2); //calculate use cost of that quantity of material
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
            //now edit quantity in purchase
            myDatabase.purchaseList.update(purchaseToDo, purchaseObjectStoreName, function (e) {
                addMaterialFlyout.hide();
                appBar.hide();
                addMaterialForm.reset();
                listView.selection.clear();

                dataList.setAt(purchaseToDo.lvIndex, purchaseToDo);
                window.location = "addPurchases.html";
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
        appBar.hide();
        addMaterialForm.reset();
        listView.selection.clear();
    };
}


function getValuesFromObjectStore(cropCyID, materialType)
{
    //get values for that crop cycle
    myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, materialType, cropCyID, function (e) {
        var resourceList = new WinJS.Binding.List(e);
        var newList = resourceList;
    });

}
