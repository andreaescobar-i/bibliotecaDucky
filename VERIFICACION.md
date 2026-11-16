# Verificación de la entrega

## Verificación del 15 de noviembre de 2026

Hecha sobre la rama `chatbot`, con Node 26.13 y PostgreSQL 18.6 en local. Cubre el Sprint 1 ya
conectado a la API y el asistente Ducky.

### Comprobaciones automáticas

| Comando                | Resultado                                                                   |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm run db:reset`     | Crea la base con 12 cuentas, 8 libros y 21 ejemplares                       |
| `npm run db:migrar`    | Segunda ejecución: "No hay migraciones pendientes"                          |
| `npm run lint`         | Sin errores                                                                 |
| `npm run format:check` | Todos los archivos con el formato de Prettier                               |
| `npm test`             | 143 de 143 pruebas pasan (no usan base ni llaman a Google)                  |
| `npm run test:bd`      | 254 de 254 pruebas pasan contra la base real                                |
| `npm run build`        | TypeScript y Vite compilan sin errores                                      |
| `npm run chat:probar`  | Gemini responde por `aiplatform.googleapis.com` con `gemini-3.5-flash-lite` |

### Recorrido en el navegador

Se abrió la aplicación (`npm run inicio`) en Google Chrome sin interfaz, a 1280 px de ancho, con
una cuenta de cada perfil activo: Alumno, Maestro, Colaborador, Bibliotecario de ventanilla,
Bibliotecario de consulta, Administrador general y Comprador de libros.

- **Inicio de sesión:** cada cuenta entra a la pantalla inicial de su rol.
- **Menú por rol:** se abrió cada opción del menú de cada cuenta. Las pantallas de préstamos,
  devolución, renovación, multas, suspendidos, Mi cuenta y reportes muestran el aviso "se entrega
  en el Sprint N" y no enseñan datos.
- **Pantallas de otros roles:** al escribir su dirección, la aplicación regresa a la pantalla
  inicial del rol propio.
- **Permisos en la API:** con cada cuenta se envió una petición por operación (20 operaciones),
  vacía o sobre un registro inexistente. Lo permitido y lo rechazado coincide con los permisos de
  cada perfil en la base, y ninguna petición modificó datos.
- **Asistente Ducky (con la cuenta de alumna):** tema frecuente, pregunta escrita con Enter,
  cerrar y reabrir (la conversación se conserva), aviso de error ante una falla de red, reinicio
  y ancho móvil de 390 px.

### Lo que no se verificó

- No se recorrieron a mano los formularios de alta y edición (usuarios, libros, compras) en el
  navegador; los cubren las pruebas automáticas contra la API.
- La ventana del asistente solo se abrió con la cuenta de alumna. Las respuestas de los demás
  roles se comprobaron por la API.
- No se hizo auditoría de accesibilidad ni se probó en otros navegadores.
- Las respuestas del asistente dependen de un modelo de IA y pueden variar; se comprobaron con
  preguntas reales, no hay una evaluación automática que llame a Google.

### Observaciones

- La cuenta "Bibliotecario de consulta" ve los botones de agregar y editar libros, pero la API
  rechaza esas operaciones: el menú depende del rol y el permiso real, del perfil.
- Al pulsar "Historial" en Gestión de libros, la aplicación pidió `/api/libros//historial`, sin
  la clave del libro. Ocurrió con clics automatizados y con dos cuentas; falta confirmarlo a mano.
- Correo, Tesorería, CIAA y Capital Humano siguen simulados.

## Verificación del 26 de octubre de 2026 (prototipo anterior)

Se conserva como historial. Describe el prototipo del front **antes** de conectarlo a la API:
entonces había acceso de demostración con cambio de rol y los datos se guardaban en el
navegador. Eso ya no aplica: hoy el rol sale del perfil de la cuenta y todos los datos vienen de
la base.

`npm run build` pasó: TypeScript y Vite compilaron las 54 vistas.

Se recorrieron las 21 pantallas principales con ancho de escritorio de 1280 px: imágenes cargadas, dimensiones de los iconos y ausencia de botones anidados o desbordamiento horizontal del documento. Se revisaron también con ancho móvil de 390 px y se corrigieron los desbordamientos encontrados. Las tablas anchas se desplazan dentro de su propio contenedor.

Se abrieron las 33 ventanas del explorador. En móvil se comprobó su apertura sin imágenes rotas, botones anidados o desbordamiento horizontal de la ventana. No se realizó una auditoría exhaustiva de accesibilidad ni de todas las variantes visuales.

Los recursos gráficos y la tipografía se guardaron localmente. El código no usa URLs temporales de Figma.
