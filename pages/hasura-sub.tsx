import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { VFC } from 'react'
import { Layout } from '../components/Layout'
import { GET_USERS_LOCAL } from '../queries/queries'
import { GetUsersQuery } from '../types/generated/graphql'

const FetchSub: VFC = () => {
  const { loading, data } = useQuery<GetUsersQuery>(GET_USERS_LOCAL)

  return (
    <Layout title="Hasura fetchPolicy read cache">
      <p className="mb-6 font-bold">Direct read out from cache</p>
      {loading
        ? 'Loading...'
        : data?.users.map((user) => (
            <p className="my-1" key={user.id}>
              {user.name}
            </p>
          ))}
      <Link href="hasura-main">
        <a className="mb-6">Back</a>
      </Link>
    </Layout>
  )
}

export default FetchSub
