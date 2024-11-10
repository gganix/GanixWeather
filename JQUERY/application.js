$(document).ready(function () {
    // para cambiar de secciones
    $('.nav-link').click(function (e) {
        e.preventDefault();
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('.content').hide();
        const target = $(this).data('target');
        $(target).fadeIn();
        $('#weatherResult').empty();
        $('#weatherCards').empty();
    });

    const apiKey = '82f9e371a8ee6adf0e59110eb8a882c2';


    //para cambiar idioma
    let idiomaActual = 'es';

    function cambiarIdioma() {
        idiomaActual = idiomaActual == 'es' ? 'en' : 'es'; //cambia al idioma contrario

        // todos los texto (menos lo de la api) 
        if (idiomaActual === 'en') {
            $('.titulo').text('Welcome to Your Weather App');
            $('.titulo-secundario').text('Search Weather by City');
            $('.intro-section p').text('Explore the current weather and forecasts at your location or any city in the world.');
            $('#city').attr('placeholder', 'Eg: London');
            $('#searchForm label').text('Enter the city name:');
            $('#getLocation').text('Allow access to your location'); 
            $('#btnBuscar').text('Search Weather');
            $('#languageToggle').html('<i class="fas fa-globe"></i> Español');
        } else {
            $('.titulo').text('Bienvenido a Tu Weather App');
            $('.titulo-secundario').text('Buscar Clima por Ciudad');
            $('.intro-section p').text('Explora el clima actual y los pronósticos en tu ubicación o cualquier ciudad del mundo.');
            $('#city').attr('placeholder', 'Ej: Madrid');
            $('#searchForm label').text('Introduce el nombre de la ciudad:');
            $('#getLocation').text('Permite acceso a tu ubicación');  
            $('#btnBuscar').text('Buscar Clima');
            $('#languageToggle').html('<i class="fas fa-globe"></i> English');
        }

        // para que cargue
        $('.content').hide();
        $('.content.active').show();
    }

    // cambiar de idioma al pulasr boton
    $('#languageToggle').click(function (e) {
        e.preventDefault();
        cambiarIdioma();
        $('.content').hide(); 
        $('.content.active').fadeIn();
    });

    //  para cambiar la url de la API con el idioma 
    function ajustarUrlConIdioma(url) {
        return `${url}&lang=${idiomaActual}`;
    }

    //Esta es la funcion que saca la latitud y longitud a partir de un nombre de una ciudad
    function Geocoding() {
        //pilla la ciudad del input y vemos que no este vacio
        const cityName = $('#city').val().trim();

        if (cityName === "") {
            $('#result').text(idiomaActual === 'es' ? "Por favor, ingresa el nombre de una ciudad." : "Please enter a city name.");
            return;
        }

        const geoUrl = ajustarUrlConIdioma(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`);

        $.ajax({
            url: geoUrl,
            method: 'GET',
            success: function (geoResponse) {
                $('#result').text("");
                if (geoResponse.length > 0) { //esto es porque la api puede devolver varios resultados (esta limitado a 1 pero para asegurar)
                    const { lat, lon } = geoResponse[0];
                    ElTiempoActual(lat, lon);  //genera card para el clima actual
                    ElTiempo5Dias(lat, lon); //genera las cards de los proximos dias
                } else {
                    $('#result').text(idiomaActual === 'es' ? "No se encontró la ciudad especificada" : "City not found");
                }
            },
            error: function () {
                $('#result').text(idiomaActual === 'es' ? "Hubo un error con la búsqueda. Intenta otra vez" : "There was an error with the search. Please try again.");
            }
        });
    }

    // para crear las cards
    function cargarCards(dayData) {
        const minTemp = Math.min(...dayData.temps); //para pillar la temperatuda minima de un dia
        const maxTemp = Math.max(...dayData.temps); //para la maxima
        const icon = `https://openweathermap.org/img/wn/${dayData.weather.icon}@2x.png`;
        const dayOfWeek = new Date(dayData.date).toLocaleDateString(idiomaActual === 'es' ? 'es-ES' : 'en-US', { weekday: 'long' });

        //la card con los valores dados por la api
        return `
            <div class="col-md-2">
                <div class="card text-center mb-4 text-white">
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
        const tiempo5diasUrl = ajustarUrlConIdioma(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

        $.ajax({
            url: tiempo5diasUrl,
            method: 'GET',
            success: function (weather5Response) {
                $('#result').text("");
                const dia = [];
                const cards = [];

                weather5Response.list.forEach(forecast => { //la api devuelve 40 valores ya que devuelve un clima cada 3 horas y son 5 dias, por lo que seria 8 por dia, 40
                    const day = new Date(forecast.dt * 1000).toISOString().split('T')[0]; //pillamos la fecha de mañana (ya que el dia de hoy lo hemos calculado con la otra api)

                    let datosDia = dia.find(d => d.date === day); //vemos si existe un objeto con la misma fecha para evitar que se duplique el dia
                    if (!datosDia) { //si no existe ese dia, se crea
                        datosDia = { date: day, temps: [], weather: forecast.weather[0] };
                        dia.push(datosDia);
                    }
                    datosDia.temps.push(forecast.main.temp_min, forecast.main.temp_max); //vamos guardando todas las temperaturas del dia para luego pillar la maxima y la minima del dia
                });

                dia.slice(1, 5).forEach(dayData => { //se crean las cards
                    cards.push(cargarCards(dayData));
                });

                $('#weatherCards').html(cards.join('')); //y se añaden aqui
            },
            error: function () {
                $('#result').text(idiomaActual === 'es' ? "No se pudo obtener el pronóstico." : "Unable to get the forecast.");
            }
        });
    }

    // para obtener y mostrar el clima ACTUAL
    function ElTiempoActual(lat, lon) {
        const climaUrl = ajustarUrlConIdioma(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

        $.ajax({
            url: climaUrl,
            method: 'GET',
            success: function (weatherResponse) {
                $('#result').text("");

                const { main, weather, wind, sys } = weatherResponse;
                const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
                const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

                $('#weatherResult').html(`
                    <div class="card text-white p-4 rounded-3 mx-auto" style="max-width: 350px;">
                        <h4 class="text-center mb-3">${weather[0].description}</h4>
                        <div class="row align-items-center mb-3">
                            <div class="col-4 text-center">
                                <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Icono de clima" class="img-fluid" style="max-width: 100px;">
                            </div>
                            <div class="col-8 text-center">
                                <h2 class="fw-bold mb-1">${main.temp}°C</h2>
                                <p class="text-white mb-0"><i class="fa-solid fa-up-long"></i> ${main.temp_max}° <i class="fa-solid fa-down-long"></i> ${main.temp_min}°</p>
                            </div>
                        </div>
                        <div class="row text-center">
                            <div class="col">
                                <p><i class="fa-solid fa-wind"></i> Wind: ${wind.speed} m/s</p>
                                <p><i class="fa-solid fa-sun"></i> Sunrise: ${sunrise}</p>
                                <p><i class="fa-solid fa-moon"></i> Sunset: ${sunset}</p>
                            </div>
                        </div>
                    </div>
                `);
            },
            error: function () {
                $('#result').text(idiomaActual === 'es' ? "No se pudo obtener el clima." : "Unable to get weather.");
            }
        });
    }

    $('#btnBuscar').click(function (e) {
        e.preventDefault();
        Geocoding();
    });

    // Obtener la ubicación cuando se da permiso
    $('#getLocation').click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                ElTiempoActual(lat, lon);
                ElTiempo5Dias(lat, lon);
            });
        }
    });
});
