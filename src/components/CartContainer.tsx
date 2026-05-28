import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { calculateTotals } from '../features/cart/cartSlice'
import { openModal } from '../features/modal/modalSlice'
import type { AppDispatch, RootState } from '../store/store'
import CartItem from './CartItem'
import Modal from './Modal'

function CartContainer() {
  const dispatch = useDispatch<AppDispatch>()
  const { cartItems, total } = useSelector((state: RootState) => state.cart)
  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen)

  useEffect(() => {
    dispatch(calculateTotals())
  }, [cartItems, dispatch])

  const isEmpty = cartItems.length === 0

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 sm:px-7">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            장바구니 목록
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            수량을 조절하거나 항목을 제거해 보세요.
          </p>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          {isEmpty ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center text-base font-medium text-slate-500">
              장바구니가 비어 있습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4 rounded-2xl bg-slate-950 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-medium text-slate-300">총 금액</p>
              <p className="mt-1 text-2xl font-black tracking-tight">
                ${total.toLocaleString('en-US')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dispatch(openModal())}
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99]"
            >
              전체 삭제
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && <Modal />}
    </main>
  )
}

export default CartContainer
