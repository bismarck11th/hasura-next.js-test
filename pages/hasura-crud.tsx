import { useMutation, useQuery } from '@apollo/client'
import { FormEvent, useState, VFC } from 'react'
import { Layout } from '../components/Layout'
import { UserItems } from '../components/UserItem'
import {
  CREATE_USER,
  DELETE_USER,
  GET_USERS,
  UPDATE_USER,
} from '../queries/queries'
import {
  CreateUserMutation,
  DeleteUserMutation,
  GetUsersQuery,
  UpdateUserMutation,
} from '../types/generated/graphql'

const HasuraCRUD: VFC = () => {
  const [editedUser, setEditedUser] = useState({ id: '', name: '' })
  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'network-only',
  })

  const [update_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER)
  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    update(cache, { data: { insert_users_one } }) {
      const cacheId = cache.identify(insert_users_one)
      cache.modify({
        fields: {
          users(existingUsers, { toReference }) {
            return [toReference(cacheId), ...existingUsers]
          },
        },
      })
    },
  })
  const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER, {
    update(cache, { data: { delete_users_by_pk } }) {
      cache.modify({
        fields: {
          users(exitingUsers, { readField }) {
            return exitingUsers.filter(
              (user) => delete_users_by_pk.id !== readField('id', user)
            )
          },
        },
      })
    },
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedUser.id) {
      try {
        await update_users_by_pk({
          variables: {
            id: editedUser.id,
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    } else {
      try {
        await insert_users_one({
          variables: {
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    }
  }

  if (error) return <Layout title="Hasura CRUD">{error.message}</Layout>

  return (
    <Layout title="Hasura Crud">
      <p className="mb-6 font-bold">Hasura CRUD</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <input
          type="text"
          placeholder="New user ?"
          className="px-3 py-2 border border-gray-300"
          value={editedUser.name}
          onChange={(e) =>
            setEditedUser({ ...editedUser, name: e.target.value })
          }
        />
        <button
          disabled={!editedUser.name}
          data-testid="new"
          type="submit"
          className="disabled:opacity-40 my-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
        >
          {editedUser.id ? 'Update' : 'Cerate'}
        </button>
      </form>
      {data?.users.map((user) => (
        <UserItems
          key={user.id}
          user={user}
          setEditedUser={setEditedUser}
          delete_users_by_pk={delete_users_by_pk}
        />
      ))}
    </Layout>
  )
}

export default HasuraCRUD
