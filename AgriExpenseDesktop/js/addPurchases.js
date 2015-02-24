
function onAddPurchasesPageLoad() {
    WinJS.UI.processAll().then(function () {
        initializeDb().done(function () {
            initializePurchaseUI();

            var cycleName = localStorage.getItem("cropCycleName");
            var cycleCrop = localStorage.getItem("cropCycleCrop");
            var cropCycleIdFromStorage = localStorage.getItem("cropCycleId");
            document.getElementById("cycleNameID").innerHTML = "Cycle Name: "+cycleName;
            document.getElementById("cycleCropID").innerHTML = "Crop: "+cycleCrop;

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
        appBar = document.getElementById("appBar").winControl,
        addMaterialFlyout = document.getElementById("addMaterialFlyout").winControl,
        addMaterialForm = document.getElementById("addMaterialForm"),
        self = this,
        dataListRU,
        dataList;

    this.init = function ()
    {
        myDatabase.purchaseList.getList(purchaseObjectStoreName, function (e)
        {
            dataList = new WinJS.Binding.List(e);

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;
        });

        myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, localStorage.getItem("cropCycleId"), function (e) {
            dataListRU = new WinJS.Binding.List(e);
            listView2.itemDataSource = dataListRU.dataSource;
            //listView.itemDataSource = dataList.dataSource;
            //listView.onselectionchanged = self.selectionChanged;
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
                    cost: item.data.cost,
                    amountToAdd: item.data.amountToAdd,
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

        var cropCycleIdFromStorage = localStorage.getItem("cropCycleId"); //get crop cycle selected
        var quantity = document.querySelector("#addMaterialForm .quantity").value;
        var cost = document.querySelector("#addMaterialForm .cost").value;
        var amountToAdd = document.querySelector("#addMaterialForm .amountToAdd").value;
        var useCost = ((quantity / cost) * amountToAdd).toFixed(2); //calculate use cost of that quantity of material
        var quantityLeft = quantity - amountToAdd;

        var toDo = {
            purchaseID: document.querySelector("#addMaterialForm .id").value,
            resourceName: document.querySelector("#addMaterialForm .name").value,
            cropCycleID: cropCycleIdFromStorage,
            resourceType: document.querySelector("#addMaterialForm .type").value,
            amountToAdd: amountToAdd,
            quantifier: document.querySelector("#addMaterialForm .quantifier").value,
            cost: cost,
            useCost: useCost,
            lvIndex: document.querySelector("#addMaterialForm .lvIndex").value
        };

   
        //Add to ruList, edit quantity in purchaseObjectStore

        myDatabase.purchaseList.add(toDo, resourceUseageObjectStoreName, function (e) {
            dataListRU.push(e); //added to Resource Use Object Store
            addMaterialFlyout.hide();
            addMaterialForm.reset();
            getValuesFromObjectStore(cropCycleIdFromStorage);
        });


        //get purchase information from addMaterialForm
        var purchaseToDo = {
            id: document.querySelector("#addMaterialForm .id").value,
            type: document.querySelector("#addMaterialForm .type").value,
            name: document.querySelector("#addMaterialForm .name").value,
            quantifier: document.querySelector("#addMaterialForm .quantifier").value,
            quantity: quantityLeft,
            cost: document.querySelector("#addMaterialForm .cost").value,
            lvIndex: document.querySelector("#addMaterialForm .lvIndex").value
        };

        //now edit quantity in purchase
        myDatabase.purchaseList.update(purchaseToDo, purchaseObjectStoreName, function (e) {
            addMaterialFlyout.hide();
            appBar.hide();
            addMaterialForm.reset();
            listView.selection.clear();

            dataList.setAt(purchaseToDo.lvIndex, purchaseToDo);
        });
        

    };

    this.cancelEdit = function (e) {
        e.preventDefault();

        addMaterialFlyout.hide();
        appBar.hide();
        addMaterialForm.reset();
        listView.selection.clear();
    };
}


function getValuesFromObjectStore(cropCyID)
{
    //get values for that crop cyclements
    myDatabase.purchaseList.getCycleList(resourceUseageObjectStoreName, cropCyID, function (e) {
        var resourceList = new WinJS.Binding.List(e);
        var newList = resourceList;

        /*for (var key in newList)
        {
            if (newList.hasOwnProperty(key))
            {
                var obj = newList[key];
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                    {
                        console.log(prop + " = " + obj[prop]);
                    }
                }
            }
        }*/


       /* for (var i = 0; i < newList.length; i++) //go through entire object store
        {
            var keys = Object.keys(resourceList.getItem(i)); //returns array of keys for this resource use entry
            for (var j = 0; j < keys.length; j++)
            {
                console.log("The value of this field is: " + resourceList.getItem(i)[keys[j]][name]);
            }
        } */
    });

   

}
