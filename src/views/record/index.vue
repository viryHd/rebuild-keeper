<template>
  <div id="record">
    <van-nav-bar title="打卡记录" left-text="返回" right-text="选择" left-arrow @click-left="onClickBack" @click-right="selectDateButton" />
    <van-popup v-model="dataSelectorShow" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" @confirm="confirm" @cancel="cancel" />
    </van-popup>
    <template v-if="staffSignData.length">
    <div v-for="(item,index) in staffSignData" :key="index">
      <van-cell-group>
        <div class="image">
          <img :src="$root.otherUrl + item.sign_avatar" @click="item.bigShow = true" />
          <van-popup v-model="item.bigShow">
            <img :src="$root.otherUrl + item.sign_bg_avatar" v-show="item.bigShow" />
          </van-popup>
        </div>
        <div style="padding-left:80px; margin-top: -45px; height:45px">
          <div>
            <van-icon name="clock" />
            <i>{{item.sign_time}}</i>
          </div>
          <div>
            <i style="margin-left: 20px">{{item.device_name}}</i>
          </div>
        </div>
      </van-cell-group>
    </div>
    </template>
    <div v-else>
      <h3>今日未打卡 !</h3>
    </div>
  </div>
</template>
<script>
  export default {
    name: "record",
    data() {
      return {
        dataSelectorShow: false,
        currentDate: new Date(),
        minDate: new Date(2018, 0, 1),
        maxDate: new Date(),
        staffInfo: {
          userId: "2244",
          name: "",
          companyId: "1"
        },
        staffSignData: [],
        startTime: "",
        endTime: "",
        page: "1",
        size: "100",
        total: ""
      };
    },
    created() {},
    mounted() {
      this.staffInfo = JSON.parse(localStorage.staffInfo);
      this.getRecord();
    },
    methods: {
      selectDateButton() {
        this.dataSelectorShow = true;
      },
      onClickBack() {
        this.$router.push("/person");
      },
      confirm() {
        this.getRecord();
        this.dataSelectorShow = false;
      },
      cancel() {
        this.dataSelectorShow = false;
        this.currentDate = new Date();
      },
      getRecord() {
        this.formatDate(this.currentDate);
        let dataForm = new FormData();
        dataForm.append("userId", this.staffInfo.userId);
        dataForm.append("name", this.staffInfo.name);
        dataForm.append("companyId", this.staffInfo.companyId);
        dataForm.append("start", this.startTime);
        dataForm.append("end", this.endTime);
        dataForm.append("page", this.page);
        dataForm.append("size", this.size);
        var data = dataForm;
        this.$axios({
          url: `/h5/user/record`,
          method: "post",
          data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(response => {
          if (response.data.code === 0) {
            response.data.data.data.forEach(v => {
              v.bigShow = false;
            });
            this.staffSignData = response.data.data.data;
            console.log(this.staffSignData);
          } else {
            this.$toast.fail(response.data.desc);
          }
        });
      },
      formatDate(dt) {
        let year = dt.getFullYear();
        let month = dt.getMonth() + 1;
        let date = dt.getDate();
        this.startTime = year + "-" + month + "-" + date + " 00:00:00";
        this.endTime = year + "-" + month + "-" + date + " 23:59:59";
      }
    }
  };
</script>

<style lang="less" scoped>
  #record {
    .van-nav-bar {
      padding-bottom: 10px;
      /deep/.van-nav-bar__left {
        top: 0;
      }
      /deep/.van-nav-bar__right {
        top: 0;
      }
    }
    .van-cell-group.van-hairline--top-bottom {
      padding: 5px 0;
    }
    .image {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-left: 20px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
  }
</style>
