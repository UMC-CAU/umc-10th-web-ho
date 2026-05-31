import { useCartStore } from '../store/useCartStore'
import type { CartItem as CartItemType } from '../types/cart'

interface CartItemProps {
  item: CartItemType
}

function CartItem({ item }: CartItemProps) {
  const { decrease, increase, removeItem } = useCartStore()

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-4">
        <img
          src={item.img}
          alt={item.title}
          className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
        />

        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold tracking-tight text-slate-900">
            {item.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{item.singer}</p>
          <p className="mt-2 text-base font-extrabold text-slate-900">
            ${Number(item.price).toLocaleString('en-US')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
        <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => decrease(item.id)}
            className="px-4 py-2 text-lg font-semibold text-slate-600 transition hover:bg-slate-200/70 hover:text-slate-900"
            aria-label={`${item.title} 수량 감소`}
          >
            -
          </button>
          <span className="min-w-12 border-x border-slate-200 px-4 py-2 text-center text-base font-bold text-slate-900">
            {item.amount}
          </span>
          <button
            type="button"
            onClick={() => increase(item.id)}
            className="px-4 py-2 text-lg font-semibold text-slate-600 transition hover:bg-slate-200/70 hover:text-slate-900"
            aria-label={`${item.title} 수량 증가`}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
        >
          삭제
        </button>
      </div>
    </article>
  )
}

export default CartItem
