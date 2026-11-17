# Historias de usuario propuestas para los sprints posteriores

Estas historias son un **borrador para revisión**. Sus identificadores son propuestos y sus
criterios se basan en el backlog, el documento inicial de requerimientos y la decisión de permitir
renovar antes del vencimiento. No indican que las funciones ya estén implementadas. El backlog
asigna préstamos, devoluciones y renovaciones al Sprint 2 y chatbot al Sprint 3. Las demás historias
quedan sin sprint asignado hasta que se planifiquen.

## HU-PRE-01 · Registrar préstamo — Sprint 2

**Como** bibliotecario o administrador, **necesito** verificar la cuenta y el ejemplar y registrar
un préstamo, **para** controlar la salida del libro y entregar un comprobante con folio.

| Escenario               | Contexto y evento                                                             | Resultado esperado                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Préstamo autorizado     | La cuenta y el ejemplar cumplen las reglas; el operador confirma el préstamo. | Se registra el préstamo, usuario, ejemplar, operador y fecha; se genera folio y vencimiento, se actualiza la disponibilidad y se ofrece un recibo. |
| Cuenta no autorizada    | Hay multa pendiente, préstamo vencido o se alcanzó el límite aplicable.       | Se informa el motivo y no se registra el préstamo. El backlog establece máximo dos libros activos.                                                 |
| Ejemplar no prestable   | El ejemplar no está disponible o su uso no es préstamo externo.               | Se informa la causa y se conserva el estado del ejemplar.                                                                                          |
| Datos inválidos o error | La cuenta o el ejemplar no existe, falta un dato o falla el registro.         | Se indica el problema y no queda una operación guardada a medias.                                                                                  |

El plazo indicado es de **5 días hábiles para alumnos** y **10 para maestros**, sin contar sábados
ni domingos. Falta definir la política aplicable a colaboradores y los días festivos.

## HU-DEV-01 · Registrar devolución — Sprint 2

**Como** bibliotecario o administrador, **necesito** registrar la devolución y revisar el estado del
ejemplar, **para** actualizar la disponibilidad y detectar retrasos.

| Escenario                      | Contexto y evento                                                             | Resultado esperado                                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Devolución en plazo            | Existe un préstamo abierto y el operador confirma la devolución del ejemplar. | Se registra la fecha, operador y condición; se cierra el préstamo y se actualiza el estado del ejemplar conforme a su condición. |
| Devolución tardía              | La fecha de devolución es posterior al vencimiento.                           | Se registra el retraso y se remite la información al proceso de multas del sprint correspondiente.                               |
| Préstamo inexistente o cerrado | No se encuentra un préstamo abierto para el ejemplar.                         | Se informa al operador y no se registra una segunda devolución.                                                                  |
| Ejemplar dañado                | El operador observa daño durante la devolución.                               | Se registra la condición y observaciones; la decisión sobre cobro y estado operativo queda pendiente de definición.              |

## HU-REN-01 · Renovar préstamo — Sprint 2

**Como** bibliotecario o administrador, **necesito** autorizar una renovación y actualizar el
vencimiento, **para** extender el préstamo respetando el límite por tipo de usuario.

| Escenario                  | Contexto y evento                                                                                         | Resultado esperado                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Renovación en plazo        | Hay un préstamo abierto aún no vencido y el usuario no ha agotado sus renovaciones. El operador confirma. | Se registra la renovación, número, operador y fechas anterior y nueva; se muestra el nuevo vencimiento. |
| Límite alcanzado           | El alumno ya tiene dos renovaciones o el maestro ya tiene tres.                                           | Se rechaza la renovación y se conserva el vencimiento anterior.                                         |
| Préstamo no disponible     | El préstamo no existe o ya fue cerrado.                                                                   | Se informa el motivo y no se registra una renovación.                                                   |
| Operación sin autorización | No hay sesión válida o faltan permisos.                                                                   | Se impide la operación y no se modifican los datos.                                                     |

**Pendiente:** definir si se permite renovar un préstamo ya vencido, cómo se trata la multa y
desde qué fecha se calcula el nuevo plazo. La renovación antes del vencimiento está confirmada.

## HU-MUL-01 · Calcular multa por retraso — Sprint por definir

**Como** bibliotecario, **necesito** calcular y registrar la multa de un préstamo entregado tarde,
**para** informar el adeudo y orientar al usuario a Tesorería.

| Escenario            | Contexto y evento                                                        | Resultado esperado                                                                                                |
| -------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Retraso identificado | Se devuelve un libro después de su vencimiento y se confirma el cálculo. | Se registra el adeudo vinculado al préstamo y se muestra el desglose con tarifa de **10 MXN por día de retraso**. |
| Sin retraso          | La devolución ocurre dentro del plazo.                                   | No se genera multa por retraso.                                                                                   |
| Reintento o error    | El cálculo ya se registró o falla el guardado.                           | Se evita duplicar el adeudo y se informa el resultado.                                                            |

**Pendiente:** confirmar si los días de multa son naturales o hábiles, y cómo se computa el día de
vencimiento y los festivos. El documento inicial solo dice «por cada día de retraso».

## HU-REP-01 · Reportar libro perdido y calcular reposición — Sprint por definir

**Como** administrador, **necesito** registrar un libro perdido y calcular su valor de reposición,
**para** generar el adeudo y preparar los avisos a Servicios Escolares y Tesorería.

