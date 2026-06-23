import { useDispatch } from 'react-redux'
import { clearCart } from '../features/cart/cartSlice'
import { closeModal } from '../features/modal/modalSlice'
import type { AppDispatch } from '../store/store'

function Modal() {
  const dispatch = useDispatch<AppDispatch>()

  const handleClearCart = () => {
    dispatch(clearCart())
    dispatch(closeModal())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl shadow-slate-950/30">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          장바구니를 비우시겠습니까?
        </h2>
        <p className="mt-3 text-sm font-medium text-slate-500">
          선택한 모든 상품이 장바구니에서 삭제됩니다.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => dispatch(closeModal())}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleClearCart}
            className="rounded-xl bg-rose-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-400"
          >
            네
          </button>
        </div>
      </section>
    </div>
  )
}

export default Modal
