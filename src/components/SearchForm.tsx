import { memo, type FormEvent } from 'react'
import { LANGUAGE_OPTIONS } from '../constants/movie'

interface SearchFormProps {
  query: string
  includeAdult: boolean
  language: string
  isLoading: boolean
  onQueryChange: (query: string) => void
  onIncludeAdultChange: (includeAdult: boolean) => void
  onLanguageChange: (language: string) => void
  onSubmit: () => void
}

function SearchForm({
  query,
  includeAdult,
  language,
  isLoading,
  onQueryChange,
  onIncludeAdultChange,
  onLanguageChange,
  onSubmit,
}: SearchFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="영화 제목을 입력하세요"
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <label className="flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={(event) => onIncludeAdultChange(event.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          성인 콘텐츠 표시
        </label>
      </div>

      <select
        value={language}
        onChange={(event) => onLanguageChange(event.target.value)}
        className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-md bg-blue-500 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? '검색 중...' : '검색하기'}
      </button>
    </form>
  )
}

// 입력값이나 옵션이 바뀌지 않으면 검색 폼은 다시 렌더링할 필요가 적어서 memo를 사용합니다.
export default memo(SearchForm)
