# SIHELPMS

Extensión para navegador orientada a facilitar tareas administrativas dentro de **SISEEMS**. El popup permite introducir CURPs o números de control y ejecutar acciones sobre la pestaña activa de SISEEMS.

> El proyecto se encuentra en desarrollo. Algunas acciones del popup todavía funcionan como prototipos y únicamente registran la acción solicitada.

## Funcionalidades

- **Descargar títulos:** busca cada CURP en la tabla de titulaciones de la página activa y descarga el PDF correspondiente.
- **Obtener información:** interfaz preparada para consultar los estados de estudiantes y exportarlos a Excel.
- **Buscar alumnos:** interfaz preparada para localizar alumnos.
- **Importar Excel:** control visual preparado para cargar información desde un archivo de Excel.
- **Registro de actividad:** muestra en el popup el progreso de la operación, los CURPs no encontrados y los errores de descarga.

### Descarga de títulos

La descarga actual funciona de la siguiente manera:

1. Se introducen uno o varios CURPs en el campo de texto, uno por línea.
2. La extensión consulta la pestaña activa.
3. Busca los CURPs en las filas de la tabla de titulaciones.
4. Obtiene el enlace generado por `imprimir_certificado_digital611`.
5. Descarga cada documento como `<CURP>.pdf`, dejando dos segundos entre descargas.

La pestaña activa debe tener una tabla compatible con la estructura de SISEEMS y la sesión debe estar autenticada.

## Tecnologías

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [WXT](https://wxt.dev/), para la creación de extensiones multiplataforma
- Vite y `vue-tsc`
- Tipografía [Comic Neue](https://fonts.google.com/specimen/Comic+Neue) para la interfaz

## Requisitos

- Node.js 18 o superior
- npm
- Una cuenta con acceso a [SISEEMS](https://siseems.sems.gob.mx/)
- Google Chrome o Mozilla Firefox para cargar la extensión durante el desarrollo

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/RainBWP/SIHELPMS.git
cd Herramientas-Para-SISEEMS
npm install
```

## Desarrollo

Para iniciar el modo de desarrollo en Chrome:

```bash
npm run dev
```

Para Firefox:

```bash
npm run dev:firefox
```

Después de iniciar WXT, carga la carpeta generada que indique la terminal desde la página de extensiones del navegador:

- Chrome: `chrome://extensions`, activa **Modo desarrollador** y elige **Cargar descomprimida**.
- Firefox: abre `about:debugging`, selecciona **Este Firefox** y pulsa **Cargar complemento temporal**.

## Compilación y paquetes

```bash
# Verificar tipos
npm run compile

# Crear una compilación para Chrome
npm run build

# Crear una compilación para Firefox
npm run build:firefox

# Crear un paquete distribuible para Chrome
npm run zip

# Crear un paquete distribuible para Firefox
npm run zip:firefox
```

## Uso

1. Abre SISEEMS e inicia sesión.
2. Navega hasta la sección que contiene la tabla de titulaciones digitales.
3. Abre la extensión **SIHELPMS** desde la barra del navegador.
4. Introduce los CURPs en el cuadro de texto, uno por línea.
5. Pulsa **Descargar Títulos**.
6. Revisa el registro mostrado en el popup para confirmar las descargas o detectar CURPs no encontrados.

La extensión solicita permisos de host para `https://siseems.sems.gob.mx/*`, ya que necesita acceder a los recursos del sitio y ejecutar la descarga desde la pestaña activa.

## Estructura principal

```text
components/
└── assets/
	├── boton.vue          # Botón principal reutilizable
	├── boton-peque.vue    # Botón secundario
	└── inputLabel.vue     # Entrada de CURPs y control de importación

entrypoints/
├── background.ts          # Abre el panel lateral de la extensión
├── content.ts             # Content script de prueba
├── popup/
│   ├── App.vue            # Interfaz y lógica del popup
│   └── style.css          # Estilos globales del popup
└── sidepanel/
	├── index.html
	└── main.ts             # Montaje de la aplicación Vue

wxt.config.ts              # Configuración de WXT y permisos
```

## Estado del proyecto

La interfaz y el flujo de descarga de títulos están implementados. Las funciones de obtener información, buscar alumnos e importar Excel están preparadas visualmente, pero su lógica de negocio todavía está pendiente de implementación.

## Contribuciones

Las propuestas y mejoras son bienvenidas. Antes de abrir un pull request, ejecuta:

```bash
npm run compile
npm run build
```

## Licencia

Consulta el archivo [LICENSE](LICENSE) para conocer los términos de uso del proyecto.
