# 06 · Preguntas abiertas

## Estado al 15 de noviembre de 2026

Las preguntas de abajo se escribieron antes de empezar. Así quedaron:

| #   | Pregunta                                  | Cómo se resolvió                                                             |
| --- | ----------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Ejecutar la Fase 1                        | Autorizada y hecha. `PGPASSWORD` quedó con un valor de relleno               |
| 2   | Responder sobre la cuenta de cada usuario | Sí: consulta "mi cuenta", siempre con la cuenta de la sesión                 |
| 3   | Quién lo usa y cuánto gastar              | Poca gente; no se construyen límites por día ni alerta de presupuesto        |
| 4   | Modelo de Gemini                          | Uno ligero: `gemini-3.5-flash-lite`. Se revisará más adelante                |
| 5   | Cómo se creó la key                       | Sin respuesta. La prueba real confirmó que llega al proyecto de Google Cloud |
| 6   | Quién revisa la guía                      | La guía es general (rol y permisos); se verificó abriendo la aplicación      |
| 7   | Cuánto se guardan las conversaciones      | 12 horas desde que se inician; después se borran con sus mensajes            |
| 8   | Qué tan formal                            | Trato de usted, nombre "Ducky", español, texto simple                        |
| 9   | Qué hace cuando no sabe                   | Dice "No cuento con esa información" y sugiere acudir al personal            |
| 10  | Reglas: de la base o del documento        | Días y renovaciones salen de la base; multa y reposición, del documento      |
| 11  | Coordinación con el equipo                | Rama `chatbot`, un commit por fase; el pull request lo hace el usuario       |
| 12  | Estándar de codificación                  | Se imitó el estilo existente; el documento del estándar no se recibió        |
| 13  | Web o app móvil                           | Solo web                                                                     |
| 14  | Se va a publicar                          | **Sin decidir.** La Fase 9 no se inició                                      |
| 15  | Corregir documentos desactualizados       | Hecho: `VERIFICACION.md` y README                                            |

## Preguntas originales

Lo que no pude resolver leyendo el código. Cada pregunta trae mi recomendación, por si prefieres
contestar "sí a todo lo recomendado".

## Las que bloquean el arranque

### 1. ¿Puedo ejecutar la Fase 1 en tu computadora?

Implica instalar dependencias (`npm install`), crear la base `sigb_ducky` (`npm run db:reset`) y
completar `.env`. Esta sesión lo tenía prohibido.

Necesito además dos datos:

- **¿Cuál es la contraseña de tu usuario `postgres`?** Tu servidor local acepta conexiones sin
  contraseña, así que cualquier valor funciona hoy; aun así conviene poner la real.
- **¿La base `faltas` es de otro proyecto?** No la tocaré. Lo pregunto para confirmar que
  `sigb_ducky` no choca con nada.

_Recomendación:_ autorizar la Fase 1 completa. No cambia código y es la única forma de confirmar
el diagnóstico.

### 2. ¿El asistente debe responder sobre la cuenta de cada usuario?

Por ejemplo: "¿cuándo vence mi préstamo?" o "¿cuánto debo de multas?".

El Sprint Backlog define el ChatBot como "Preguntas frecuentes". Las tablas de préstamos y multas
existen, pero su API es de los Sprints 2 y 3 y hoy solo tienen datos de prueba.

_Recomendación:_ dejarlo fuera de la primera versión. El asistente responderá que esa consulta se
hace en "Mi cuenta". Se agrega cuando existan los préstamos reales.

### 3. ¿Quién va a usar el chatbot y cuánto?

¿Es para la demostración de la materia (ustedes y el profesor) o lo usarán alumnos reales? ¿Cuánto
de tus créditos quieres destinarle como máximo al mes?

De eso dependen los límites. Los que propuse (6 por minuto, 40 por día por persona, 1000 al día en
total) son prudentes para una demostración.

_Recomendación:_ empezar con esos valores y poner una alerta de presupuesto baja en Google Cloud.

## Sobre Google Cloud

### 4. ¿Qué modelo de Gemini tienes disponible?

En la consola de Agent Platform, ¿qué modelos aparecen habilitados para tu proyecto? Los ejemplos
oficiales actuales usan `gemini-3.8-flash`.

_Recomendación:_ el modelo Flash más reciente que te aparezca. Lo confirmo con la prueba mínima de
la Fase 3.

### 5. ¿Cómo creaste la key?

¿La creaste en la sección de API keys de Agent Platform, con una cuenta de servicio asociada? ¿Tu
proyecto de Google Cloud tiene facturación activa con los créditos aplicados?

