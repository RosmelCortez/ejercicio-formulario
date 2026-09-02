document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registro');
  const mensajeGlobal = document.getElementById('mensaje-global');

  // --- EXPRESIONES REGULARES ---
  // (Se mantuvieron las del prototipo original con la corrección del escape \s para permitir espacios)
  const nombreRegex = /^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s']+$/i;
  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const telefonoRegex = /^\+\d{9,15}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&\.])[A-Za-z\d@$!%*#?&\.]{8,50}$/;
  const cedulaRegex = /^(?:[VEve]-)?\d{6,9}$/;

  // --- FUNCIONES DE VALIDACIÓN ---
  function validarNombre(val) {
    if (!val.trim()) return "El nombre es obligatorio.";
    if (!nombreRegex.test(val.trim())) return "El nombre no es válido (solo letras y espacios).";
    return null;
  }

  function validarApellido(val) {
    if (!val.trim()) return "El apellido es obligatorio.";
    if (!nombreRegex.test(val.trim())) return "El apellido no es válido (solo letras y espacios).";
    return null;
  }

  function validarCedula(val) {
    if (!val.trim()) return "La cédula es obligatoria.";
    if (!cedulaRegex.test(val.trim())) return "La cédula debe contener entre 6 y 9 dígitos (permite prefijo V- o E-).";
    return null;
  }

  function validarFechaNacimiento(val) {
    if (!val) return "La fecha de nacimiento es obligatoria.";
    const fechaNac = new Date(val);
    const hoy = new Date();
    if (fechaNac > hoy) return "La fecha de nacimiento no puede ser una fecha futura.";

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    if (edad < 16) return "Debes tener al menos 16 años para registrarte.";
    return null;
  }

  function validarCorreo(val) {
    if (!val.trim()) return "El correo es obligatorio.";
    if (!correoRegex.test(val.trim())) return "El correo no es válido.";
    return null;
  }

  function validarTelefono(val) {
    if (!val.trim()) return "El teléfono es obligatorio.";
    if (!telefonoRegex.test(val.trim())) return "El teléfono no es válido (debe incluir código de país, ej: +584127850227).";
    return null;
  }

  function validarDireccion(val) {
    if (!val.trim()) return "La dirección es obligatoria.";
    if (val.trim().length < 10) return "La dirección debe tener un mínimo de 10 caracteres.";
    return null;
  }

  function validarCiudad(val) {
    if (!val.trim()) return "La ciudad es obligatoria.";
    if (!nombreRegex.test(val.trim())) return "La ciudad solo debe contener letras y espacios.";
    return null;
  }

  function validarPais(val) {
    if (!val) return "Debes seleccionar un país de la lista.";
    return null;
  }

  function validarPassword(val) {
    if (!val) return "La contraseña es obligatoria.";
    if (!passwordRegex.test(val)) {
      return "La contraseña no es válida: debe tener entre 8 y 50 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial.";
    }
    return null;
  }

  function validarConfirmPassword(val, passVal) {
    if (!val) return "Debes confirmar tu contraseña.";
    if (val !== passVal) return "Las contraseñas no coinciden.";
    return null;
  }

  function validarGenero() {
    const seleccionado = document.querySelector('input[name="genero"]:checked');
    if (!seleccionado) return "Debes seleccionar un género.";
    return null;
  }

  function validarModalidad() {
    const seleccionado = document.querySelector('input[name="modalidad"]:checked');
    if (!seleccionado) return "Debes seleccionar una modalidad de estudio.";
    return null;
  }

  function validarIntereses() {
    const marcados = document.querySelectorAll('input[name="intereses"]:checked');
    if (marcados.length < 1 || marcados.length > 3) {
      return "Debes seleccionar entre 1 y 3 áreas de interés.";
    }
    return null;
  }

  function validarTerminos() {
    const marcado = document.getElementById('terminos').checked;
    if (!marcado) return "Debes aceptar los términos y condiciones.";
    return null;
  }

  // --- RESALTADO Y MANEJO DE ERRORES ---
  function marcarCampo(inputElement, errorSpan, mensajeError) {
    if (mensajeError) {
      if (inputElement) {
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('border-green-500');
      }
      errorSpan.textContent = mensajeError;
      errorSpan.classList.remove('hidden');
    } else {
      if (inputElement) {
        inputElement.classList.remove('border-red-500');
        inputElement.classList.add('border-green-500');
      }
      errorSpan.textContent = '';
      errorSpan.classList.add('hidden');
    }
  }

  // --- EVENTO SUBMIT ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Captura de inputs
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const cedula = document.getElementById('cedula');
    const fechaNac = document.getElementById('fecha-nacimiento');
    const correo = document.getElementById('correo');
    const telefono = document.getElementById('telefono');
    const direccion = document.getElementById('direccion');
    const ciudad = document.getElementById('ciudad');
    const pais = document.getElementById('pais');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');

    // Mapeo de validaciones
    const validaciones = [
      { input: nombre, span: document.getElementById('error-nombre'), error: validarNombre(nombre.value) },
      { input: apellido, span: document.getElementById('error-apellido'), error: validarApellido(apellido.value) },
      { input: cedula, span: document.getElementById('error-cedula'), error: validarCedula(cedula.value) },
      { input: fechaNac, span: document.getElementById('error-fecha-nacimiento'), error: validarFechaNacimiento(fechaNac.value) },
      { input: correo, span: document.getElementById('error-correo'), error: validarCorreo(correo.value) },
      { input: telefono, span: document.getElementById('error-telefono'), error: validarTelefono(telefono.value) },
      { input: direccion, span: document.getElementById('error-direccion'), error: validarDireccion(direccion.value) },
      { input: ciudad, span: document.getElementById('error-ciudad'), error: validarCiudad(ciudad.value) },
      { input: pais, span: document.getElementById('error-pais'), error: validarPais(pais.value) },
      { input: password, span: document.getElementById('error-password'), error: validarPassword(password.value) },
      { input: confirmPassword, span: document.getElementById('error-confirm-password'), error: validarConfirmPassword(confirmPassword.value, password.value) },
      { input: null, span: document.getElementById('error-genero'), error: validarGenero() },
      { input: null, span: document.getElementById('error-modalidad'), error: validarModalidad() },
      { input: null, span: document.getElementById('error-intereses'), error: validarIntereses() },
      { input: null, span: document.getElementById('error-terminos'), error: validarTerminos() }
    ];

    const listaErrores = [];

    // Procesar resultados
    validaciones.forEach(item => {
      marcarCampo(item.input, item.span, item.error);
      if (item.error) listaErrores.push(item.error);
    });

    // Mostrar resumen de mensajes
    if (listaErrores.length > 0) {
      mensajeGlobal.className = "mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700 block";
      mensajeGlobal.innerHTML = `
        <strong class="font-bold block mb-1">Por favor corrige los siguientes errores:</strong>
        <ul class="list-disc list-inside text-sm space-y-1">
          ${listaErrores.map(err => `<li>${err}</li>`).join('')}
        </ul>
      `;
      mensajeGlobal.scrollIntoView({ behavior: 'smooth' });
    } else {
      mensajeGlobal.className = "mb-6 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700 block text-center font-bold text-lg";
      mensajeGlobal.innerHTML = "✅ Envío exitoso";

      // Resetear el formulario
      form.reset();
      document.querySelectorAll('.border-green-500').forEach(el => el.classList.remove('border-green-500'));
      document.getElementById('fortaleza-bar').classList.add('hidden');
      document.getElementById('fortaleza-texto').textContent = '';
      document.getElementById('contador-direccion').textContent = '0 caracteres (mín. 10)';
      mensajeGlobal.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // --- PUNTOS EXTRA ---

  // 1. Contador de caracteres para Dirección
  const dirInput = document.getElementById('direccion');
  const dirCounter = document.getElementById('contador-direccion');
  dirInput.addEventListener('input', () => {
    dirCounter.textContent = `${dirInput.value.length} caracteres (mín. 10)`;
  });

  // 2. Indicador de fortaleza de contraseña
  const passInput = document.getElementById('password');
  const fortalezaBar = document.getElementById('fortaleza-bar');
  const fortalezaProgreso = document.getElementById('fortaleza-progreso');
  const fortalezaTexto = document.getElementById('fortaleza-texto');

  passInput.addEventListener('input', () => {
    const val = passInput.value;
    if (!val) {
      fortalezaBar.classList.add('hidden');
      fortalezaTexto.textContent = '';
      return;
    }
    fortalezaBar.classList.remove('hidden');

    let puntos = 0;
    if (val.length >= 8) puntos++;
    if (/[A-Z]/.test(val)) puntos++;
    if (/[0-9]/.test(val)) puntos++;
    if (/[@$!%*#?&\.]/.test(val)) puntos++;

    if (puntos <= 2) {
      fortalezaProgreso.style.width = '33%';
      fortalezaProgreso.className = 'h-full bg-red-500 transition-all duration-300';
      fortalezaTexto.textContent = 'Fortaleza: Débil';
    } else if (puntos === 3) {
      fortalezaProgreso.style.width = '66%';
      fortalezaProgreso.className = 'h-full bg-yellow-500 transition-all duration-300';
      fortalezaTexto.textContent = 'Fortaleza: Media';
    } else {
      fortalezaProgreso.style.width = '100%';
      fortalezaProgreso.className = 'h-full bg-green-500 transition-all duration-300';
      fortalezaTexto.textContent = 'Fortaleza: Fuerte';
    }
  });

  // 3. Validación en tiempo real (Blur)
  const camposConBlur = [
    { id: 'nombre', fn: validarNombre, span: 'error-nombre' },
    { id: 'apellido', fn: validarApellido, span: 'error-apellido' },
    { id: 'cedula', fn: validarCedula, span: 'error-cedula' },
    { id: 'fecha-nacimiento', fn: validarFechaNacimiento, span: 'error-fecha-nacimiento' },
    { id: 'correo', fn: validarCorreo, span: 'error-correo' },
    { id: 'telefono', fn: validarTelefono, span: 'error-telefono' },
    { id: 'direccion', fn: validarDireccion, span: 'error-direccion' },
    { id: 'ciudad', fn: validarCiudad, span: 'error-ciudad' },
    { id: 'pais', fn: validarPais, span: 'error-pais' }
  ];

  camposConBlur.forEach(item => {
    const el = document.getElementById(item.id);
    el.addEventListener('blur', () => {
      const err = item.fn(el.value);
      marcarCampo(el, document.getElementById(item.span), err);
    });
  });
});
