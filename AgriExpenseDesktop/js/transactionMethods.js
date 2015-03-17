var myDatabase = myDatabase || {};


//(function (myDatabase) {
    "use strict";

    myDatabase.data = (function () {
        var indexedDB = window.indexedDB;

        var init = function (success) {
            var request = indexedDB.open(dbName, 16);

            request.onsuccess = function () {
                myDatabase.data.db = request.result;
                success();
            };

            request.onerror = function (event) {
                console.log(event);
            };

            request.onblocked = function (event) {
                console.log(event);
            };

            request.onupgradeneeded = function (e) { //runs when a new instance of the db is created
                var db = e.target.result;

                db.deleteObjectStore(purchaseObjectStoreName);
                db.deleteObjectStore(cycleObjectStoreName);
                db.deleteObjectStore(resourceUseageObjectStoreName);
                db.deleteObjectStore(labourObjectStoreName);
                db.deleteObjectStore(historicalLabourStoreName);
                db.deleteObjectStore(otherPurchaseObjectStoreName);
                db.deleteObjectStore(otherFertilizerObjectStoreName);
                db.deleteObjectStore(otherChemicalObjectStoreName);
                
                var purchaseStore = db.createObjectStore(purchaseObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var cycleStore = db.createObjectStore(cycleObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var resourceUseStore = db.createObjectStore(resourceUseageObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var labourStore = db.createObjectStore(labourObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var historicalLabourStore = db.createObjectStore(historicalLabourStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherPurchaseStore = db.createObjectStore(otherPurchaseObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherFertlizerStore = db.createObjectStore(otherFertilizerObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherChemicalStore = db.createObjectStore(otherChemicalObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherPlantingMaterialStore = db.createObjectStore(otherPlantingMaterialObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });

                var otherSoilAmendmentStore = db.createObjectStore(otherSoilAmendmentObjectStoreName, {
                    keyPath: "id",
                    autoIncrement: true
                });
               

                cycleStore.createIndex("name", "name", {
                    unique: false
                }); 

                purchaseStore.createIndex("name", "name", {
                    unique: false
                });

                resourceUseStore.createIndex("name", "name", {
                    unique: false
                });

                labourStore.createIndex("name", "name", {
                    unique: false
                });

                historicalLabourStore.createIndex("name", "name", {
                    unique: false
                });

                otherPurchaseStore.createIndex("name", "name", {
                    unique: false
                });

                otherFertlizerStore.createIndex("name", "name", {
                    unique: false
                });

                otherChemicalStore.createIndex("name", "name", {
                    unique: false
                });

                otherPlantingMaterialStore.createIndex("name", "name", {
                    unique: false
                });

                otherSoilAmendmentStore.createIndex("name", "name", {
                    unique: false
                });

                

            };
        };

        return {
            init: init
        };

    })();

    

    myDatabase.purchaseList = (function () {

        var getList = function (oStoreName, success) {       
                var
                    list = [],
                    transaction = myDatabase.data.db.transaction(oStoreName),
                    store = transaction.objectStore(oStoreName);

                store.openCursor().onsuccess = function (e) {
                    var cursor = e.target.result;

                    if (cursor) {
                        if (cursor.value.quantity != '0') {  //check if the quantity remaining (in purchases) is more than 0, then add to the list
                            list.push(cursor.value); //add to list
                        }
                        cursor.continue();
                    }
                    else {
                        success(list);
                };

            }

        };

        var getCycleList = function (oStoreName, materialType, cropCyId, success) {
         
            var
                list = [],
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName);

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    if ((cursor.value.cropCycleID == cropCyId) && (cursor.value.resourceType == materialType)) {  //filter by cropcycle id
                        list.push(cursor.value); //add to list
                    }
                    cursor.continue();
                }
                else {
                    success(list);
                    
                };

            }
        };

       

        var get = function (oStoreName, key, success) {
            var
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName),
                request = store.get(oStoreName, key);

            request.onsuccess = function (e) {
                success(e.target.result);
            };
        };


        var add = function (toDo, oStoreName, success) {
            if (oStoreName == purchaseObjectStoreName) {
               
                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        type: toDo.type,
                        name: toDo.name,
                        quantifier: toDo.quantifier,
                        quantity: toDo.quantity,
                        cost: toDo.cost
                    });
            }
            else if (oStoreName == cycleObjectStoreName) {
                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        name: toDo.name,
                        crop: toDo.crop,
                        typeOfLand: toDo.typeOfLand,
                        quantity: toDo.quantity,
                        startDate: toDo.startDate
                    });
            }

            else if (oStoreName == resourceUseageObjectStoreName) {
                
                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        purchaseID: toDo.purchaseID,
                        resourceName: toDo.resourceName,
                        cropCycleID: toDo.cropCycleID,
                        resourceType: toDo.resourceType,
                        amountToAdd: toDo.amountToAdd,
                        quantifier: toDo.quantifier,
                        cost: toDo.cost,
                        useCost: toDo.useCost,
                        datePurchased: toDo.datePurchased
                    });
            }

            else if (oStoreName == labourObjectStoreName) {

                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        personName: toDo.personName,
                        paymentPlan: toDo.paymentPlan,
                        time: toDo.time,
                        cost: toDo.cost,
                        cycleID: toDo.cycleID
                    });
            }

            else if (oStoreName == historicalLabourStoreName) {
                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        name: toDo.name
                    });
            }

            else if (oStoreName == otherPurchaseObjectStoreName) {

                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        type: toDo.type,
                        name: toDo.name,
                        quantifier: toDo.quantifier,
                        quantity: toDo.quantity,
                        cost: toDo.cost
                    });
            }

            else if (oStoreName == otherFertilizerObjectStoreName) {

                var
                    transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                    store = transaction.objectStore(oStoreName),
                    request = store.add({
                        type: "Fertilizer",
                        name: toDo.name
                    });
            }

            else if (oStoreName == otherChemicalObjectStoreName) {
                var
                   transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                   store = transaction.objectStore(oStoreName),
                   request = store.add({
                       type: "Chemical",
                       name: toDo.name
                   });
            }

            else if (oStoreName == otherPlantingMaterialObjectStoreName) {
                var
                   transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                   store = transaction.objectStore(oStoreName),
                   request = store.add({
                       type: "Planting Material",
                       name: toDo.name
                   });
            }

            else if (oStoreName == otherSoilAmendmentObjectStoreName) {
                var
                   transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                   store = transaction.objectStore(oStoreName),
                   request = store.add({
                       type: "Soil Amendment",
                       name: toDo.name
                   });
            }

               
            



            request.onsuccess = function (e) {
                toDo.id = e.target.result;
                success(toDo);
            };
        };


        var update = function (toDo, oStoreName, success) {

            if (oStoreName == purchaseObjectStoreName) {
                var
                  transaction = myDatabase.data.db.transaction(purchaseObjectStoreName, "readwrite"),
                  store = transaction.objectStore(purchaseObjectStoreName),
                  request = store.put({
                      id: parseInt(toDo.id, 10),
                      type: toDo.type,
                      name: toDo.name,
                      quantifier: toDo.quantifier,
                      quantity: toDo.quantity,
                      cost: toDo.cost
              });

                request.onsuccess = function () {
                    success(toDo);
                };
            }

            else if (oStoreName == cycleObjectStoreName) {
                var
                  transaction = myDatabase.data.db.transaction(cycleObjectStoreName, "readwrite"),
                  store = transaction.objectStore(cycleObjectStoreName),
                  request = store.put({
                      id: parseInt(toDo.id, 10),
                      name: toDo.name,
                      crop: toDo.crop,
                      typeOfLand: toDo.typeOfLand,
                      quantity: toDo.quantity,
                      startDate: toDo.startDate
              });

                request.onsuccess = function () {
                    success(toDo);
                };
            }

            else if (oStoreName == otherPurchaseObjectStoreName) {
                var
                  transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                  store = transaction.objectStore(oStoreName),
                  request = store.put({
                      id: parseInt(toDo.id, 10),
                      name: toDo.name,
                      quantifier: toDo.quantifier,
                      quantity: toDo.quantity,
                      cost: toDo.cost
                  });

                request.onsuccess = function () {
                    success(toDo);
                };
            }

          
        };

        var remove = function (key, oStoreName, success) {
            var
                transaction = myDatabase.data.db.transaction(oStoreName, "readwrite"),
                store = transaction.objectStore(oStoreName),
                request = store.delete(key);

            request.onsuccess = function () {
                success();
            };
        };

        return {
            get: get,
            getList: getList,
            getCycleList: getCycleList,
            add: add,
            update: update,
            remove: remove
        };

    })();

//})(myDatabase);

