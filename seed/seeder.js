import { exit } from 'node:process'
import categorias from './categorias.js'
import precios from './precios.js'
import { Categoria, Precio} from '../models/index.js'
import db from '../config/db.js'

const importarDatos = async () => {
  try {
    // Autenticar
    await db.authenticate()

    // Sincronizar
    await db.sync()

    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios)
    ])
    console.log('Datos importados correctamente')
    exit(0)

  } catch (error) {
    console.log(error)
    exit(1)
  }
}

const eliminarDatos = async () => {
  try {
    await db.sync({ force: true })
    console.log('Datos eliminados correctamente')
    exit(0)
  } catch (error) {
    console.log(error)
    exit(1)
  }
}

if (process.argv[2] === '-i') {
  importarDatos()
}

if (process.argv[2] === '-e') {
  eliminarDatos()
}

