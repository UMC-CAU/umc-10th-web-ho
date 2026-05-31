import { create } from 'zustand'
import cartItems from '../constants/cartItems'
import type { CartItem } from '../types/cart'

interface CartTotals {
  amount: number
  total: number
}

interface CartStoreState extends CartTotals {
  cartItems: CartItem[]
  isOpen: boolean
  increase: (id: string) => void
  decrease: (id: string) => void
  removeItem: (id: string) => void
  clearCart: () => void
  calculateTotals: () => void
  openModal: () => void
  closeModal: () => void
}

const calculateCartTotals = (items: CartItem[]): CartTotals => {
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

const initialCartItems = cartItems.map((item) => ({ ...item }))
const initialTotals = calculateCartTotals(initialCartItems)

export const useCartStore = create<CartStoreState>((set) => ({
  cartItems: initialCartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
  isOpen: false,
  increase: (id) =>
    set((state) => {
      const nextItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      )
      const totals = calculateCartTotals(nextItems)

      return {
        cartItems: nextItems,
        ...totals,
      }
    }),
  decrease: (id) =>
    set((state) => {
      const nextItems = state.cartItems.flatMap((item) => {
        if (item.id !== id) {
          return [item]
        }

        if (item.amount <= 1) {
          return []
        }

        return [{ ...item, amount: item.amount - 1 }]
      })
      const totals = calculateCartTotals(nextItems)

      return {
        cartItems: nextItems,
        ...totals,
      }
    }),
  removeItem: (id) =>
    set((state) => {
      const nextItems = state.cartItems.filter((item) => item.id !== id)
      const totals = calculateCartTotals(nextItems)

      return {
        cartItems: nextItems,
        ...totals,
      }
    }),
  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),
  calculateTotals: () =>
    set((state) => ({
      ...calculateCartTotals(state.cartItems),
    })),
  openModal: () =>
    set({
      isOpen: true,
    }),
  closeModal: () =>
    set({
      isOpen: false,
    }),
}))
