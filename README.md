# 🛸 MultiversoHub: Rick & Morty App
Una aplicación móvil educativa y de entretenimiento basada en el universo de la serie animada Rick and Morty. Permite a los usuarios explorar personajes, gestionar una lista de favoritos, acceder a detalles extendidos e interactuar con la app incluso sin conexión a internet.

## Integrantes
**MANUEL CAPORASO**

**CRISTIAN TESTASECA**

## 🚀 Cómo ejecutar el proyecto
Para poner en marcha la aplicación en tu entorno local, sigue estos sencillos pasos:

Clona este repositorio:

```
Bash
git clone https://github.com/ManuCaporaso/ITS-Rick-Morty-API-React-Native
cd MultiversoHub
```

### Instala las dependencias:

```
Bash
npm install
```

### Inicia la aplicación:
```
Bash
npx expo start
```

### Escanea el código QR con la aplicación Expo Go en tu dispositivo móvil o presiona w para ver la versión web.

## 🛠️ **Tecnologías utilizadas**

**React Native:** Marco de trabajo principal para el desarrollo de la aplicación móvil.

**Expo:** Conjunto de herramientas y servicios para construir aplicaciones de React Native.

**Expo Router:** Sistema de navegación basado en archivos para crear stacks y tabs de forma declarativa.

**Context API & useReducer:** Para el manejo de estado global de la lista de favoritos.

**AsyncStorage:** Para la persistencia local de los datos de favoritos y configuraciones.

**react-native-netinfo:** Para detectar el estado de la conexión a internet y gestionar el modo offline.

**Rick and Morty API:** La API pública utilizada para obtener los datos de los personajes.

## 🧠 **Decisiones de diseño e implementación**

**Arquitectura de navegación:** Se eligió Expo Router por su enfoque basado en archivos, que simplifica la creación de una navegación compleja con stacks y tabs de manera intuitiva y organizada.

**Gestión del estado:** Se optó por Context API y useReducer en lugar de librerías más pesadas. Esta combinación fue suficiente para manejar el estado global de los favoritos, manteniendo el proyecto ligero y con menos dependencias.

**Persistencia de datos:** AsyncStorage fue la opción ideal por su simplicidad. Es perfecto para guardar datos no relacionales y de pequeña escala, como la lista de favoritos.

**Modo offline:** La integración de react-native-netinfo permite una experiencia de usuario mejorada, mostrando una alerta clara cuando no hay conexión y permitiendo que la app funcione parcialmente con los datos en caché.

**Telemetría básica:** El registro de eventos con console.log() en un archivo dedicado (telemetry.ts) facilita la depuración y ofrece una visión inicial del comportamiento del usuario sin necesidad de herramientas externas.

## 🎓 **Lo que aprendimos**

**Manejo de rutas y navegación:** Comprendimos la poderosa simplicidad de Expo Router para construir navegadores complejos.

**Gestión de estado en React Native:** Reforzamos los conceptos de Context API y la importancia de la persistencia de datos con AsyncStorage para una experiencia de usuario fluida.

**Consumo de APIs:** Ganamos experiencia práctica en el manejo de llamadas a APIs públicas, paginación y gestión de estados de carga.

**Experiencia de usuario (UX) offline:** Aprendimos a anticipar y manejar la falta de conexión a internet para evitar errores y notificar adecuadamente al usuario.

**Buenas prácticas:** El proyecto sirvió para consolidar prácticas como la modularización del código (separando la lógica de la API, el estado y los hooks) y la documentación de las decisiones de diseño.
