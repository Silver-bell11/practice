const orderDao = require('../models/orderDao')
const { v4: uuidv4 } = require('uuid')

const getOrderFromCart = async (userId) => {
  const order = await orderDao.getOrderFromCart(userId)
  const productIds = order.map((order) => order.productId)
  const products = await orderDao.getProductsByProductIds(productIds)
  const options = await orderDao.getOptionsByProductIds(productIds)

  const productObj = {}
  products.forEach((product) => {
    productObj[product.id] = product
  })

  const optionsObj = {}
  options.forEach((option) => {
    optionsObj[option.productId] = option
  })

  const joinedOrder = order.map((cart) => ({
    id: cart.id,
    userId: cart.userId,
    quantity: cart.quantity,
    productId: cart.productId,
    productName: productObj[cart.productId].name,
    productPrice: Math.floor(productObj[cart.productId].price),
    productStyleCode: productObj[cart.productId].styleCode,
    size: optionsObj[cart.productId].size,
    stock: optionsObj[cart.productId].stock
  }))

  return joinedOrder
}

const getOrder = async (user, orderId) => {
  return await orderDao.getOrder(user, orderId)
}

const checkout = async (user, cart) => {
  const orderNumber = uuidv4()
  return await orderDao.checkout(user, cart, orderNumber)
}

module.exports = {
  getOrderFromCart,
  getOrder,
  checkout,
}