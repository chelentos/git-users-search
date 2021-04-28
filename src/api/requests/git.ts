import http from '@/api/http'
import { SortOrder } from '@/types/config'
import { AxiosPromise } from 'axios'

const GIT_API_URL = 'https://api.github.com'

export default class GitAPI {
  public static getUsersByLogin(
    login: string,
    order: SortOrder = SortOrder.asc,
    perPage = 20,
    page = 1
  ): AxiosPromise {
    const params = new URLSearchParams()
    params.append('q', login)
    params.append('sort', 'repositories')
    params.append('order', order)
    params.append('per_page', String(perPage))
    params.append('page', String(page))
    return http.get(`${GIT_API_URL}/search/users`, { params })
  }

  public static getUserInfoByLogin(login: string): AxiosPromise {
    return http.get(`${GIT_API_URL}/users/${login}`)
  }
}
