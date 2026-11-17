# Guion de grabación — Sprint 1 de Biblioteca Ducky

Duración sugerida: 10–15 minutos. Grabar en escritorio para la administración y terminar con la
vista de teléfono. Abrir `http://127.0.0.1:5173/` después de ejecutar `npm run inicio`.

## Preparación antes de grabar

- Usar las cuentas de prueba `N000001` (Administrador) y `N000210` (Comprador de libros). La
  contraseña de ambas semillas es `Ducky2026`. Para la vista móvil se puede usar `A01234567`.
- Tener a mano las fichas de captura de abajo. Las matrículas/nóminas son identidades **simuladas**
  en CIAA y Capital Humano; los títulos e ISBN corresponden a libros publicados.
- Al preparar este guion se comprobó que `A02000001` y `N001001` existen en las fuentes
  institucionales, todavía no tienen cuenta de biblioteca y que `COM-005.1-MAR` no existe en el
  catálogo. Si se repite la demostración, usar los siguientes identificadores disponibles
  (`A02000002`, `N001002`) y otra clave de libro.
- Para la búsqueda física, colocar una **copia real** de _Clean Code_ y la etiqueta de demostración
  en el estante que se mostrará, o explicar que el estante `COM · E1` es una simulación. El sistema
  por sí solo no coloca físicamente ningún libro.
- No mostrar la contraseña de PostgreSQL, el archivo `.env` ni contraseñas temporales en la toma.

## Datos listos para capturar

### Cuentas

| Uso                             | Identificador | Origen simulado | Rol inicial                | Datos que deben aparecer                               |
| ------------------------------- | ------------- | --------------- | -------------------------- | ------------------------------------------------------ |
| Alta de alumno                  | `A02000001`   | CIAA            | Alumno                     | `Alumno Ejemplo 2000001`, `alumno2000001@ducky.edu.mx` |
| Alta, cambio y baja de personal | `N001001`     | Capital Humano  | Colaborador; luego Maestro | `Empleado Ejemplo 1001`, `empleado1001@ducky.edu.mx`   |

En el alta se captura **solo identificador y rol**. Nombre y correo se toman de la fuente
institucional y no se editan desde Biblioteca Ducky.

### Libro para alta, cambio, consulta, baja de un ejemplar, PDF y búsqueda

| Campo de la pantalla       | Valor                                                            |
| -------------------------- | ---------------------------------------------------------------- |
| Título                     | `Clean Code: A Handbook of Agile Software Craftsmanship`         |
| Autor                      | `Robert C. Martin`                                               |
| Editorial                  | `Pearson`                                                        |
| Tema                       | `Computación`                                                    |
| Clave local                | `COM-005.1-MAR`                                                  |
| ISBN de la edición impresa | `9780132350884`                                                  |
| Tipo de uso                | `Préstamo externo`                                               |
| Ejemplares que se reciben  | `2`                                                              |
| Ubicación simulada         | `COM · E1`                                                       |
| Descripción inicial        | `Guía sobre principios y prácticas para escribir código limpio.` |
| Precio de compra (USD)     | Dejar vacío: no se registró una compra real de estos ejemplares. |

