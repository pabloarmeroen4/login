"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage({ params }) {
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const router = useRouter();
  const { token } = params;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevaContraseña }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(
          "¡Contraseña restablecida con éxito! Ahora puedes continuar explorando tus juegos favoritos."
        );
        router.push("/inicio");
      } else {
        alert(data.error || "Ocurrió un error. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      alert("Error al conectar con el servidor. Por favor, intenta más tarde.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-2xl border border-gray-700"
      >
        <h2 className="text-center text-2xl font-semibold text-blue-400 mb-6">
          Restablecer tu Contraseña
        </h2>

        <p className="text-center text-sm text-gray-400 mb-6">
          Introduce una nueva contraseña para volver a disfrutar de tus
          aventuras en Steam.
        </p>

        <div className="mb-6">
          <label
            htmlFor="nuevaContraseña"
            className="block text-sm font-medium text-blue-300 mb-2"
          >
            Nueva Contraseña:
          </label>
          <input
            type="password"
            id="nuevaContraseña"
            name="nuevaContraseña"
            value={nuevaContraseña}
            onChange={(e) => setNuevaContraseña(e.target.value)}
            placeholder="Ingresa tu nueva contraseña"
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Restablecer Contraseña
        </button>

        <div className="mt-6 text-center">
          <a
            href="/inicio"
            className="text-sm text-blue-400 hover:underline block mt-2"
          >
            Volver a la Tienda
          </a>
        </div>
      </form>
    </div>
  );
}
