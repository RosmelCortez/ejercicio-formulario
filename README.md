# Proyecto: Formulario de Registro con Validación Completa

En este proyecto desarrollé la solución completa para el formulario de registro de la academia en línea, utilizando HTML5, Tailwind CSS (vía CDN) y JavaScript Vanilla (sin librerías externas de validación).

## Fase 1 — Auditoría del Código Base

Durante la auditoría técnica del prototipo inicial, se identificaron y solucionaron los siguientes errores:

### 1. Valores "Hardcodeados" (Sin interacción con el DOM)
* **Error:** El código utilizaba variables con valores fijos en JavaScript (`let nombre = "Juan";`, etc.). Los resultados solo se evaluaban en la consola y no leían los campos de la pantalla.
* **Solución:** Se vinculó el evento `submit` del formulario mediante `addEventListener` interceptado con `e.preventDefault()`, y se leyeron los datos reales del DOM usando `document.getElementById().value`.

### 2. Mensaje de Error Cruzado (Teléfono/Apellido)
* **Error:** En el bloque de validación del teléfono (`if (!telefonoRegex.test(telefono))`), el mensaje añadido al arreglo de errores decía: `"El apellido no es valido"`.
* **Solución:** Se corrigió el texto para indicar claramente el fallo del teléfono: `"El teléfono no es válido"`.

### 3. Error de Sintaxis por Typo (`error` vs `errors`)
* **Error:** El arreglo de almacenamiento de fallas fue declarado como `let errors = []`, pero al validar la contraseña se invocaba `error.push(...)` (en singular). Esto provocaba un `ReferenceError` en la consola que detenía el script.
* **Solución:** Se corrigió la variable a `errors.push(...)`.

### 4. Desconexión entre `<label>` e `<input>` (Atributos `for` e `id`)
* **Error:** Las etiquetas `<label>` usaban el atributo `for`, pero ninguno de los campos `<input>` del prototipo HTML tenía el atributo `id` asignado.
* **Solución:** Se agregaron los atributos `id` a cada input para asegurar una asociación accesible y funcional con sus respectivas etiquetas.

### 5. Error tipográfico en Expresión Regular
* **Error:** La expresión `nombreRegex` contenía `/s` en lugar del carácter de escape `\s`.
* **Solución:** Se corrigió a `\s` para permitir espacios correctamente en nombres compuestos.

---

## Características de la Solución

* **Fase 2:** Captura del formulario al enviar, resaltado de campos en rojo/verde y listado completo de mensajes de error en pantalla.
* **Fase 3:** Incorporación de todos los nuevos campos obligatorios (Cédula, Fecha de Nacimiento con edad mínima de 16 años, Dirección, Ciudad, País, Género, Modalidad, Áreas de Interés de 1 a 3 opciones, Términos y Confirmación de Contraseña).
* **Fase 4:** Mensajes detallados por campo, diseño responsive con Tailwind CSS y pantalla limpia tras un submission exitoso.
* **Puntos Extra:** 
  * Validación en tiempo real al perder el foco (`blur`).
  * Indicador visual dinámico de fortaleza de contraseña.
  * Contador de caracteres en el campo de dirección.
