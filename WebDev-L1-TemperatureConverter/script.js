function convertTemperature(){

    let temperature = document.getElementById("temperature").value;
    let unit = document.getElementById("unit").value;

    let error = document.getElementById("error");


    // Clear previous error
    error.innerHTML = "";


    // Check numeric input
    if(temperature === "" || isNaN(temperature)){

        error.innerHTML = "Please enter a valid numeric temperature.";

        return;
    }


    temperature = Number(temperature);



    let celsius;
    let fahrenheit;
    let kelvin;



    // Convert based on selected unit

    if(unit === "celsius"){

        celsius = temperature;

        fahrenheit = (temperature * 9/5) + 32;

        kelvin = temperature + 273.15;

    }


    else if(unit === "fahrenheit"){

        fahrenheit = temperature;

        celsius = (temperature - 32) * 5/9;

        kelvin = celsius + 273.15;

    }


    else if(unit === "kelvin"){

        kelvin = temperature;

        celsius = temperature - 273.15;

        fahrenheit = (celsius * 9/5) + 32;

    }





    // Absolute zero validation

    if(celsius < -273.15){

        error.innerHTML = 
        "Temperature cannot be below absolute zero (-273.15°C).";

        return;

    }



    // Display results

    document.getElementById("celsius").innerHTML =
    "Celsius: " + celsius.toFixed(2) + " °C";


    document.getElementById("fahrenheit").innerHTML =
    "Fahrenheit: " + fahrenheit.toFixed(2) + " °F";


    document.getElementById("kelvin").innerHTML =
    "Kelvin: " + kelvin.toFixed(2) + " K";


}