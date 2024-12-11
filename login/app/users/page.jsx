"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "@/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("steamToken");
      const response = await apiClient.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setError("No se encontraron usuarios registrados.");
      }
    } catch (error) {
      console.error("Error al cargar los usuarios:", error.message);
      setError(
        `Error al cargar usuarios: ${
          error.response ? error.response.data.error : error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este usuario?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("steamToken");
      await apiClient.delete(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
      alert("Usuario eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error.message);
      alert("No se pudo eliminar el usuario. Intenta nuevamente.");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewName(user.nombre);
    setNewEmail(user.correo);
  };

  const handleSaveEdit = async () => {
    if (!newName || !newEmail) {
      alert("El nombre y el correo no pueden estar vacíos.");
      return;
    }

    try {
      const token = localStorage.getItem("steamToken");
      const updatedUser = { nombre: newName, correo: newEmail };
      await apiClient.put(`/api/users/${editingUser._id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(
        users.map((user) =>
          user._id === editingUser._id
            ? { ...user, nombre: newName, correo: newEmail }
            : user
        )
      );
      setEditingUser(null);
      setNewName("");
      setNewEmail("");
      alert("Usuario actualizado exitosamente.");
    } catch (error) {
      console.error("Error al editar usuario:", error.message);
      alert("No se pudo actualizar el usuario. Intenta nuevamente.");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-xl text-gray-300">Cargando usuarios...</p>
    );
  }

  return (
    <div className="relative overflow-x-auto shadow-xl rounded-lg bg-gray-900">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-gray-800 rounded-t-lg px-6">
        <h2 className="text-2xl font-semibold text-center text-blue-400">
          Gestión de Usuarios de Steam
        </h2>
      </div>

      {error && (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      )}

      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-200 uppercase bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3">
              Correo
            </th>
            <th scope="col" className="px-6 py-3">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user._id}
                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-6 py-4">{user.nombre}</td>
                <td className="px-6 py-4">{user.correo}</td>
                <td className="px-6 py-4">
                  <button
                    className="font-medium text-blue-400 hover:underline mr-4"
                    onClick={() => handleEditUser(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="font-medium text-red-400 hover:underline"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl mb-4 text-gray-300">Editar Usuario</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded mb-4 bg-gray-900 text-gray-300"
              placeholder="Nuevo nombre"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded mb-4 bg-gray-900 text-gray-300"
              placeholder="Nuevo correo"
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded"
                onClick={handleSaveEdit}
              >
                Guardar
              </button>
              <button
                className="bg-red-500 text-white px-6 py-2 rounded"
                onClick={() => setEditingUser(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
