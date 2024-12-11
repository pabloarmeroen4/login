"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("steamToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginClick = () => {
    router.push("/inicio");
  };

  const handleUsersClick = () => {
    if (!isAuthenticated) {
      setShowModal(true);
    } else {
      router.push("/users");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("steamToken");
    setIsAuthenticated(false);
    router.push("/inicio");
  };

  return (
    <>
      <nav className="bg-gray-900 border-gray-700">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://w7.pngwing.com/pngs/17/576/png-transparent-steam-video-game-videogame-brands-and-logos-icon.png"
              alt="Steam Logo"
              className="h-10"
            />
            <span className="text-white text-xl font-bold">Steam</span>
          </a>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="relative px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md group transition-transform duration-300 ease-in-out hover:translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <span className="relative z-10">Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="relative px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md group transition-transform duration-300 ease-in-out hover:translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span className="relative z-10">Iniciar Sesión</span>
              </button>
            )}
            <a
              href="/registro"
              className="relative px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md group transition-transform duration-300 ease-in-out hover:translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span className="relative z-10">Crear Cuenta</span>
            </a>
          </div>
        </div>
      </nav>
      <nav className="bg-gray-800">
        <div className="max-w-screen-xl px-6 py-3 mx-auto">
          <div className="flex items-center">
            <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm text-gray-300">
              <li>
                <a
                  href="#"
                  className="hover:underline"
                  onClick={handleUsersClick}
                >
                  Comunidad de Steam
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-white">Atención</h2>
            <p className="mt-2 text-gray-300">
              Debes iniciar sesión para acceder a la comunidad.
            </p>
            <br />
            <button
              className="relative px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md transition-transform transform duration-300 ease-in-out hover:translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {isAuthenticated && (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-white text-3xl">
            Bienvenido a tu Biblioteca de Steam
          </h1>
        </div>
      )}
    </>
  );
};

export default Home;
