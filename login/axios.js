import axios from "axios";

// Crea una instancia de Axios con la configuración predeterminada
const apiClient = axios.create({
  baseURL: "http://localhost:5000", // Cambia el puerto si tu backend está en otro
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;