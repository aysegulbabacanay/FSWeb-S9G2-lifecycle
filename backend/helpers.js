const { nanoid } = require("nanoid")
const yup = require('yup')

const schemaCreate = yup.object().shape({
  isim: yup
    .string()
    .trim()
    .required('görev ismi yazmak zorunludur')
    .max(100, 'görev ismi 100 karakterden az olmalıdır'),
  tamamlandi: yup
    .boolean()
    .typeError('tamamlandı değeri boolean olmalıdır')
})

let todos

const resetTodos = () => {
  todos = [
    { id: nanoid(5), isim: 'çamaşır', tamamlandi: false },
    { id: nanoid(5), isim: 'bulaşık', tamamlandi: false },
    { id: nanoid(5), isim: 'market alışverişi', tamamlandi: false },
  ]
}

resetTodos()

const getAll = async () => {
  const message = 'İşte yapılacaklarınız'
  return [200, { message, data: todos }]
}

const getById = async id => {
  let message, data, status
  try {
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
      status = 200
      data = todo
      message = `İşte '${id}' idli yapılacaklarınız`
    } else {
      status = 404
      message = `'${id}' idli bir todo bulunamadı :(`
    }
  } catch (err) {
    message = `Hata: ${err.message}`
    status = 422
  }
  return [status, { message, data }]
}

const create = async todoFromClient => {
  let message, data, status
  try {
    const validated = await schemaCreate.validate(todoFromClient, { stripUnknown: true })
    const todo = { id: nanoid(5), tamamlandi: false, ...validated }
    todos.push(todo)
    data = todo
    message = `İşte yeni oluşturduğunuz todo ${todo.id}`
    status = 201
  } catch (err) {
    message = `Hata: ${err.message}`
    status = 422
  }
  return [status, { message, data }]
}

const toggleDone = async id => {
  let message, data, status
  const todoFromClient = todos.find(todo => todo.id == id)
  if (todoFromClient) {
    todos = todos.map(todo => {
      if (todo.id == id) {
        data = { ...todo, tamamlandi: !todo.tamamlandi }
        return data
      }
      return todo
    })
    status = 200
    message = `İşte güncellediğiniz todo ${id}`
  } else {
    status = 404
    message = `'${id}' idli bir todo bulunamadı :(`
  }
  return [status, { message, data }]
}

module.exports = {
  getAll,
  getById,
  create,
  toggleDone,
  resetTodos, // only tests use this
}
