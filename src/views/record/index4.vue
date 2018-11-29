<template>
  <div>
    <van-nav-bar title="打卡记录" left-text="返回" right-text="选择" left-arrow @click-left="onClickBack" @click-right="selectDateButton" />
    <van-popup v-model="selectDate" position="bottom" :overlay="true">
      <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" visible-item-count="5" show-toolbar="false" @confirm="confirm" @cancel="cancel" />
    </van-popup>
    <div v-if="staffSignData.length">
      <div v-for="(item,index) in staffSignData" :key="index">
        <van-cell-group>
          <img class="image" :src="baseUrl + item.sign_avatar" @click="showPicture(item)" />
          <van-popup v-model="item.bigShow" :overlay="true">
            <img :src="baseUrl + item.sign_bg_avatar" @click="noShow(item)" />
          </van-popup>
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
    </div>
    <div v-else>
      <van-popup v-model="showText" :overlay="true">
        <!-- <img style="width:100%" src="../../static/noRecordn.jpg" /> -->
        <i @click="noShowText">本日未打卡！</i>
      </van-popup>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        baseUrl: "http://172.20.17.99:1010/v1/image/2/",
        currentDate: new Date(),
        maxDate: new Date(),
        minDate: new Date(2008, 1, 1),
        selectDate: false,
        staffInfo: {
          userId: "2243",
          name: "",
          companyId: "1"
        },
        showText: true,
        staffSignData: [],
        isBgAvatar: [],
        startTime: "",
        endTime: "",
        page: "1",
        size: "100",
        total: ""
      };
    },
    mounted() {
      Date.prototype.Format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1 ?
              o[k] :
              ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
      this.startTime = new Date().Format("yyyy-MM-dd") + " 00:00:00";
      this.endTime = new Date().Format("yyyy-MM-dd") + " 23:59:59";
      this.get();
    },
    methods: {
      showPicture(item) {
        item.bigShow = true;
      },
      noShow(item) {
        item.bigShow = false;
      },
      noShowText() {
        this.showText = false;
      },
      onClickBack() {
        this.$router.push("/person");
      },
      selectDateButton() {
        this.selectDate = true;
      },
      confirm() {
        this.startTime = this.currentDate.Format("yyyy-MM-dd hh:mm:ss");
        this.endTime = this.currentDate.Format("yyyy-MM-dd") + " 23:59:59";
        this.get();
        this.selectDate = false;
        this.showText = true;
      },
      cancel() {
        this.selectDate = false;
      },
      get() {
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
      }
    }
  };
</script>

<style>
  .image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-left: 10px;
    padding-top: 1px;
  }
</style>
