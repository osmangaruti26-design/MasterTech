/**
 * ============================================================================
 * CONFIGURACIÓN DEL NEGOCIO - PERSONALIZA TUS DATOS AQUÍ
 * ============================================================================
 * Cambia estos valores por tus datos reales (número de teléfono, nombre, etc.)
 */
const CONFIG = {
  businessName: "MasterTech Computación",
  technicianName: "Técnico Especialista en Informática",
  // Coloca aquí tu número de WhatsApp con código de país (sin el signo +, sin espacios ni guiones)
  // Ejemplo México: "5215512345678" | Venezuela: "584121234567" | Colombia: "573001234567" | Argentina: "5491112345678"
  whatsappNumber: "584149136597", 
  phoneDisplay: "+58 414 913-6597",
  email: "contacto.computadoras@gmail.com",
  city: "Servicio a Domicilio y Taller",
  schedule: "Lunes a Sábado: 8:00 AM a 7:00 PM (Urgencias disponibles)",
  warrantyDays: "Garantía de 30 a 90 días en todos los trabajos"
};

// ============================================================================
// INICIALIZACIÓN AL CARGAR EL DOCUMENTO
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initBusinessData();
  initMobileMenu();
  initFaqAccordion();
  initQuoteCalculator();
  initContactForm();
  initScrollEffects();
});

/**
 * Rellena los datos dinámicos del negocio en la interfaz
 */
function initBusinessData() {
  // Configurar enlaces directos de WhatsApp en botones principales
  const defaultMessage = encodeURIComponent("¡Hola! Vi tu página web y necesito información o soporte para reparar mi computadora.");
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${defaultMessage}`;

  const heroWaBtn = document.getElementById("hero-whatsapp-btn");
  if (heroWaBtn) heroWaBtn.href = waUrl;

  const navWaBtn = document.getElementById("nav-whatsapp-btn");
  if (navWaBtn) navWaBtn.href = waUrl;

  const floatWaBtn = document.getElementById("float-whatsapp-btn");
  if (floatWaBtn) floatWaBtn.href = waUrl;

  // Actualizar textos de contacto en el pie y cabecera
  const phoneElements = document.querySelectorAll(".business-phone");
  phoneElements.forEach(el => el.textContent = CONFIG.phoneDisplay);

  const nameElements = document.querySelectorAll(".business-name");
  nameElements.forEach(el => el.textContent = CONFIG.businessName);

  const scheduleElements = document.querySelectorAll(".business-schedule");
  scheduleElements.forEach(el => el.textContent = CONFIG.schedule);
}

/**
 * Control del menú responsive para teléfonos
 */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}

/**
 * Acordeón para Preguntas Frecuentes
 */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll(".faq-button");

  faqButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector(".faq-icon");
      const isOpen = answer.classList.contains("open");

      // Cerrar otros abiertos
      document.querySelectorAll(".faq-answer").forEach(item => {
        item.classList.remove("open");
      });
      document.querySelectorAll(".faq-icon").forEach(item => {
        item.classList.remove("rotate-180");
      });

      // Abrir o cerrar el actual
      if (!isOpen) {
        answer.classList.add("open");
        if (icon) icon.classList.add("rotate-180");
      }
    });
  });
}

/**
 * Cotizador Interactivo Express
 */
function initQuoteCalculator() {
  const deviceSelect = document.getElementById("quote-device");
  const serviceSelect = document.getElementById("quote-service");
  const modalitySelect = document.getElementById("quote-modality");
  const notesInput = document.getElementById("quote-notes");
  const sendBtn = document.getElementById("quote-send-whatsapp");
  const resultCard = document.getElementById("quote-result-card");
  const resultSummary = document.getElementById("quote-summary-text");
  const resultEstimate = document.getElementById("quote-estimate-text");

  if (!deviceSelect || !serviceSelect || !sendBtn) return;

  // Mapa de estimados aproximados o recomendaciones según servicio
  const serviceEstimates = {
    "mantenimiento": {
      name: "Mantenimiento Preventivo / Limpieza Física y Pasta Térmica",
      time: "2 a 4 horas",
      desc: "Limpieza profunda de polvo, lubricación de cooler y cambio de pasta térmica de alto rendimiento (Artic/Grizzly)."
    },
    "formateo": {
      name: "Formateo, Sistema Operativo y Paquete de Programas",
      time: "Mismo día (3 a 5 horas)",
      desc: "Instalación limpia de Windows 10/11 con drivers oficiales, Office completo, utilitarios y optimización."
    },
    "ssd_upgrade": {
      name: "Actualización a Disco Sólido (SSD) y Aumento de RAM",
      time: "Mismo día",
      desc: "Multiplica la velocidad de tu equipo x10 sin perder tus fotos ni archivos personales."
    },
    "no_enciende": {
      name: "Diagnóstico Avanzado de Hardware (No enciende o pantalla negra)",
      time: "24 a 48 horas máx.",
      desc: "Revisión técnica de componentes: placa madre, memoria RAM, fuente de poder y cortocircuitos."
    },
    "virus_lenta": {
      name: "Eliminación de Virus, Malware y Desinfección Profunda",
      time: "2 a 3 horas",
      desc: "Eliminación de troyanos, publicidad molesta y aceleración del arranque de la máquina."
    },
    "pantalla_teclado": {
      name: "Cambio de Pantalla, Teclado, Batería o Bisagras de Laptop",
      time: "Sujeto a repuesto",
      desc: "Reemplazo de partes físicas con repuestos nuevos y compatibles garantizados."
    },
    "recuperacion_datos": {
      name: "Recuperación de Archivos y Copias de Seguridad",
      time: "24 a 48 horas",
      desc: "Extracción y rescate de fotos, documentos y carpetas de discos duros dañados o formateados."
    },
    "otro": {
      name: "Diagnóstico General y Asesoría Técnica Personalizada",
      time: "Inmediato",
      desc: "Revisión completa de acuerdo a la falla que presente tu equipo."
    }
  };

  function updateEstimatePreview() {
    const serviceVal = serviceSelect.value;
    const deviceVal = deviceSelect.options[deviceSelect.selectedIndex].text;
    const modalityVal = modalitySelect ? modalitySelect.options[modalitySelect.selectedIndex].text : "A convenir";
    const data = serviceEstimates[serviceVal] || serviceEstimates["otro"];

    if (resultSummary && resultEstimate && resultCard) {
      resultSummary.textContent = `${deviceVal} • ${data.name} (${modalityVal})`;
      resultEstimate.textContent = `⏱ Tiempo estimado: ${data.time} | 💡 ${data.desc}`;
      resultCard.classList.remove("hidden");
    }
  }

  deviceSelect.addEventListener("change", updateEstimatePreview);
  serviceSelect.addEventListener("change", updateEstimatePreview);
  if (modalitySelect) modalitySelect.addEventListener("change", updateEstimatePreview);

  // Inicializar preview inicial
  updateEstimatePreview();

  // Acción al presionar el botón de enviar cotización
  sendBtn.addEventListener("click", () => {
    const device = deviceSelect.options[deviceSelect.selectedIndex].text;
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const modality = modalitySelect ? modalitySelect.options[modalitySelect.selectedIndex].text : "A convenir";
    const userNotes = notesInput && notesInput.value.trim() ? notesInput.value.trim() : "No especificado";

    // Mensaje bien formateado para WhatsApp
    const message = 
`💻 *SOLICITUD DE COTIZACIÓN - SERVICIO TÉCNICO*
---------------------------------------
• *Tipo de Equipo:* ${device}
• *Servicio Requerido:* ${service}
• *Modalidad:* ${modality}
• *Detalles / Síntomas:* ${userNotes}
---------------------------------------
Hola, deseo consultar el presupuesto exacto y la disponibilidad para reparar mi equipo. ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, "_blank");
  });
}

