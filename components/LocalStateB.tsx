import { useReactiveVar } from '@apollo/client'
import Link from 'next/link'
import { VFC } from 'react'
import { todoVar } from '../cache'

export const LocalStateB: VFC = () => {
  const todos = useReactiveVar(todoVar)

  return (
    <>
      {todos.map((todo, index) => (
        <p key={index} className="mb-3">
          {todo.title}
        </p>
      ))}
      <Link href="/local-state-a">
        <a>Back</a>
      </Link>
    </>
  )
}
