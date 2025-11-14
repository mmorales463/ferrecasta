// === FORMULARIO DE CONTACTO (RF6) ===
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    // Objeto JSON a enviar
    const data = { nombre, correo, mensaje };

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      alert("¡Mensaje enviado con éxito!");
      form.reset();

    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar el mensaje.");
    }
  });
});
