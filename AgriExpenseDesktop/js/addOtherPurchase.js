
function onPurchasesPageLoad() {
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
    viewModel.init();

    document.getElementById("addForm").addEventListener("submit", viewModel.submitAdd, false);
    document.getElementById('inputName').value = localStorage.getItem("otherNameSelected");
    localStorage.setItem("otherNameSelected", "");
}

function ViewModel() {
    var
        listView = document.getElementById("purchaseList").winControl,
        otherPurchaseListView = document.getElementById("otherPurchaseList").winControl,
        quantifierListView = document.getElementById("quantifierList").winControl,
        addForm = document.getElementById("addForm"),
        self = this,
        purchaseDataList,
        quantifierDataList,
        dataList;

    this.init = function () {

        newFertilizerArray.sort();
        newChemicalArray.sort();
        newCropArray.sort();
        newSoilAmendmentArray.sort();
        otherPurchaseArray.sort();
        totalQuantifierArray.sort();

        myDatabase.purchaseList.getList(otherPurchaseObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);
        });

        myDatabase.purchaseList.getList(purchaseObjectStoreName, function (e) {
            purchaseDataList = new WinJS.Binding.List(e);
            purchaseDataList.reverse();

            listView.itemDataSource = purchaseDataList.dataSource;
       
        });

        myDatabase.purchaseList.getList(otherQuantifierObjectStoreName, function (e) {
            quantifierDataList = new WinJS.Binding.List(e);

            quantifierListView.itemDataSource = quantifierDataList.dataSource;

            quantifierListView.selection.selectAll();

            var selectionCount = quantifierListView.selection.count();

            if (selectionCount > 0) {
                quantifierListView.selection.getItems().then(function (items) {
                    items.forEach(function (item) {
                        var name = item.data.name;
                        totalQuantifierArray.push(name);
                    });
                });
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

  


    this.submitAdd = function (e) {
        e.preventDefault();

        var toDo = {
            type: "Other",
            name: document.querySelector("#addForm .name").value,
            quantifier: document.querySelector("#addForm .quantifier").value,
            quantity: document.querySelector("#addForm .quantity").value,
            cost: document.querySelector("#addForm .cost").value,
            amountRemaining: document.querySelector("#addForm .quantity").value
        };

        var quantifierToDo = {
            name: toDo.quantifier
        }

        myDatabase.purchaseList.add(toDo, otherPurchaseObjectStoreName, function (e) {
            dataList.push(e);
            addForm.reset();
        });

        //also add to PurchaseList with type OTHER
        myDatabase.purchaseList.add(toDo, purchaseObjectStoreName, function (e) {
            purchaseDataList.push(e);
            addForm.reset();
            window.location="purchases.html"
        });

    };

}
