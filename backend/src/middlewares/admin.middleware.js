export function adminOnly(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  } catch (error) {
    console.error('Error en adminOnly:', error);
    return res.status(500).json({ message: 'Error en validación de rol' });
  }
}