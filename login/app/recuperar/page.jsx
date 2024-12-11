"use client";
import React, { useState } from "react";
import axios from "axios";
import apiClient from "@/axios";
import { useRouter } from "next/navigation";

export default function RecuperarContraseña() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(""); // Para manejar mensajes de error específicos
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); // Limpiar mensaje previo
    setError(""); // Limpiar error previo

    try {
      const response = await apiClient.post("/api/forgot-password", { correo }); // Asegúrate de usar rutas relativas en Next.js
      setMensaje(response.data.message);

      // Cambia "#" por la ruta que prefieras para redirigir después del envío
      router.push("/confirmacion-envio");
    } catch (error) {
      // Manejo de errores refinado
      setError(
        error.response?.data?.error ||
          "Hubo un problema al procesar tu solicitud."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-28 p-10 bg-purple-100 rounded-lg shadow-lg"
    >
      <h1 className="text-center text-lg font-semibold text-purple-700">
        Recuperar Contraseña
      </h1>
      <div className="mb-5">
        <label htmlFor="correo" className="block mb-2 text-sm text-purple-700">
          Correo:
        </label>
        <input
          type="email"
          id="correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="w-full p-2 rounded bg-purple-50 border border-purple-300 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="example@gmail.com"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-purple-600 text-white rounded shadow-md transition-all duration-300 ease-in-out hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Enviar Enlace
      </button>
      {/* Mostrar mensajes dinámicos */}
      {mensaje && (
        <p className="mt-4 text-center text-sm text-green-500">{mensaje}</p>
      )}
      {error && (
        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
      )}
    </form>
  );
}
