# 🌤 Aplicación del Clima

Bienvenido a **Weather is sweet yeah**, una aplicación de una sola página (SPA) para consultar el clima actual y el pronóstico de los próximos días en cualquier ciudad o en tu ubicación actual. Desarrollada en **HTML**, **SCSS** y **jQuery** utilizando la [API de OpenWeather](https://openweathermap.org/api) para la obtención de datos meteorológicos.

---

## 👀 Demo
Puedes ver una demo en vivo en GitHub Pages visitando [Weather Ganix en GitHub Pages](https://gganix.github.io/GanixWeather/).

## 🌟 Características

- Consulta el clima actual y el pronóstico en una interfaz simple y atractiva.
- Búsqueda de clima por nombre de ciudad o usando tu geolocalización.
- Visualización de temperatura mínima y máxima, iconos de clima, velocidad del viento, humedad y sensación térmica.
- Diseño responsivo, pensado en una experiencia óptima tanto para dispositivos móviles como de escritorio.

---

## 🛠️ Tecnologías Utilizadas

- **HTML** para la estructura de la aplicación.
- **SCSS** como preprocesador de CSS, facilitando el uso de variables y mixins.
- **jQuery** para manejar las interacciones y realizar llamadas a la API.
- **OpenWeather API** para obtener datos meteorológicos actuales y pronósticos.
- **Bootstrap 5** para el diseño responsivo.

> **Warning**  
> Asegúrate de utilizar una API Key válida de [OpenWeather](https://openweathermap.org/api) en el archivo `application.js`.

## 📁 Estructura de Archivos

- **index.html**: Estructura de la aplicación, incluyendo el menú y las secciones de inicio, búsqueda y localización.
- **styles.scss**: Estilos de la aplicación, incluyendo colores y fuentes personalizadas.
- **application.js**: Código jQuery que maneja la lógica de la aplicación, incluyendo las llamadas a la API y la renderización de datos.

---

## 🚀 Instalación y Ejecución

1. Clona este repositorio.
   ```bash
   git clone https://github.com/gganix/GanixWeather.git

2. Navega hasta la carpeta del proyecto y abre el archivo `index.html` en tu navegador.

> **Info**  
> La aplicación requiere una conexión a Internet para cargar los recursos de Bootstrap y Font Awesome, así como para hacer las solicitudes a la API de OpenWeather.

## 🌍 Funcionalidades Clave

1. **Cambio entre secciones**  
   Navega entre las secciones "Inicio", "Buscar" y "Localización" sin recargar la página, gracias al uso de jQuery.

2. **Consulta por Ciudad**  
   En la sección de "Buscar", introduce el nombre de una ciudad y presiona "Buscar Clima" para obtener el pronóstico de los próximos días.

3. **Geolocalización**  
   La sección de "Localización" permite obtener automáticamente el clima de tu ubicación actual si otorgas permisos de geolocalización.

4. **Renderizado Dinámico de Datos**  
   Las temperaturas, iconos, y otros datos son renderizados dinámicamente mediante llamadas AJAX y se actualizan automáticamente al cambiar de sección.

> **Info**  
> Este proyecto fue desarrollado como parte de un ejercicio educativo para implementar APIs y SPA.

---

