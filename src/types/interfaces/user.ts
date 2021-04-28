export interface User {
  id: number
  login: string
  url: string
  avatar_url: string
}

export interface UserInfo {
  id: number
  login: string
  url: string
  avatar_url: string
  created_at: string
  followers: number
  public_repos: number
}
