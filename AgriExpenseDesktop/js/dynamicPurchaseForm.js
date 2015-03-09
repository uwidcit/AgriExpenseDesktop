function addFormDynamic() {

    var typeSelect = document.getElementById("purchaseTypeSelect");
    var nameSelect = document.getElementById("selectPurchaseName");
    var quantifierSelect = document.getElementById("selectPurchaseQuantifier");

    //remove previous entries from Name select box to put new ones if the Type is changed
    for (var i = nameSelect.options.length - 1; i >= 0; i--) {
        nameSelect.remove(i);
    }

    for (var i = quantifierSelect.options.length - 1; i >= 0; i--) {
        quantifierSelect.remove(i);
    }

    var select = document.getElementById("selectPurchaseName");

    if (typeSelect.value == "Fertilizer") {
        for (var i = 0; i < fertilizerArray.length; i++) {
            var opt = fertilizerArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        for (var i = 0; i < fertilizerQuantifierArray.length; i++) {
            var opt = fertilizerQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }


    }
    else if (typeSelect.value == "Chemical") {
        for (var i = 0; i < chemicalArray.length; i++) {
            var opt = chemicalArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        for (var i = 0; i < chemicalQuantifierArray.length; i++) {
            var opt = chemicalQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }
    else if (typeSelect.value == "Planting Material") {
        for (var i = 0; i < cropArray.length; i++) {
            var opt = cropArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        for (var i = 0; i < plantingMaterialQuantifierArray.length; i++) {
            var opt = plantingMaterialQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }
    else if (typeSelect.value == "Soil Amendment") {
        for (var i = 0; i < soilAmendmentArray.length; i++) {
            var opt = soilAmendmentArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        for (var i = 0; i < soilAmendmentQuantifierArray.length; i++) {
            var opt = soilAmendmentQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }

}

function editFormDynamic() {

    var typeSelect = document.getElementById("editFormTypeSelect");
    var nameSelect = document.getElementById("editFormPurchaseName");
    var quantifierSelect = document.getElementById("editFormQuantifier");

    //remove previous entries from Name select box to put new ones if the Type is changed
    for (var i = nameSelect.options.length - 1; i >= 0; i--) {
        nameSelect.remove(i);
    }

    for (var i = quantifierSelect.options.length - 1; i >= 0; i--) {
        quantifierSelect.remove(i);
    }

    var select = document.getElementById("editFormPurchaseName");

    if (typeSelect.value == "Fertilizer") {
        for (var i = 0; i < fertilizerArray.length; i++) {
            var opt = fertilizerArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        for (var i = 0; i < fertilizerQuantifierArray.length; i++) {
            var opt = fertilizerQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }


    }
    else if (typeSelect.value == "Chemical") {
        for (var i = 0; i < chemicalArray.length; i++) {
            var opt = chemicalArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        for (var i = 0; i < chemicalQuantifierArray.length; i++) {
            var opt = chemicalQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }
    else if (typeSelect.value == "Planting Material") {
        for (var i = 0; i < cropArray.length; i++) {
            var opt = cropArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        for (var i = 0; i < plantingMaterialQuantifierArray.length; i++) {
            var opt = plantingMaterialQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }
    else if (typeSelect.value == "Soil Amendment") {
        for (var i = 0; i < soilAmendmentArray.length; i++) {
            var opt = soilAmendmentArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            select.appendChild(el);
        }

        for (var i = 0; i < soilAmendmentQuantifierArray.length; i++) {
            var opt = soilAmendmentQuantifierArray[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            quantifierSelect.appendChild(el);
        }
    }

}