var myDatabase = myDatabase || {};


//(function (myDatabase) {
    "use strict";

    myDatabase.data = (function () {
        var indexedDB = window.indexedDB;

        var init = function (success) {
            var request = indexedDB.open(dbName, 6);

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

            request.onupgradeneeded = function (e) {
                var db = e.target.result;

                db.deleteObjectStore(purchaseObjectStoreName);
                db.deleteObjectStore(cycleObjectStoreName);
                db.deleteObjectStore(resourceUseageObjectStoreName);
                
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


            };
        };

        return {
            init: init
        };

    })();

    myDatabase.purchaseList = (function () {

        var getList = function (oStoreName, success) {

        //    if ((oStoreName == purchaseObjectStoreName) || (oStoreName == cycleObjectStoreName)) {
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
              //      }
                };

            }

        };

        var getCycleList = function (oStoreName, cropCyId, success) {

           
            var
                list = [],
                transaction = myDatabase.data.db.transaction(oStoreName),
                store = transaction.objectStore(oStoreName);

            store.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    if (cursor.value.cropCycleID == cropCyId) {  //filter by cropcycle id
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
            if (oStoreName == "purchaseObjectStore") {
               
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
            else if (oStoreName == "cycleObjectStore") {
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

            else if (oStoreName == "resourceObjectStore") {
                
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
                        useCost: toDo.useCost
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