/**
 * Formulario de contacto directo
 */
function initContactForm() {
  const contactForm = document.getElementById("quick-contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("cf-name")?.value.trim() || "Cliente";
    const phone = document.getElementById("cf-phone")?.value.trim() || "No especificado";
    const messageText = document.getElementById("cf-message")?.value.trim() || "Consulta general de reparación";

    const fullMessage = 
`👋 *NUEVO CONTACTO DESDE LA WEB*
• *Nombre:* ${name}
• *Teléfono:* ${phone}
• *Mensaje:* ${messageText}

Hola, me gustaría que me contactes para coordinar la revisión de mi equipo informático.`;

    const encoded = encodeURIComponent(fullMessage);
    const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;

    window.open(waUrl, "_blank");
    showToast("¡Redirigiendo a WhatsApp con tu mensaje listo!");
    contactForm.reset();
  });
}

/**
 * Notificación Toast Flotante
 */
function showToast(message) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.className = "fixed bottom-28 right-6 z-50 bg-sky-500 text-slate-900 font-semibold px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-10 opacity-0 pointer-events-none";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("translate-y-10", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-10", "opacity-0");
  }, 3500);
}

/**
 * Efectos visuales de navegación suave
 */
function initScrollEffects() {
  const nav = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav?.classList.add("bg-slate-950/90", "backdrop-blur-md", "shadow-lg", "border-b", "border-slate-800");
    } else {
      nav?.classList.remove("bg-slate-950/90", "backdrop-blur-md", "shadow-lg", "border-b", "border-slate-800");
    }
  });
}
