<template>
  <div>
    <page-header-wrapper>
      <a-card>
        <a-list class="comment-list" item-layout="horizontal" :data-source="data">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-comment :author="item.author" :avatar="item.avatar">
              <template slot="actions">
                <span v-for="action in item.actions">{{ action }}</span>
              </template>
              <p slot="content">
                {{ item.content }}
              </p>
              <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                <span>{{ item.datetime.fromNow() }}</span>
              </a-tooltip>
            </a-comment>
          </a-list-item>
        </a-list>
        <div>

          <a-pagination :default-current="6" :total="500" />
        </div>
      </a-card>
    </page-header-wrapper>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      data: [
        {
          actions: ['地区：无锡'],
          author: '用户：未知',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: '用户查看了您的名片,',
          datetime: moment().subtract(1, 'days')
        },
        {
        actions: ['地区：无锡'],
          author: '用户：15151317576',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: '产品咨询',
          datetime: moment().subtract(2, 'days')
        }
      ],
      moment
    }
  }
}
</script>

<style lang="scss" scoped></style>
