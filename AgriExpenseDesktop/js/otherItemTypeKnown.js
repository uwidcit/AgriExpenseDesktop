
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
   
    document.getElementById('inputType').value = localStorage.getItem("typeSelected");
    localStorage.setItem("typeSelected", "");
}

function ViewModel() {
    var
        listView = document.getElementById("otherPurchaseList").winControl,
        purchaseListView = document.getElementById("purchaseListID").winControl,
        addForm = document.getElementById("addForm"),
        editForm = document.getElementById("editForm"),
        self = this,
        purchaseDataList,
        dataList;

    this.init = function () {
        myDatabase.purchaseList.getList(otherPurchaseObjectStoreName, function (e) {
            dataList = new WinJS.Binding.List(e);

            listView.itemDataSource = dataList.dataSource;
         
        });

        myDatabase.purchaseList.getList(purchaseObjectStoreName, function (e) {
            purchaseDataList = new WinJS.Binding.List(e);

            purchaseListView.itemDataSource = purchaseDataList.dataSource;
         
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
            type: document.querySelector("#addForm .type").value,
            name: document.querySelector("#addForm .name").value,   
        };

        if (toDo.type == "Fertilizer") {
            myDatabase.purchaseList.add(toDo, otherFertilizerObjectStoreName, function (e) {
                dataList.push(e);
                addForm.reset();
            });
       
        }
        else if (toDo.type == "Chemical") {
            myDatabase.purchaseList.add(toDo, otherChemicalObjectStoreName, function (e) {
                dataList.push(e);
                addForm.reset();
            });
        }
        else if (toDo.type == "Planting Material") {
            myDatabase.purchaseList.add(toDo, otherPlantingMaterialObjectStoreName, function (e) {
                dataList.push(e);
                addForm.reset();
            });
        }
        else if (toDo.type == "Soil Amendment") {
            myDatabase.purchaseList.add(toDo, otherSoilAmendmentObjectStoreName, function (e) {
                dataList.push(e);
                addForm.reset();
            });
        }
        else if(toDo.type == "Other"){
            myDatabase.purchaseList.add(toDo, otherPurchaseObjectStoreName, function (e) {
                dataList.push(e);
                addForm.reset();
                window.location = "purchases.html";
            });
        }

    };


}
