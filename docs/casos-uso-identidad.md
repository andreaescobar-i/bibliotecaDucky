# Identidad institucional y cuentas de biblioteca

CIAA y Capital Humano son registros simulados en el esquema `externo`. La biblioteca los consulta
para identificar a la persona; no crea ni modifica esos registros. Las semillas incluyen 20
alumnos adicionales (`A02000001`–`A02000020`) y 20 empleados (`N001001`–`N001020`) sin cuenta
de biblioteca para practicar altas.

| Caso                       | Identificador                              | Origen                            | Resultado esperado                                                                                       |
| -------------------------- | ------------------------------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Alta de alumno vigente     | Matrícula existente en CIAA                | `externo.ciaa_alumno`             | Crea una cuenta local con perfil Alumno; toma nombre y correo institucional de CIAA.                     |
| Alta de personal vigente   | Nómina existente en Capital Humano         | `externo.capital_humano_empleado` | Crea una cuenta local con un perfil compatible; toma nombre y correo institucional de Capital Humano.    |
| Identificador inexistente  | Matrícula o nómina ausente                 | Sistema correspondiente           | Rechaza el alta; la biblioteca no registra a la persona en el sistema institucional.                     |
| Persona no vigente         | Matrícula o nómina existente pero inactiva | Sistema correspondiente           | Rechaza el alta y el acceso.                                                                             |
| Cuenta duplicada           | Identificador que ya tiene cuenta          | Biblioteca                        | Rechaza otra alta y muestra el estado de la cuenta existente.                                            |
| Cambio de perfil           | Cuenta activa                              | Biblioteca                        | Cambia solo el perfil o rol local, con las validaciones de permisos y compatibilidad.                    |
| Cambio de datos personales | Nombre, correo o teléfono                  | Sistema institucional             | La API de biblioteca rechaza la modificación. El teléfono histórico no se administra en esta simulación. |
| Consulta de cuenta         | Cuenta existente                           | Ambos orígenes                    | Devuelve nombre y correo actuales del registro institucional junto con perfil y estado locales.          |

Los atributos locales de la biblioteca son el perfil, los permisos derivados, el estado de la
cuenta, las credenciales, las fechas de alta y baja, y la bitácora. Matrícula o nómina, nombre y
correo institucional son datos de origen. La tabla `usuario` conserva una copia de los datos
institucionales necesaria para las restricciones existentes; las consultas presentan los valores
actuales de CIAA o Capital Humano.
