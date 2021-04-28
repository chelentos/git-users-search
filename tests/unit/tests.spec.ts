import { shallowMount } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'
import UsersList from '@/views/UsersList.vue'
import { UserInfo } from '@/types/interfaces/user'
import { SortOrder } from '@/types/config'

const userInfo: UserInfo = {
  id: 1,
  login: 'login123',
  url: 'url',
  avatar_url: 'avatar_url',
  created_at: '2021-04-27T18:16:38+00:00',
  followers: 10,
  public_repos: 12,
}

describe('UserCard.vue', () => {
  it('show created date properly', () => {
    const wrapper = shallowMount(UserCard, {
      data() {
        return { userInfo, showInfo: true }
      },
    })
    expect(wrapper.find('.created').text()).toEqual('Created: 27.04.2021')
  })

  it('shows full info only if showInfo === true', async () => {
    const wrapper = shallowMount(UserCard, {
      data() {
        return { userInfo, showInfo: false }
      },
    })

    expect(wrapper.find('.created').exists()).toBeFalsy()

    wrapper.setData({ userInfo, showInfo: true })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.created').exists()).toBeTruthy()
  })
})

describe('UsersList.vue', () => {
  it('reset pages on sort', async () => {
    const wrapper = shallowMount(UsersList, {
      data() {
        return { order: SortOrder.asc, page: 1, totalPages: 10 }
      },
    })
    wrapper.find('.search__sort').trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$data.page).toEqual(1)
    expect(wrapper.vm.$data.totalPages).toEqual(1)
    expect(wrapper.vm.$data.order).toEqual(SortOrder.desc)
  })
})
