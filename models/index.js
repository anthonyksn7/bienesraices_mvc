import Propiedad from'./Propiedad.js'
import Categoria from './Categoria.js'
import Precio from './Precio.js'
import User from './User.js'

Propiedad.belongsTo(Precio, { foreignKey: 'llaveForaneaPrecio' })



export {
  Propiedad,
  Categoria,
  Precio,
  User
}