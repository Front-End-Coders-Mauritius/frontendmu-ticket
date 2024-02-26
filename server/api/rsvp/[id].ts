import useAuth from "~/composables/auth-utils/useAuth"



export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { readRsvp } = useAuth()

  if (!id) {
    return
  }

  const result = await readRsvp({ id, user_id : '1aa6e2a6-985a-49a0-8cc6-9155a29d3b05', event_id: '50' })
  return result
})