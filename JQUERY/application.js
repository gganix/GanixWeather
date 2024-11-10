// para cambiar de secciones
$(document).ready(function () {
    $('.nav-link').click(function (e) {
        e.preventDefault();
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('.content').hide();
        const target = $(this).data('target');
        $(target).fadeIn();
        $('#weatherResult').empty(); // vacia por si hay cards generadas
        $('#weatherCards').empty();
    });
});


const apiKey = '82f9e371a8ee6adf0e59110eb8a882c2';


//Esta es la funcion que saca la latitud y longitud a partir de un nombre de una ciudad
function Geocoding() {
    //pilla la ciudad del input y vemos que no este vacio
    const cityName = $('#city').val().trim();

    if (cityName === "") {
        $('#result').text("Por favor, ingresa el nombre de una ciudad.");
        return;
    }

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    $.ajax({
        url: geoUrl,
        method: 'GET',
        success: function (geoResponse) {
            $('#result').text("");
            if (geoResponse.length > 0) { //esto es porque la api puede devolver varios resultados (esta limitado a 1 pero para asegurar)
                const { lat, lon } = geoResponse[0];
                ElTiempoActual(lat, lon); //genera card para el clima actual
                ElTiempo5Dias(lat, lon); //genera 4 cards de los proximos 4 dias
            } else {
                $('#result').text("No se encontró la ciudad especificada.");
            }
        },
        error: function () {
            $('#result').text("Hubo un error en la búsqueda. Intenta nuevamente.");
        }
    });
}

// para crear las cards
function cargarCardClima(dayData) {
    const minTemp = Math.min(...dayData.temps); //para pillar la temperatuda minima de un dia
    const maxTemp = Math.max(...dayData.temps); //para la maxima
    const icon = `https://openweathermap.org/img/wn/${dayData.weather.icon}@2x.png`;
    const dayOfWeek = new Date(dayData.date).toLocaleDateString('es-ES', { weekday: 'long' });

    //la card con los valores dados por la api
    return `
        <div class="col-md-2">
            <div class="card text-center mb-4 bg-dark text-white">
                <div class="card-body">
                    <h5 class="card-title">${dayOfWeek}</h5>
                    <img src="${icon}" alt="${dayData.weather.description}" class="card-img-top mb-2" style="height: 50px; width: auto;">
                    <p class="card-text">
                        <small><i class="fa-solid fa-temperature-arrow-up"></i> ${maxTemp}°C</small>&nbsp;&nbsp;
                        <small><i class="fa-solid fa-temperature-arrow-down"></i> ${minTemp}°C</small>
                    </p>
                </div>
            </div>
        </div>
    `;
}

//API 5 DIAS
function ElTiempo5Dias(lat, lon) {
    const tiempo5diasUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    $.ajax({
        url: tiempo5diasUrl,
        method: 'GET',
        success: function (weather5Response) {
            $('#result').text("");
            const dailyData = [];
            const cards = [];

            weather5Response.list.forEach(clima => { //la api devuelve 40 valores ya que devuelve un clima cada 3 horas y son 5 dias, por lo que seria 8 por dia, 40
                const day = new Date(clima.dt * 1000).toLocaleDateString();  //pillamos la fecha de mañana (ya que el dia de hoy lo hemos calculado con la otra api)

                let dayData = dailyData.find(d => d.date === day);  //vemos a en dailyData si existe un objeto con la misma fecha para evitar que se duplique el dia
                if (!dayData) { //si no existe ese dia, se crea
                    dayData = { date: day, temps: [], weather: clima.weather[0] };
                    dailyData.push(dayData);
                }
                dayData.temps.push(clima.main.temp_min, clima.main.temp_max); //vamos guardando todas las temperaturas del dia para luego pillar la maxima y la minima del dia
            });

            dailyData.slice(0, 5).forEach(dayData => { //se crean las cards
                cards.push(cargarCardClima(dayData));
            });

            $('#weatherCards').html(cards.join('')); //y se añaden aqui
        },
        error: function () {
            $('#result').text("No se pudo obtener el pronóstico.");
        }
    });
}

// para obtener y mostrar el clima ACTUAL
function ElTiempoActual(lat, lon) {
    const climaUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    $.ajax({
        url: climaUrl,
        method: 'GET',
        success: function (weatherResponse) {
            $('#result').text("");
            // Configuración actual del clima
            const { main, weather, wind, sys } = weatherResponse;
            const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

            $('#weatherResult').html(`
                <div class="bg-dark text-white p-4 rounded-3 mx-auto" style="max-width: 350px;">
                    <h4 class="text-center mb-3">${weather[0].description}</h4>
                    <div class="row align-items-center mb-3">
                        <div class="col-4 text-center">
                            <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Icono de clima" class="img-fluid" style="max-width: 100px;">
                        </div>
                        <div class="col-8 text-center">
                            <h2 class="fw-bold mb-1">${main.temp}°C</h2>
                            <p class="text-secondary mb-0"><i class="fa-solid fa-up-long"></i> ${main.temp_max}° <i class="fa-solid fa-down-long"></i> ${main.temp_min}°</p>
                        </div>
                    </div>
                    <div class="row text-center mb-3">
                        <div class="col"><i class="fas fa-temperature-half"></i><p><strong>${main.feels_like}°C</strong></p><p>Sensación Térmica</p></div>
                        <div class="col"><i class="fas fa-wind"></i><p><strong>${wind.speed} m/s</strong></p><p>Viento</p></div>
                        <div class="col"><i class="fas fa-droplet"></i><p><strong>${main.humidity}%</strong></p><p>Humedad</p></div>
                    </div>
                    <p class="text-center text-warning fw-bold mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                class="bi bi-sunrise-fill" viewBox="0 0 16 16">
                                <path
                                    d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707m11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0M11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10m13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                            </svg> ${sunrise}&nbsp;&nbsp;
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                                class="bi bi-sunset-fill" viewBox="0 0 16 16">
                                <path
                                    d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10m13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                            </svg> ${sunset}
                        </p>
                </div>
            `);
        },
        error: function () {
            $('#result').text("No se pudo obtener el clima actual.");
        }
    });
}

// Eventos
$('#btnBuscar').click(function () {
    Geocoding();
});

$('#getLocation').click(function () {
    if (navigator.geolocation) {
        navigator.geolocation.UbicacionActual(function (position) {
            const { latitude, longitude } = position.coords;
            ElTiempoActual(latitude, longitude);
            ElTiempo5Dias(latitude, longitude);
        });
    } else {
        $('#result').text("La geolocalización no es compatible con este navegador");
    }
});