| Escenario                               | Contexto y evento                                                                                | Resultado esperado                                                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Reporte completo                        | Hay un préstamo identificado, precio de última compra en USD y tipo de cambio actual disponible. | Se registra el reporte y el adeudo calculado como precio en USD × tipo de cambio; se conservan los datos usados y se preparan los avisos. |
| Precio o tipo de cambio faltante        | No se puede obtener alguno de los valores necesarios.                                            | Se informa qué dato falta y no se inventa un importe.                                                                                     |
| Reporte repetido o préstamo inexistente | El préstamo no existe o ya tiene un reporte registrado.                                          | Se informa al operador y no se duplica el cargo.                                                                                          |

**Pendiente:** fuente del tipo de cambio, procedimiento de notificación y resolución del préstamo y
del ejemplar después del reporte.

## HU-PAG-01 · Registrar pago de adeudo — Sprint por definir

**Como** bibliotecario, **necesito** registrar el pago reportado por un usuario tras pagar en
Tesorería, **para** mantener actualizado el estado de su adeudo.

| Escenario                    | Contexto y evento                                                                  | Resultado esperado                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Pago registrado              | Se identifica un adeudo pendiente y se cuenta con los datos del pago en Tesorería. | Se registra el pago, su referencia, fecha, importe y operador; se actualiza el adeudo. |
| Adeudo inexistente o saldado | No hay adeudo pendiente para la referencia consultada.                             | Se informa al operador y no se duplica el registro.                                    |
| Datos insuficientes          | Falta información necesaria para identificar o registrar el pago.                  | Se señalan los datos faltantes y no se guarda el pago.                                 |

**Pendiente:** cómo se valida el pago con Tesorería y si se admiten pagos parciales; el esquema
actual contempla un pago por adeudo, lo que debe revisarse frente a la regla acordada.

## HU-SUS-01 · Generar lista de deudores para suspensión — Sprint por definir

**Como** bibliotecario, **necesito** generar en época de exámenes una lista de alumnos con libros o
multas pendientes, **para** dar aviso a Servicios Escolares.

| Escenario          | Contexto y evento                               | Resultado esperado                                                                                     |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Hay deudores       | Se solicita la lista para un corte determinado. | Se muestran los alumnos y sus adeudos o libros pendientes, con fecha de corte, para preparar el aviso. |
| Sin deudores       | No hay registros que cumplan los criterios.     | Se informa que la lista está vacía y no se agregan alumnos ajenos.                                     |
| Error al consultar | No se pueden recuperar los datos.               | Se informa el error y no se presenta como una lista sin deudores.                                      |

**Pendiente:** criterios exactos de inclusión, formato y envío del aviso, y qué área aplica o levanta
la suspensión. El documento inicial menciona alumnos deudores y aviso a Servicios Escolares.

## HU-INV-01 · Consultar existencias e inventario — Sprint por definir

**Como** responsable de la biblioteca, **necesito** consultar listas de existencias, **para**
comparar el catálogo con los ejemplares registrados y apoyar el inventario.

| Escenario               | Contexto y evento                     | Resultado esperado                                                                                |
| ----------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Consulta con resultados | Se solicita una lista de existencias. | Se muestran los libros y ejemplares registrados con sus datos de identificación y disponibilidad. |
| Sin resultados          | No hay registros para la consulta.    | Se informa que no hay coincidencias.                                                              |
| Error de consulta       | No se recuperan los registros.        | Se informa el error y no se presenta como inventario vacío.                                       |

**Pendiente:** filtros de listas parciales, formato del reporte y procedimiento de conteo o ajuste
físico. La existencia de este borrador no asigna la función a un sprint.

## HU-CHAT-01 · Consultar preguntas frecuentes — Sprint 3

**Como** usuario de la biblioteca, **necesito** consultar preguntas frecuentes mediante un
chatbot, **para** obtener orientación sobre sus servicios.

| Escenario              | Contexto y evento                                                    | Resultado esperado                                                      |
| ---------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Consulta reconocida    | El usuario escribe una pregunta incluida en el contenido disponible. | El asistente muestra la respuesta correspondiente.                      |
| Consulta no reconocida | La pregunta no coincide con el contenido disponible.                 | Se informa que no hay una respuesta disponible y se orienta al usuario. |
| Consulta vacía         | El usuario intenta enviar el mensaje vacío.                          | Se solicita escribir una pregunta.                                      |

**Pendiente:** catálogo de preguntas y respuestas, plataforma definitiva y fuente de contenido. El
backlog solo señala preguntas frecuentes; las respuestas locales actuales son una demostración.

## Decisiones por confirmar

1. ¿Se renueva un préstamo vencido? ¿Debe pagarse antes el adeudo y desde qué fecha corre el nuevo plazo?
2. ¿Los días de retraso se cuentan como naturales o hábiles? ¿Cómo se consideran festivos?
3. ¿Cuál es la política de préstamo y renovación para colaboradores?
4. ¿Se admiten pagos parciales y cómo se verifica el pago con Tesorería?
5. ¿Qué área aplica y levanta suspensiones y cómo se entregan los avisos?
6. ¿Qué sprints cubrirán multas, reposiciones, pagos, suspensiones e inventario?
7. ¿Qué filtros, formato y procedimiento se requieren para inventarios parciales?

Fuentes: `Sprint Backlog SIGB — Evidencia 05.xlsx`, `SC2234 IngSw (01 Requerimientos Biblioteca).pdf`,
`03 Historia de Usuario .xlsx` y decisiones expresadas en la conversación sobre identidad
institucional y renovación antes del vencimiento.
