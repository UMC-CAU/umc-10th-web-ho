import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'

function Navbar() {
  const amount = useSelector((state: RootState) => state.cart.amount)

  return (
    <header className="border-b border-slate-200/80 bg-slate-950 text-white shadow-lg shadow-slate-950/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            React + Redux Toolkit
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
            Redux Toolkit 장바구니
          </h1>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur-sm">
          <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-cyan-400 px-2 text-sm font-bold text-slate-950">
            {amount}
          </span>
          <span>전체 수량</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar