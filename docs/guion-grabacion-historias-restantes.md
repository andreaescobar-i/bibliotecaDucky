# Guion de muestra — historias posteriores al Sprint 1

Duración sugerida: 12–18 minutos. Este guion usa las semillas cargadas con `npm run db:reset` el 16 de noviembre de 2026. Abrir `http://127.0.0.1:5173/` con `npm run inicio`. La contraseña de las cuentas sembradas es `Ducky2026`. Grabar la pantalla de escritorio y evitar mostrar `.env`, enlaces de recuperación o claves.

## Preparación y orden

1. Entrar como bibliotecario `N000104` (Ernesto Díaz). Tener a mano la matrícula `A01999000` (Carlos Pérez Soto), sin préstamos ni adeudos, y el ejemplar `COM-005.1-COR-E03` de _Introducción a los algoritmos_.
2. Tener anotados `PRE-2026-0001` (Mariana López, préstamo vencido de `COM-005.1-COR-E01`) y `PRE-2026-0004` (Rodrigo Díaz, préstamo ya devuelto con multa pendiente de $50 MXN). Los vencimientos de las semillas son de octubre/septiembre de 2026; comprobar la fecha del equipo antes de la toma.
3. Para reposición, usar `PRE-2026-0002` (Mariana, _Pedro Páramo_, `LIT-863-RUL-E01`) **solo después** de la toma de devolución y multa. La reposición cerrará el préstamo y dará de baja el ejemplar: es irreversible dentro de esta muestra.
4. Las operaciones modifican la BD. Si se repite la grabación, restaurar las semillas con `npm run db:reset` únicamente si ya no se necesitan las capturas hechas desde la toma anterior.

## Toma 1 — Préstamo, boleta, renovación y devolución (Sprint 2)

| Historia | Acción concreta | Evidencia y frase sugerida |
| --- | --- | --- |
| HU-PRE-01 · Préstamo exitoso | En Operaciones → Registrar préstamo, capturar `A01999000` y `COM-005.1-COR-E03`; pulsar **Registrar préstamo**. | Anotar el folio nuevo que entrega la pantalla. «La política calcula el vencimiento y el ejemplar deja de estar disponible». |
| Boleta | En el resultado, mostrar la boleta; usar **Imprimir boleta** o buscar el folio en **Boleta de préstamo**. | Mostrar usuario, libro, ejemplar y fechas. Correo/WhatsApp solo abren un mensaje preparado: no afirmar que ya se envió. |
| HU-REN-01 · Renovación anticipada | En Operaciones → Renovar préstamo, buscar **el folio nuevo** y pulsar **Confirmar renovación**. | Comparar el vencimiento antes y después. «Se puede renovar antes de vencer; el nuevo plazo queda guardado». |
| HU-DEV-01 · Devolución en plazo | En Operaciones → Registrar devolución, buscar el mismo folio, condición **Buen estado**, observación `Entrega sin daños`; confirmar. | Debe decir **Devolución registrada. Sin multa por retraso.** Mostrar el historial en Mi cuenta de `A01999000` si se desea. |
| HU-DEV-01 / HU-MUL-01 · Devolución tardía | Buscar `PRE-2026-0001`, seleccionar **Buen estado**, confirmar. | Mostrar la multa calculada a $10 MXN por día hábil y el acuse de Tesorería. El monto depende del día de la muestra: no anunciar una cifra fija. |

No usar `PRE-2026-0003` para la renovación anticipada: su vencimiento sembrado ya pasó. Conservar `PRE-2026-0002` para la reposición posterior.

## Toma 2 — Adeudos, reposición y suspensiones

| Historia | Acción concreta | Evidencia y frase sugerida |
| --- | --- | --- |
| HU-PAG-01 · Pago de multa | En Operaciones → Multas y Tesorería → **Registrar pago**, elegir el adeudo de `PRE-2026-0004` (Rodrigo, $50 MXN). Capturar monto `50`, folio `TES-DEMO-20261116-01` y la fecha actual; confirmar. | Mostrar el comprobante y estado pagado. «Registramos un comprobante de Tesorería; no cobramos dinero en la aplicación». |
| HU-REP-01 · Libro perdido | En **Reportar libro perdido**, buscar `PRE-2026-0002`. Capturar tipo de cambio de demostración `20.00`, fecha actual y fuente `Tipo de cambio simulado para demostración`; confirmar. | _Pedro Páramo_ tiene precio registrado de USD 12.00, por lo que el adeudo esperado es MXN 240.00. Mostrar préstamo cerrado, ejemplar dado de baja y acuses/avisos indicados en la pantalla. El tipo de cambio es **simulado**, no una cotización real. |
| HU-SUS-01 · Consulta de deudores | En **Alumnos suspendidos y deudores**, mostrar filtros por programa y tipo de pendiente. Buscar `A01234567` para ver a Mariana. | «El listado reúne vencimientos, multas y reposición según el estado actual». |
| HU-SUS-01 · Suspensión y corte | Capturar matrícula `A01234567`, motivo `Pendientes durante exámenes`, **Registrar suspensión**. Luego generar lista para el periodo `Finales noviembre 2026` y descargar **lista CSV**. | Mostrar estado suspendido, fecha de corte y filas exportadas. Aclarar si el acuse a Servicios Escolares dice **Simulado** o **Confirmado**; sin webhook configurado no se envía un aviso real. |

Para mostrar el proceso desde la cuenta del lector, cerrar sesión e ingresar con `A01234567` / `Ducky2026`; en **Mi cuenta** mostrar préstamos, adeudos y su lista de espera. Regresar luego al administrador `N000001`.

## Toma 3 — Inventario, perfiles y recuperación

| Función | Acción concreta | Evidencia y frase sugerida |
| --- | --- | --- |
| HU-INV-01 · Reportes e inventario | Como administrador, abrir **Reportes e inventario**. Elegir mes `2026-11`, aplicar filtros; después elegir tema **Computación** o estante **COM** y aplicar. Descargar **inventario CSV**. | Mostrar existencia total, prestados, vencidos, estado por tema y detalle de ejemplares. «El inventario refleja la BD actual; el mes filtra movimientos y multas, no la existencia». |
| Gestión de perfiles | Abrir **Perfiles** y mostrar lista y permisos; crear un perfil de demostración con clave `PRF-DEM-2026`, nombre `Consulta de demostración`, rol Alumno y permisos compatibles que ofrece el formulario. Guardar y volver a consultarlo. | Mostrar que el perfil se crea activo sin asignarse a una cuenta. No cambiar el perfil del administrador que está usando la sesión. |
| Recuperación de acceso | En el login, usar **¿Olvidaste tu contraseña?** para una cuenta de prueba. | Mostrar solo la solicitud y el mensaje neutral. Sin `CORREO_WEBHOOK_URL`, el enlace se escribe en la consola del servidor; no exponerlo en la grabación ni afirmar que se envió correo real. Completar el cambio de contraseña solo si se quiere alterar esa cuenta de prueba. |

## Cierre y alcance

Decir: «Estas pantallas consumen la API y guardan sus cambios en PostgreSQL. La batería de integración tras reiniciar las semillas terminó con 246 pruebas aprobadas y ninguna fallida». La prueba automática comprueba la API y sus reglas; este guion es una propuesta de recorrido visual, por lo que conviene ensayar una vez antes de grabar.

El chatbot queda fuera de esta muestra. Los acuses de Tesorería y Servicios Escolares pueden ser simulados en desarrollo; distinguirlo explícitamente de una integración real.