Lo pregunto porque existe también una modalidad "express" con límites mucho más bajos (10
peticiones por minuto en algunos modelos) y un periodo gratuito de 90 días. El formato de tu key
(`AQ.…`) indica que es la estándar ligada a cuenta de servicio, pero quiero confirmarlo.

También: ¿la key tiene restricciones de API? Conviene limitarla a Agent Platform.

## Sobre el contenido

### 6. ¿Quién revisa la guía de "dónde se hace cada tarea"?

Yo escribo el borrador con los menús y pantallas del código. Alguien que use la app debe revisar
los nombres exactos de los botones y los pasos.

¿Lo revisas tú o alguien del equipo? ¿Existe ya un manual de usuario que pueda aprovechar? La
propuesta de negocio menciona "Manuales de Usuario" como entregable del Sprint 5.

### 7. ¿Cuánto tiempo se guardan las conversaciones?

Son datos personales de los usuarios.

_Recomendación:_ 90 días, y que cada usuario vea solo las suyas. ¿El Administrador debe poder
revisarlas? Yo diría que no en la primera versión.

### 8. ¿Qué tan formal?

Pediste respuestas formales. ¿Trato de "usted"? ¿Mantengo el nombre "Ducky"? ¿Solo español?

_Recomendación:_ "usted", nombre "Ducky", solo español, respuestas breves y sin emojis.

### 9. ¿Qué hace cuando no sabe?

_Recomendación:_ decir "No cuento con esa información" y sugerir acudir al personal de la
biblioteca. ¿Hay un correo, teléfono u horario de atención que deba dar?

### 10. ¿Reglas de la biblioteca: de la base o del documento?

Las reglas de préstamo (5 y 10 días hábiles, 2 y 3 renovaciones) están en la tabla
`politica_prestamo`. Las demás (multa de $10 por día, máximo 2 libros, valor de reposición) solo
están en el PDF de requerimientos.

_Recomendación:_ leer de la base las que están ahí y poner las otras como texto fijo en las
instrucciones del asistente, citando que son reglas de la biblioteca.

## Sobre el proyecto

### 11. ¿Tengo que coordinarme con el equipo?

El backlog asigna el ChatBot a Armando y Lenin, en el Sprint 3. El repositorio remoto es de otra
persona del equipo (`andreaescobar-i/bibliotecaDucky`).

- ¿Trabajo en una rama aparte (por ejemplo `chatbot`) y ustedes la integran?
- ¿Alguien más está modificando `src/App.tsx` o la base? Lo pregunto para evitar conflictos.
- ¿El repositorio es público o privado?

_Recomendación:_ rama aparte y una fase por commit.

### 12. ¿Debo seguir el Estándar de Codificación del equipo?

El código tiene encabezados (`Programa`, `Objetivo`, `Autores`, `Fecha`), nombres en español y
comentarios con formato fijo. El README menciona un "Estándar de Codificación" que no está en la
carpeta.

_Recomendación:_ imitar el estilo existente. Si tienes el documento del estándar, compártelo.

### 13. ¿Solo web, o también app móvil?

El Sprint Backlog marca el ChatBot con "APP: Sí" y "WEB: Sí". En el código solo existe la web.

_Recomendación:_ solo web. La ruta del backend serviría igual para una app más adelante.

### 14. ¿La app se va a publicar de verdad?

La propuesta habla de desplegar en el servidor de la Universidad en el Sprint 5. ¿Eso va a
ocurrir o la entrega es una demostración en una laptop?

Si se publica, la Fase 9 deja de ser opcional y conviene decidir pronto dónde vivirá la base.

### 15. ¿Corrijo los documentos desactualizados?

`VERIFICACION.md` describe el prototipo anterior y el README dice que `dist/` viene incluida.

_Recomendación:_ corregirlos en la Fase 7, junto con la documentación del chatbot.

## Lo que no pude verificar

Para que no se tome como comprobado lo que solo deduje:

| Afirmación                                                 | Por qué no se verificó                   | Cuándo se verifica    |
| ---------------------------------------------------------- | ---------------------------------------- | --------------------- |
| La app arranca y las pruebas pasan                         | Sin dependencias ni base de datos        | Fase 1                |
| El código funciona con Node 26 y PostgreSQL 18             | Mismo motivo                             | Fase 1                |
| `enterprise: true` acepta una API key en JavaScript        | La documentación no trae ese ejemplo     | Fase 3                |
| La key es válida y tiene acceso a un modelo                | No hice ninguna llamada a Google         | Fase 3                |
| Qué modelo de embeddings ofrece Agent Platform con tu key  | No aparece en las páginas que consulté   | Fase 8                |
| Los créditos de GCP se aplican a las llamadas con esta key | Depende de la facturación de tu proyecto | Fase 3, en la consola |
