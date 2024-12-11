"use client";
import React, { useState } from "react";
import axios from "axios";
import apiClient from "@/axios";

export default function SteamLogin() {
  const [formData, setFormData] = useState({ correo: "", contraseña: "" });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post(
        "http://localhost:5000/api/login",
        formData
      );
      setMensaje("Inicio de sesión exitoso. Bienvenido a Steam.");
      localStorage.setItem("steamToken", response.data.token);
    } catch (error) {
      setMensaje(
        error.response?.data?.error ||
          "Error al iniciar sesión. Por favor, verifica tus credenciales."
      );
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-gray-900 p-12 mt-36 rounded-lg shadow-2xl border border-gray-700"
      >
        <h1 className="text-center text-2xl font-semibold text-white mb-6">
          Iniciar Sesión en Steam
        </h1>
        <div className="mb-10">
          <label
            htmlFor="correo"
            className="block mb-4 text-sm font-medium text-gray-400"
          >
            Correo Electrónico:
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800"
            required
          />
        </div>
        <div className="mb-10">
          <label
            htmlFor="contraseña"
            className="block mb-4 text-sm font-medium text-gray-400"
          >
            Contraseña:
          </label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="w-full p-2 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out"
        >
          Iniciar Sesión
        </button>
        <div className="mt-6 text-center">
          {mensaje && <p className="text-sm text-blue-400 mt-4">{mensaje}</p>}
          <a
            href="/"
            className="text-sm text-blue-500 hover:underline mt-2 block"
          >
            Volver a la Biblioteca
          </a>
          <a
            href="/recover-password"
            className="text-sm text-blue-500 hover:underline mt-2 block"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </>
  );
}
