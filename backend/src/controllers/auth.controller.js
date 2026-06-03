import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_demo';

export function register(req, res) {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  db.query(
    'SELECT id_usuario FROM usuarios WHERE correo = ?',
    [correo],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al validar correo' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
      }

      try {
        const hash = await bcrypt.hash(password, 10);

        db.query(
          'INSERT INTO usuarios (nombre, correo, password, rol, estado) VALUES (?, ?, ?, ?, ?)',
          [nombre, correo, hash, 'cliente', 'activo'],
          (error2, result) => {
            if (error2) {
              console.error(error2);
              return res.status(500).json({ message: 'Error al registrar usuario' });
            }

            const token = jwt.sign(
              { id: result.insertId, nombre, correo, rol: 'cliente' },
              JWT_SECRET,
              { expiresIn: '1d' }
            );

            res.json({
              token,
              user: {
                id_usuario: result.insertId,
                nombre,
                correo,
                rol: 'cliente'
              }
            });
          }
        );
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al cifrar contraseña' });
      }
    }
  );
}

export function login(req, res) {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  db.query(
    'SELECT * FROM usuarios WHERE correo = ? LIMIT 1',
    [correo],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const user = results[0];

      if (user.estado && user.estado !== 'activo') {
        return res.status(403).json({ message: 'Usuario inactivo' });
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        {
          id: user.id_usuario,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol
        },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        token,
        user: {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol
        }
      });
    }
  );
}

export function me(req, res) {
  res.json(req.user);
}