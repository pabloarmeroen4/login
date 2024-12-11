const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
console.log(process.env);


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Acceso no autorizado. Por favor, inicia sesión." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
};

// Registro de usuario
app.post('/api/register', async (req, res) => {
  const { nombre, apellido, correo, contraseña } = req.body;
  try {
    const user = new User({ nombre, apellido, correo, contraseña }); // Contraseña sin hashear
    await user.save(); // El middleware la hashea automáticamente
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'El correo ya está registrado' });
    } else {
      res.status(400).json({ error: 'Error al registrar usuario', details: err.message });
    }
  }
});





// Inicio de sesión
app.post('/api/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log("Contraseña ingresada:", contraseña);
    console.log("Contraseña almacenada:", user.contraseña);

    const isMatch = await user.comparePassword(contraseña);
    console.log("¿Las contraseñas coinciden?", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
});



// Ruta protegida para obtener usuarios
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No se encontraron usuarios." });
    }
    res.json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error.message);
    res.status(500).json({ error: "Error al obtener los usuarios", details: error.message });
  }
});

// Editar usuario
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, correo } = req.body; // Campos editables
  try {
    const user = await User.findByIdAndUpdate(id, { nombre, correo }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado con éxito', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario', details: error.message });
  }
});

// Eliminar usuario
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario', details: error.message });
  }
});



app.post('/api/recover-password', async (req, res) => {
  const { correo } = req.body;
  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Generar un token de recuperación
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar correo electrónico
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: 'Recuperación de contraseña',
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: 
http://localhost:3000/reset-password/${token}`,

    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Correo de recuperación enviado' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error al enviar el correo', details: err.message });
  }
});

app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { nuevaContraseña } = req.body;
  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario por ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Asignar nueva contraseña (sin hashearla aquí)
    user.contraseña = nuevaContraseña;

    // Guardar usuario (el middleware se encargará de hashearla)
    await user.save();
    res.json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado', details: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
