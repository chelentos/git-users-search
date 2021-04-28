<template>
  <img ref="image" :width="width" :height="height" alt="user avatar" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class LazyImage extends Vue {
  @Prop(String) src?: string
  @Prop({ default: 100 }) width?: number
  @Prop({ default: 100 }) height?: number

  private observer?: IntersectionObserver

  private created() {
    this.observer = new IntersectionObserver(
      (entries: any[]) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            target.src = this.src
            this.observer!.unobserve(target)
          }
        })
      },
      {
        root: this.$el,
        rootMargin: '0px 0px 200px 0px',
      }
    )
  }

  private mounted() {
    this.observer!.observe(this.$el)
  }

  private beforeDestroy() {
    this.observer!.disconnect()
  }
}
</script>

<style lang="scss" scoped></style>
