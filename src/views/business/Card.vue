<template>
  <page-header-wrapper>
    <a-card>
      <a-row>
        <a-col :span="10">
          <div class="card">
            <div class="f-r f-a-c f-j-b">
              <div>
                <div class="companyName">
                  常州天正工业有限公司
                </div>
                <div class="companyEnglishName">
                  PenguinToyLand
                </div>
                <div class="companyAddress">
                  100 台北市忠孝東路走九遍
                </div>
                <div class="companyWebsite">
                  www.PenguinToyLand.com
                </div>
              </div>
              <div>
                <a-avatar shape="square" size="large" icon="user" />
              </div>
            </div>
            <div>
              <div class="userTitle">
                忠孝旗艦館店長
              </div>
              <span class="userChineseName">鄧小鵝</span>
              <span class="userEnglishName">Yuru Deng</span>
            </div>
            <div class="infos">
              <span class="infoTitle">電話</span>
              <span class="info">02-8877-7788 轉 520</span>
              <br />
              <span class="infoTitle">手機</span>
              <span class="info">0988-168-168</span>
              <br />
              <span class="infoTitle">LineID</span>
              <span class="info">penguintoylandyuru</span>
            </div>
            <div class="backgroundImageBig"></div>
            <div class="backgroundImageSmall"></div>
          </div>
          <a-space :size="8">
            <a-button type="primary">切换模板</a-button>
            <a-button >分享</a-button>
            <a-button>生成二维码</a-button>
            <a-button>定制</a-button>
          </a-space>
        </a-col>
        <a-col :span="14">
          <a-form @submit="handleSubmit" :form="form">
            <a-form-item
              label="公司名称"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="['name', { rules: [{ required: true, message: '公司名称不能为空' }] }]"
                name="name"
                placeholder="请输入公司名称"
              />
            </a-form-item>
            <a-form-item
              label="公司英文名称"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="['name', { rules: [{ required: true, message: '公司英文名称不能为空' }] }]"
                name="name"
                placeholder="请输入公司英文名称"
              />
            </a-form-item>
            <a-form-item
              label="公司地址"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="['name', { rules: [{ required: true, message: '公司地址不能为空' }] }]"
                name="name"
                placeholder="请输入公司地址"
              />
            </a-form-item>
            <a-form-item
              label="职位信息"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="['name', { rules: [{ required: true, message: '职位信息不能为空' }] }]"
                name="name"
                placeholder="请输入您的职位名称"
              />
            </a-form-item>
            <a-form-item
              label="电话"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="['name']"
                name="name"
                placeholder="请输入您的座机电话"
              />
            </a-form-item>
            <a-form-item
              label="手机号码"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="['name', { rules: [{ required: true, message: '手机号码不能为空' }] }]"
                name="name"
                placeholder="请输入您的手机号码"
              />
            </a-form-item>
            <a-form-item
              label="电子邮件"
              :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
              :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
            >
              <a-input
                v-decorator="['name']"
                name="name"
                placeholder="请输入您的email地址"
              />
            </a-form-item>
            <a-form-item

              :wrapperCol="{ xs: { span: 10 ,offset:7}}">
              <a-button type="primary" html-type="submit">
                保存
              </a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'Card',
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  width: 450px;
  padding: 30px;
  box-shadow: 2px 4px 10px gray;
  border-radius: 10px;
  transition: 0.5s;
  font-family: 'Noto Serif TC', serif;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 30px;
  .companyName {
    font-size: 20px;
  }

  .companyEnglishName {
    font-size: 15px;
    line-height: 12px;
  }

  .companyAddress {
    font-size: 14px;
  }

  .companyWebsite {
    font-size: 14px;
    line-height: 12px;
  }

  .userTitle {
    padding-left: 50px;
    margin-top: 25px;
    margin-bottom: 3px;
    line-height: 10px;
  }

  .userChineseName {
    font-size: 30px;
    letter-spacing: 10px;
    margin-right: 10px;
    padding-left: 50px;
  }

  .userEnglishName {
    font-size: 25px;
  }

  .infos {
    line-height: 15px;
    margin-top: 10px;
  }

  .infoTitle,
  .info {
    font-size: 12px;
  }

  .infoTitle {
    margin-right: 5px;
    margin-left: 100px;
  }

  .companyLogo {
    position: absolute;
    width: 80px;
    height: 80px;
    right: 30px;
    top: 30px;
  }

  .backgroundImageBig {
    width: 150px;
    height: 200px;
    position: absolute;
    right: -90px;
    top: 100px;
    transform: rotate(50deg);
    background-color: rgb(36, 90, 117);
  }

  .backgroundImageSmall {
    width: 200px;
    height: 200px;
    position: absolute;
    right: -190px;
    top: 120px;
    transform: rotate(50deg);
    background-color: rgb(34, 34, 34);
  }

  .float:hover {
    transform: translate(0px, -10px);
    box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.4);
  }

  .infotext {
    text-align: center;
    font-size: 22px;
    font-family: 微軟正黑體;
    margin-top: 50px;
    margin-bottom: 50px;
    color: #dbdbdb;
  }

  .btnBackToStart {
    font-family: 'Noto Serif TC', serif;
    cursor: pointer;
    display: none;
    margin-top: 50px;
    border: none;
    background-color: transparent;
    border: solid 1px #e5bd59;
    color: #e5bd59;
    font-size: 18px;
    padding: 10px 15px;
  }

  .btnBackToStart:hover {
    border: #e5bd59;
    background-color: #e5bd59;
    color: #222;
  }

  .cwTeXKai {
    font-family: 'cwTeXKai', serif;
  }

  .MicrosoftJhengHei {
    font-family: Microsoft JhengHei, sans-serif;
  }

  .NotoSansTC {
    font-family: Noto Sans TC, sans-serif;
  }

  .cwTeXYen {
    font-family: cwTeXYen, sans-serif;
  }

  .NotoSerifTC {
    font-family: 'Noto Serif TC', serif;
  }

  .cwTeXFangSong {
    font-family: cwTeXFangSong, serif;
  }

  .cwTeXMing {
    font-family: cwTeXMing, serif;
  }
}
</style>
