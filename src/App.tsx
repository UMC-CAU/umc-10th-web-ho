import { useState } from 'react'
import { useCustomFetch } from './hooks/useCustomFetch'

type User = {
  id: number
  name: string
  email: string
}

const getUserUrl = (userId: number, shouldFail: boolean) => {
  if (shouldFail) {
    return 'https://jsonplaceholder.typicode.com/users/404-not-found'
  }

  return `https://jsonplaceholder.typicode.com/users/${userId}`
}

function UserProfile({ userId, shouldFail }: { userId: number; shouldFail: boolean }) {
  const url = getUserUrl(userId, shouldFail)
  const { data, error, failureCount, isError, isFetching, isPending } = useCustomFetch<User>(url)

  if (isPending) {
    return <p className="status-text">사용자 정보를 불러오는 중...</p>
  }

  if (isError) {
    return (
      <div className="result error-result">
        <h1>요청 실패</h1>
        <p>{error.message}</p>
        <small>재시도 횟수: {failureCount}</small>
      </div>
    )
  }

  return (
    <div className="result">
      {isFetching && <span className="fetching-badge">캐시 확인 중</span>}
      <h1>{data.name}</h1>
      <p>{data.email}</p>
      <small>User ID: {data.id}</small>
    </div>
  )
}

function App() {
  const [userId, setUserId] = useState(1)
  const [isMounted, setIsMounted] = useState(true)
  const [shouldFail, setShouldFail] = useState(false)

  const handleChangeUser = () => {
    setShouldFail(false)
    setUserId((currentId) => (currentId === 10 ? 1 : currentId + 1))
  }

  const handleRetryTest = () => {
    setIsMounted(true)
    setShouldFail(true)
  }

  return (
    <main className="app">
      <div className="actions">
        <button onClick={handleChangeUser} type="button">
          다른 사용자 불러오기
        </button>
        <button onClick={() => setIsMounted((mounted) => !mounted)} type="button">
          컴포넌트 토글 (언마운트 테스트)
        </button>
        <button className="warning-button" onClick={handleRetryTest} type="button">
          재시도 테스트 (404 에러)
        </button>
      </div>

      {isMounted ? (
        <UserProfile shouldFail={shouldFail} userId={userId} />
      ) : (
        <p className="status-text">컴포넌트가 언마운트되었습니다.</p>
      )}
    </main>
  )
}

export default App
