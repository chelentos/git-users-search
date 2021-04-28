<template>
  <div class="usersList">
    <div class="usersList__header">
      <div class="search">
        <input
          type="text"
          placeholder="Enter user login"
          class="search__input"
          v-model="login"
          @input="onLoginInput"
        />
        <div class="search__pagination">
          <span @click="onPrevClicked" class="search__pagination-btn"
            >Prev</span
          >
          <span class="search__pagination-pages"
            >{{ page }} of {{ totalPages }}</span
          >
          <span @click="onNextClicked" class="search__pagination-btn"
            >Next</span
          >
        </div>
        <button class="search__sort" @click="onChangeOrderClick">
          Num of reps. <span>{{ orderText }}</span>
        </button>
      </div>
    </div>
    <div class="usersList__content">
      <div v-if="!isLoading">
        <UserCard v-for="(user, index) in users" :key="index" :user="user" />
      </div>
      <Spinner v-else />
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'

import { Component, Vue } from 'vue-property-decorator'

import GitAPI from '@/api/requests/git'

import { User } from '@/types/interfaces/user'
import { SortOrder, SortOrderTranslate } from '@/types/config'

import UserCard from '@/components/UserCard.vue'
import Spinner from '@/components/utilities/Spinner.vue'

@Component({ components: { UserCard, Spinner } })
export default class UsersList extends Vue {
  private login = ''
  private users: User[] = []
  private isLoading = false

  private order: SortOrder = SortOrder.asc
  private page = 1
  private perPage = 30
  private totalPages = 1

  get orderText(): string {
    return SortOrderTranslate[this.order]
  }

  private async created(): Promise<void> {
    await this.loadUsersByLogin()
  }

  private async loadUsersByLogin() {
    this.isLoading = true
    if (this.login) {
      const response = await GitAPI.getUsersByLogin(
        this.login,
        this.order,
        this.perPage,
        this.page
      )
      this.users = response.data.items
      this.totalPages =
        response.data.total_count > this.perPage
          ? Math.ceil(response.data.total_count / this.perPage)
          : 1
    } else {
      this.users = []
      this.page = 1
      this.totalPages = 1
    }
    setTimeout(() => {
      this.isLoading = false
    }, 200)
  }

  private onLoginInput = _.debounce(this.loadUsersByLogin, 500)

  private onChangeOrderClick() {
    this.order = this.order === SortOrder.asc ? SortOrder.desc : SortOrder.asc
    this.page = 1
    this.totalPages = 1
    this.loadUsersByLogin()
  }

  private onPrevClicked() {
    if (this.page !== 1) {
      this.page -= 1
      this.loadUsersByLogin()
    }
  }

  private onNextClicked() {
    if (this.page !== this.totalPages) {
      this.page += 1
      this.loadUsersByLogin()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';

.usersList {
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: center;

  &__header {
    width: 100%;
    flex: 0 1 auto;
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    z-index: 1000000;
    padding: 10px;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  }

  &__content {
    width: 40%;
    margin-top: 70px;
    flex: 1 1 auto;
    padding: 0 10px;
  }
}

.search {
  width: 40%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__input {
    height: 40px;
    font-size: 1.2em;
    border: none;
    border-bottom: 1px solid $accent-color;
    padding-left: 5px;
    outline: none;
  }

  &__pagination {
    span {
      display: inline-block;
    }
    &-pages {
      margin: 0 10px;
      min-width: 80px;
      text-align: center;
    }
    &-btn {
      font-weight: 500;
      cursor: pointer;
    }
  }

  &__sort {
    height: 40px;
    font-size: 1em;
    font-weight: 600;
    color: #ffffff;
    background-color: $accent-color;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    outline: none;
  }
}

@media (max-width: 1200px) {
  .usersList__content {
    width: 60%;
  }

  .search {
    width: 60%;
  }
}

@media (max-width: 992px) {
  .usersList__content {
    width: 75%;
  }

  .search {
    width: 75%;
  }
}

@media (max-width: 768px) {
  .usersList__content {
    width: 90%;
  }

  .search {
    width: 90%;
  }
}

@media (max-width: 644px) {
  .search {
    width: 90%;
    flex-direction: column;

    &__input,
    &__pagination,
    &__sort {
      margin-bottom: 10px;
      width: 80%;
    }
  }

  .usersList__content {
    margin-top: 170px;
  }
}
</style>
