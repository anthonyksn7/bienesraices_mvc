import Precio from '../models/Precio.js';
import Categoria from '../models/Categoria.js';

const admin = (req, res) => {
  res.render('propiedades/admin', {
    title: 'Mis Propiedades',
    barra: true
  })
}

const crear = async (req, res) => {
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render('propiedades/crear', {
    title: 'Crear Propiedad',
    barra: true,
    categorias: categorias,
    precios: precios
  })

}

export {
  admin,
  crear
}