$(document).ready(function() {
    // Load existing data
    // loadDataIn();

    //////// Show initial message ////////

    var statusMessageContainer = $("header h5");

    displayMessage(
        statusMessageContainer,
        "App ready!"
    );

    //////// Input data validation ////////

    // Age must be 19 years or more
    var ageField = $("#input-age");
    var minAge = 19;
    var ageErrorMessage = "Age must be 19 years or more";
    checkIfGreaterThan(
        ageField,
        minAge,
        ageErrorMessage,
        statusMessageContainer
    );
    
    // Initial weight mus be 0 or more
    var weightField = $('#input-weight');
    var minWeight = 0;
    var weightErrorMessage = "Weight must be 0 or more";
    checkIfGreaterThan(
        weightField,
        minWeight,
        weightErrorMessage,
        statusMessageContainer
    );

    // Height must be 0 or more
    var heightField = $('#input-height');
    var minHeight = 0;
    var heightErrorMessage = "Height must be 0 or more";
    checkIfGreaterThan(
        heightField,
        minHeight,
        heightErrorMessage,
        statusMessageContainer
    );

    // Time to Project must be 0 or more
    var timeField = $('#input-time');
    var minTime = 0;
    var timeErrorMessage = "Time must be 0 or more";
    checkIfGreaterThan(
        timeField,
        minTime,
        timeErrorMessage,
        statusMessageContainer
    );

    // Weight Loss Rate must be 0 or more
    var rateField = $('#input-rate');
    var minRate = 0;
    var rateErrorMessage = "Loss Rate must be 0 or more";
    checkIfGreaterThan(
        rateField,
        minRate,
        rateErrorMessage,
        statusMessageContainer
    );

    // Energy Deficit must be 0 or more
    var energyField = $('#input-energy');
    var minEnergy = 0;
    var energyErrorMessage = "Energy Deficit must be 0 or more";
    checkIfGreaterThan(
        energyField,
        minEnergy,
        energyErrorMessage,
        statusMessageContainer
    );

    //////// Change units based on selection ////////

    $('#select-units').on(
        'change',
        function() {
            // Code to execute when the select option changes
            var selectedValue = $(this).val();
            if (selectedValue == 'imperial') {
                $('#label-weight-unit').text("lbs")
                $('#label-rate-unit').text("lbs")
                $('#label-height-unit').text("inch")
            } else {
                $('#label-weight-unit').text("kg")
                $('#label-rate-unit').text("kg")
                $('#label-height-unit').text("cm")
            };
        }
    );

    //////// Handle form submission ////////

    $('#data-form').on(
        'submit',
        function(event) {
        event.preventDefault();
        var form_data = $('#data-form').serializeArray();
        var formInputIsValid = [];
        console.log(form_data);
        for (var input in form_data){
            var element=$("#input-"+form_data[input]['name']);
            var select_element=$("#select-"+form_data[input]['name']);
            if (element.hasClass("input-valid") || select_element.hasClass("input-valid")) {
                formInputIsValid.push(true);
                console.log("Element Valid: "+form_data[input]['name'])
            }
            else {
                formInputIsValid.push(false);
                console.log("Element Invalid: "+form_data[input]['name'])
            }
        };

        const sex = $('#select-sex').val();
        const age = $('#input-age').val();
        const weight = $('#input-weight').val();
        const height = $('#input-height').val();
        const units = $('#select-units').val();
        const weeks = $('#input-time').val();
        const weightLossRate = $('#input-rate').val();
        const energyDeficit = $('#input-energy').val();

        console.log(formInputIsValid)
        const formIsValid = formInputIsValid.every(value => value === true);
        console.log(formIsValid)

        if (formIsValid) {
            $.ajax({
                url: '/model',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    sex: sex,
                    age: age,
                    weight: weight,
                    height: height,
                    units: units,
                    weeks: weeks,
                    weight_loss_rate: weightLossRate,
                    energy_deficit: energyDeficit
                }),
                success: function(response) {
                    console.log("Server response");
                    console.log(response);
                    serverMessage = `${response.message}: ${response.status}`;
                    displayMessage(statusMessageContainer, serverMessage);
                }
            });
        }
        else {
            displayMessage(statusMessageContainer, "Data not valid")
        };
    });

    //////// Handle form clearing ////////

    $('.clear').on(
        'click',
        function(event) {
        event.preventDefault();
        $.ajax({
            url: '/reset',
            type: 'POST',
            contentType: 'application/json',
            success: function(response) {
                console.log("Server response");
                console.log(response);
                serverMessage = `${response.message}: ${response.status}`;
                displayMessage(statusMessageContainer, serverMessage);
                // Clear form fields
                $('#input-age').val('');
                $('#input-weight').val('');
                $('#input-height').val('');
                $('#input-time').val('');
                $('#input-rate').val('2');
                $('#input-energy').val('1000');
            }
        });
    });
});

//////// Utility functions ////////
function checkIfGreaterThan (
    field,
    minValue,
    errorMessage,
    messageContainer) {
    field.on(
        'change',
        function() {
        var input = $(this);
        var inputValue = input.val();

        if(inputValue >= minValue) {
            input.removeClass("input-invalid").addClass("input-valid");
            messageContainer.removeClass("input-invalid");
            displayMessage(messageContainer, '');   
        }
        else {
            input.removeClass("input-valid").addClass("input-invalid");
            messageContainer.addClass("input-invalid");
            // Append the error message and show
            messageContainer.val('');
            messageContainer.text(errorMessage);
            messageContainer.animate(
                {"opacity": 100},
                700
            );
            // Remove the error message on focus
            input.on("focus", function() {
                messageContainer.removeClass("input-invalid");
                displayMessage(messageContainer, '');
            });
        };
    });
};

function displayMessage (messageContainer, message) {
    messageContainer.val('');
    messageContainer.text(message);

    messageContainer.animate(
        {"opacity": 100},
        700
    );

    messageContainer.animate(
        {"opacity": 0},
        400
    );
};

// function loadDataIn() {
//     $.ajax({
//         url: '/data-in',
//         type: 'GET',
//         success: function(data_in) {
//             data_in.forEach(item => {
//                 $('#dataTable tbody').append(`<tr><td>${item.weight}</td><td>${item.height}</td><td>${item.age}</td><td>${item.time}</td></tr>`);
//             });
//         }
//     });
// }

// function loadDataOut() {
//     $.ajax({
//         url: '/data-out',
//         type: 'GET'
//         })
// }