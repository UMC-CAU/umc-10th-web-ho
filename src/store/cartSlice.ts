import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import cartItems from '../constants/cartItems'
import type { CartItem } from '../types/cart'

interface CartState {
  cartItems: CartItem[]
  amount: number
  total: number
}

const calculateCartTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      const itemPrice = Number(item.price)
      acc.amount += item.amount
      acc.total += itemPrice * item.amount

      return acc
    },
    {
      amount: 0,
      total: 0,
    },
  )
}

const initialTotals = calculateCartTotals(cartItems)

const initialState: CartState = {
  cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)

      if (item) {
        item.amount += 1
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const itemIndex = state.cartItems.findIndex((cartItem) => cartItem.id === action.payload)

      if (itemIndex === -1) {
        return
      }

      const item = state.cartItems[itemIndex]

      if (item.amount <= 1) {
        state.cartItems.splice(itemIndex, 1)
        return
      }

      item.amount -= 1
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload)
    },
    clearCart: (state) => {
      state.cartItems = []
      state.amount = 0
      state.total = 0
    },
    calculateTotals: (state) => {
      const { amount, total } = calculateCartTotals(state.cartItems)

      state.amount = amount
      state.total = total
    },
  },
})

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions

export default cartSlice.reducer