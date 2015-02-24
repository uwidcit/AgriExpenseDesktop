
function onAddPurchasesPageLoad() {
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
        appBar = document.getElementById("appBar").winControl,
        addMaterialFlyout = document.getElementById("addMaterialFlyout").winControl,
        addMaterialForm = document.getElementById("addMaterialForm"),
        self = this,
        dataList;

    this.init = function ()
    {
        myDatabase.purchaseList.getList(purchaseObjectStoreName, function (e)
        {
            dataList = new WinJS.Binding.List(e);

            listView.itemDataSource = dataList.dataSource;
            listView.onselectionchanged = self.selectionChanged;
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


    this.submitEdit = function (e) {
        e.preventDefault();

      

        var cropCycleIdFromStorage = localStorage.getItem("cropCycleId");
        var quantity = document.querySelector("#addMaterialForm .quantity").value;
        var cost = document.querySelector("#addMaterialForm .cost").value;
        var amountToAdd = document.querySelector("#addMaterialForm .amountToAdd").value;
        var useCost = ((quantity / cost) * amountToAdd);

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

        console.log('id is ' + toDo.purchaseID);
        console.log('type is ' + toDo.resourceType);
        console.log('name is ' + toDo.resourceName);
        console.log('quantifier is ' + toDo.quantifier);
        console.log('cost is ' + toDo.cost);
        console.log('quantity is ' + quantity);
        console.log('amount to add is ' + toDo.amountToAdd);
        console.log('use cost is ' + toDo.useCost);

        //Add to ruList, edit quantity in purchaseList
        

      /*  myDatabase.purchaseList.add(toDo, resourceUseageObjectStoreName, function (e) {
            dataList.push(e);
            addMaterialFlyout.hide();
            appBar.hide();
            addMaterialForm.reset();
            listView.selection.clear();
            getValuesFromObjectStore();

        }); */

     /*   myDatabase.purchaseList.update(toDo, purchaseObjectStoreName, function (e) {
            addMaterialFlyout.hide();
            appBar.hide();
            addMaterialForm.reset();
            listView.selection.clear();

            dataList.setAt(toDo.lvIndex, toDo);
        }); */
    };

    this.cancelEdit = function (e) {
        e.preventDefault();

        addMaterialFlyout.hide();
        appBar.hide();
        addMaterialForm.reset();
        listView.selection.clear();
    };
}


function getValuesFromObjectStore()
{
    myDatabase.purchaseList.getList(resourceUseageObjectStoreName, function (e) {
        var resourceList = new WinJS.Binding.List(e);
        for (var i = 0; i < resourceList.length; i++)
        {
            console.log(resourceList.id);
           
        }
    });
}
