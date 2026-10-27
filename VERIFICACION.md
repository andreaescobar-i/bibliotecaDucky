# Verificación de la entrega

26 de octubre de 2026.

`npm run build` pasó: TypeScript y Vite compilaron las 54 vistas. La distribución estática está en `dist/`.

Se recorrieron las 21 pantallas principales con ancho de escritorio de 1280 px: imágenes cargadas, dimensiones de los iconos y ausencia de botones anidados o desbordamiento horizontal del documento. Se revisaron también con ancho móvil de 390 px y se corrigieron los desbordamientos encontrados. Las tablas anchas se desplazan dentro de su propio contenedor.

Se abrieron las 33 ventanas del explorador. En móvil se comprobó su apertura sin imágenes rotas, botones anidados o desbordamiento horizontal de la ventana. No se realizó una auditoría exhaustiva de accesibilidad ni de todas las variantes visuales.

Flujos probados mediante la interfaz:

- Acceso de demostración y cambio de rol.
- Búsqueda de libros y apertura de detalle.
- Alta de usuario y persistencia después de recargar.
- Alta de libro y aparición en la segunda página del inventario.
- Validación de usuario y libro, confirmación de préstamo y apertura del recibo.
- Revisión de adquisición, autorización simulada, recepción y entrega al catálogo, con actualización del estado.
- Restauración de los datos iniciales después de las pruebas.

Los recursos gráficos y la tipografía se guardaron localmente. El código no usa URLs temporales de Figma.

Estas comprobaciones corresponden al frontend local. No se probó una API externa: la autenticación, pagos, autorizaciones de Tesorería, avisos institucionales y datos escolares requieren integraciones de backend. Consulta README.md para el alcance detallado.