Los datos editoriales de la primera edición y ese ISBN se verificaron en la
[ficha de Pearson](https://www.pearson.com/en-us/subject-catalog/p/clean-code-a-handbook-of-agile-software-craftsmanship/P200000009044/9780132350884).
La clave, ubicación, cantidad y descripción de captura son **datos locales de demostración**.
El alta generará `COM-005.1-MAR-E01` y `COM-005.1-MAR-E02`.

### Libro para solicitar una compra

| Campo                               | Valor                                                        |
| ----------------------------------- | ------------------------------------------------------------ |
| Título                              | `The Pragmatic Programmer, 20th Anniversary Edition`         |
| Autor                               | `David Thomas; Andrew Hunt`                                  |
| Editorial                           | `Addison-Wesley`                                             |
| ISBN                                | `9780135957059`                                              |
| Cantidad solicitada                 | `1`                                                          |
| Solicitante o facultad              | `Facultad de Ingeniería`                                     |
| Costo total estimado del lote (MXN) | `900` — supuesto para la demostración, no precio de mercado. |

Título, autores, editorial, fecha de publicación (2019) e ISBN se verificaron en la
[ficha de Pragmatic Bookshelf](https://books.pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/).

## Toma 1 — Gestión de usuarios

| Paso                   | Acción en pantalla                                                                                       | Qué mostrar y decir                                                                                                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Login exitoso       | Entrar con `N000001` / `Ducky2026`.                                                                      | «La sesión reconoce el perfil Administrador y habilita sus módulos».                                                                                                                                          |
| 2. Alta CIAA           | `Administración → Usuarios → + Alta de usuario`; matrícula `A02000001`, rol `Alumno`; `Guardar usuario`. | Buscar la matrícula y mostrar el nombre/correo traídos de CIAA. «La biblioteca no registra datos personales nuevos».                                                                                          |
| 3. Alta Capital Humano | Repetir con nómina `N001001`, rol `Colaborador`.                                                         | Buscar la nómina y mostrar nombre/correo institucionales.                                                                                                                                                     |
| 4. Cambio exitoso      | En `N001001`, pulsar `Editar`; cambiar `Rol asignado` de `Colaborador` a `Maestro`; guardar.             | Mostrar que el rol pasó a Maestro y que nombre, correo e identificador son de solo lectura.                                                                                                                   |
| 5. Baja exitosa        | En `N001001`, pulsar `Baja`; motivo `Fin de acceso de prueba de Sprint 1`; `Confirmar baja`.             | El estado debe verse `Inactivo`; la cuenta se conserva para consulta y posible reactivación.                                                                                                                  |
| 6. Consulta exitosa    | Buscar `N001001` por nómina y filtrar `Inactivo`; después buscar `A02000001`.                            | Mostrar que aparecen las cuentas y sus estados, con los datos personales de origen.                                                                                                                           |
| 7. Gestión de perfiles | `Administración → Perfiles`; recorrer la matriz de roles/permisos y la tabla de perfiles.                | «El perfil define permisos; la asignación hecha en el paso 4 cambió el acceso local». La pantalla ofrece consulta y desactivación; **no mostrar alta/edición de perfil como si existieran en esta interfaz**. |

Si queda tiempo, buscar `A02000002` en Usuarios **antes** de darlo de alta y explicar que estar en
CIAA no equivale a tener una cuenta de biblioteca. Es una comprobación útil, sin modificar datos.

## Toma 2 — Gestión de libros

| Paso                | Acción en pantalla                                                                                                                                                                                           | Qué mostrar y decir                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1. Alta exitosa     | `Libros → Gestión de libros → + Agregar libro`; llenar la ficha de _Clean Code_ y usar `Guardar y generar etiqueta`.                                                                                         | Mostrar clave `COM-005.1-MAR` y las etiquetas `-E01` y `-E02`. «Una ficha bibliográfica puede tener varios ejemplares».            |
| 2. Cambio exitoso   | Buscar `COM-005.1-MAR`, pulsar `Editar`; cambiar solo la descripción a `Guía sobre escritura, revisión y mejora de código limpio.`; `Guardar borrador`.                                                      | Reabrir para comprobar que se conservó el cambio. Los datos editoriales verdaderos quedan iguales.                                 |
| 3. Consulta exitosa | Ir a `Catálogo`, buscar `Clean Code`, abrir `Ver detalle`.                                                                                                                                                   | Mostrar título, autor, ISBN, disponibilidad, ejemplares y ubicación `COM · E1`.                                                    |
| 4. Baja de ejemplar | Volver a `Gestión de libros`; abrir `Ejemplares` de `COM-005.1-MAR`; seleccionar **`COM-005.1-MAR-E02`** y `Baja`; motivo `Dañado`, observación `Cubierta desprendida; ejemplar de demostración`; confirmar. | Mostrar el ejemplar dado de baja o su historial y que `E01` sigue disponible. No dar de baja la ficha completa.                    |
| 5. PDF e impresión  | Abrir el detalle de _Clean Code_; pulsar `Ver PDF`. Mostrar el PDF; después `Mandar a imprimir` y la vista de impresión del navegador.                                                                       | «La ficha se genera con los datos del catálogo». Si no se desea papel, elegir imprimir a PDF o cancelar el diálogo tras mostrarlo. |

## Toma 3 — Solicitud y recepción de compra

Cerrar sesión. Entrar con `N000210` / `Ducky2026` (Comprador de libros).

1. En `Compras`, abrir `Nueva petición`/`Solicitar libro` y llenar los datos de _The Pragmatic
   Programmer_ de la tabla. Pulsar `Enviar a Tesorería`. Anotar el folio `SOL-…` que genere el
   sistema; no asumir un número fijo.
2. Actualizar la lista, buscar el título o folio y mostrar el estado **En Tesorería**. Decir:
   «El envío y su acuse son simulados en este sprint; la solicitud quedó registrada».
3. Abrir `Revisar` y pulsar `Consultar autorización`: en esta simulación la operación autoriza la
   solicitud. Mostrar el nuevo estado **Autorizado**.
4. Abrir `Registrar recepción`; usar la fecha del día de grabación y cantidad recibida `1`;
   confirmar. Mostrar el estado **Recibido** y el historial.
5. Pulsar `Entregar al catálogo` y confirmar. Mostrar **Entregado al catálogo**. Si se desea,
   volver como Administrador a `Gestión de libros → Recibidos de compras` para mostrar el lote.

**Alcance exacto:** esto demuestra la solicitud, autorización simulada, recepción y entrega al
encargado del catálogo. No representa un pago real ni crea automáticamente una ficha bibliográfica
para el libro comprado.

## Toma 4 — Búsqueda física y vista móvil

1. Regresar a `Catálogo` y buscar `Clean Code` o `COM-005.1-MAR`. Abrir el detalle y enfocar el
   ejemplar disponible **`COM-005.1-MAR-E01`**, ubicación **librero `COM`, fila `E1`**.
2. Mostrar la etiqueta y el libro físico en ese estante preparado. Decir: «La clave del ejemplar
   permite pasar del registro digital al objeto físico». Si el libro físico no está disponible,
   presentar el estante como una **simulación**.
3. Para mostrar la app en formato teléfono: abrir las herramientas de Chrome (`F12`), activar el
   modo dispositivo (`Ctrl+Shift+M`), fijar ancho cercano a `390 px` y recargar. Iniciar sesión con
   cualquier cuenta de prueba si hace falta. Mostrar que la navegación móvil deja el catálogo y
   el detalle de libros, con independencia del rol de la cuenta.

## Cierre de la grabación

«En este sprint probamos autenticación, altas y cambios de cuentas validados con fuentes
institucionales simuladas, baja y consulta, permisos por perfil, registro y gestión de libros,
solicitudes de compra, PDF y localización del ejemplar. Las operaciones quedan guardadas en la
base local; la compra con Tesorería y el estante físico se simulan para la demostración».
