"use client";

import { useState } from "react";

export default function RecoverPasswordPage() {
  const [correo, setCorreo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/recover-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700"
      >
        <h2 className="text-center text-2xl font-semibold text-blue-400 mb-6">
          Recuperar Contraseña de tu Cuenta Steam
        </h2>

        <div className="mb-6">
          <label
            htmlFor="correo"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Correo Electrónico Asociado a tu Cuenta:
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ingresa tu correo electrónico"
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Recuperar Contraseña
        </button>
      </form>
    </div>
  );
}
