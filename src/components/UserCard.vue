<template>
  <div class="card" ref="card" :class="cardClass" @click="onCardClick">
    <Spinner v-show="isLoading" />
    <div v-show="!isLoading" class="card__content">
      <div class="card__image">
        <LazyImage :src="avatarLink" />
      </div>
      <div v-if="!showInfo" class="card__info">
        <p class="login">
          <strong>{{ login }}</strong>
        </p>
      </div>
      <div v-else class="card__info">
        <p class="login">
          <strong>{{ login }}</strong>
        </p>
        <div v-if="userInfo">
          <p class="created">
            <strong>Created:</strong> <em>{{ createdDate }}</em>
          </p>
          <p class="repos">
            <strong>Public repos:</strong> <em>{{ userInfo.public_repos }}</em>
          </p>
          <p class="followers">
            <strong>Followers:</strong> <em>{{ userInfo.followers }}</em>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Prop, Vue } from 'vue-property-decorator'

import { User, UserInfo } from '@/types/interfaces/user'

import GitAPI from '@/api/requests/git'

import Spinner from '@/components/utilities/Spinner.vue'
import LazyImage from '@/components/utilities/LazyImage.vue'

@Component({ components: { Spinner, LazyImage } })
export default class Home extends Vue {
  @Prop() user?: User

  private isLoading = false
  private showInfo = false

  private userInfo?: UserInfo

  get avatarLink(): string {
    return this.user?.avatar_url ?? ''
  }

  get login(): string {
    return this.showInfo ? this.userInfo?.login ?? '' : this.user?.login ?? ''
  }

  get createdDate(): string {
    return moment(this.userInfo?.created_at).format('DD.MM.YYYY') ?? ''
  }

  get cardClass(): string {
    return this.showInfo ? 'card-full' : ''
  }

  private async onCardClick() {
    if (!this.showInfo) {
      this.isLoading = true
      const response = await GitAPI.getUserInfoByLogin(this.user!.login)
      this.userInfo = response.data
      this.showInfo = true
      setTimeout(() => {
        this.isLoading = false
      }, 800)
    } else {
      this.isLoading = true
      this.showInfo = false
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 200px;
  transition: height 0.3s ease-out;
  margin-bottom: 25px;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  &-full {
    height: 250px;
    transition: height 0.3s ease-out;

    .card__image {
      height: 150px;
      align-items: flex-start;
      padding-top: 50px;
    }
  }

  &__content {
    height: 100%;
  }

  &__image {
    float: left;
    height: 100%;
    display: flex;
    padding: 0 20px;
    justify-content: center;
    align-items: center;
  }

  &__info {
    padding-top: 50px;
  }
}

.login {
  margin: 0;
  font-size: 1.4em;
  font-weight: 600;
}

@media (max-width: 768px) {
  .login {
    word-break: break-all;
  }
}
</style>
