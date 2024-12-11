"use client";

import React, { useState } from "react";
import axios from "axios";
import apiClient from "@/axios";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setTipoMensaje("");

    try {
      const response = await apiClient.post("/api/register", formData);
      setMensaje(
        response.data.message ||
          "Registro exitoso. ¡Bienvenido a la comunidad gamer!"
      );
      setTipoMensaje("success");
    } catch (error) {
      if (error.response?.data?.error === "El correo ya está registrado") {
        setMensaje(
          "Este correo ya está en uso. ¡Prueba con otro para comenzar tu aventura!"
        );
        setTipoMensaje("error");
      } else {
        setMensaje(
          error.response?.data?.error ||
            "Ocurrió un error inesperado. Inténtalo más tarde. chupamelo"
        );
        setTipoMensaje("error");
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-32 bg-gray-900 p-8 rounded-lg shadow-2xl border border-gray-700"
      >
        <h2 className="text-center text-2xl font-semibold text-blue-400 mb-6">
          Únete a Steam
        </h2>

        <div className="mb-6">
          <label
            htmlFor="nombre"
            className="block mb-2 text-sm font-medium text-blue-300"
          >
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="apellido"
            className="block mb-2 text-sm font-medium text-blue-300"
          >
            Apellido:
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="correo"
            className="block mb-2 text-sm font-medium text-blue-300"
          >
            Correo:
          </label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="contraseña"
            className="block mb-2 text-sm font-medium text-blue-300"
          >
            Contraseña:
          </label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-lg text-gray-200 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Registrarse
        </button>

        {mensaje && (
          <p
            className={`text-center text-sm mt-4 ${
              tipoMensaje === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {mensaje}
          </p>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-blue-400 hover:underline block mt-2"
          >
            Volver a la Tienda
          </a>
        </div>
      </form>
    </>
  );
}
