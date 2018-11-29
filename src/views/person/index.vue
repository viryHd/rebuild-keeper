<template>
  <div id="person">
    <van-nav-bar
      left-text="退出登录"
      right-text="打卡记录"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <div
      class="image"
      @click="cameraShow=true"
    >
      <img
        v-if="avatar"
        :src="avatar"
      />
      <img
        v-else
        src="../../assets/images/error.jpg"
      />
    </div>
    <van-cell-group>
      <van-field
        label="姓名"
        required
        v-model="staffInfo.name"
        placeholder="请输入姓名"
        clearable
      />
      <van-field
        label="工号"
        v-model="staffInfo.jobNumber"
        placeholder="请输入工号"
        clearable
      />
      <van-field
        label="IC卡号"
        v-model="staffInfo.icNumber"
        placeholder="请输入IC卡号"
        clearable
      />
      <van-field
        label="手机号"
        v-model="staffInfo.phoneNumber"
        placeholder="请输入手机号"
        clearable
      />
      <van-field
        label="身份证号"
        v-model="staffInfo.idNumber"
        placeholder="请输入身份证号"
        clearable
      />
      <van-field
        label="提示语"
        v-model="staffInfo.prompt"
        placeholder="请输入提示语"
        clearable
      />
      <van-field
        label="备注"
        v-model="staffInfo.remark"
        placeholder="请输入备注"
        type="textarea"
        rows="1"
        autosize
      />
    </van-cell-group>
    <van-button
      type="primary"
      size="large"
      @click="editSaveStaff"
    >保存</van-button>
    <van-popup v-model="cameraShow" class="van-popup-camera">
      <p class="cancel">
        <span
          class="cancel-btn"
          @click="cameraShow=false"
        >取消操作</span>
      </p>
      <active-camera
        @upload="upload"
        :cameraShow="cameraShow"
      >
        <div slot="title">
        </div>
      </active-camera>
    </van-popup>
    <van-popup
      v-model="loading"
      :close-on-click-overlay="false"
    >
      <van-loading
        type="spinner"
        color="white"
      />
    </van-popup>
  </div>
</template>

<script>
import cryptoDES from "@/lib/cryptoDES";
import activeCamera from "@/components/activeCamera";
export default {
  data() {
    return {
      avatar: "",
      cameraShow: false,
      idNumber: "",
      staffInfo: {
        userId: "",
        avatar: "",
        name: "",
        birthday: "",
        jobNumber: "",
        icNumber: "",
        idNumber: "",
        phoneNumber: "",
        prompt: "",
        remark: "",
        isRegister: 0,
        companyId: ""
      },
      loading: false
    };
  },
  mounted() {
    this.staffInfo.userId = JSON.parse(localStorage.userLogin).id;
    this.staffInfo.companyId = JSON.parse(localStorage.userLogin).company_id;
    let dataForm = new FormData();
    dataForm.append("userId", this.staffInfo.userId);
    var data = dataForm;
    this.$axios({
      url: `/h5/user/getUser`,
      method: "post",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(response => {
        if (response.data.code === 0) {
          var result = response.data.data;
          this.avatar = this.$root.baseUrl + result.avatar;
          this.staffInfo.id = result.id;
          this.staffInfo.name = result.name;
          this.staffInfo.icNumber = result.icNumber;
          this.staffInfo.jobNumber = result.jobNumber;
          this.staffInfo.phoneNumber = result.phoneNumber;
          this.staffInfo.prompt = result.prompt;
          this.staffInfo.remark = result.remark;
          this.staffInfo.idNumber = cryptoDES.decodeData(result.idNumber);
          localStorage.setItem("staffInfo", JSON.stringify(this.staffInfo));
        } else {
          this.$toast.fail(response.data.desc);
        }
      })
      .catch(err => {
        console.log(err);
        this.$toast.fail("获取失败");
      });
  },
  methods: {
    // beforeUpload(file) {
    //   const isLt1M = file.size / 1024 / 1024 < 1;
    //   if (!isLt1M) {
    //     alert("上传图片大小不能超过1M");
    //   }
    //   return isLt1M;
    // },
    // onRead(file) {
    //   this.avatar = file.content;
    //   this.staffInfo.avatar = file.file;
    // },
    editSaveStaff() {
      this.loading = true;
      this.idNumber = cryptoDES.encodeData(this.staffInfo.idNumber);
      let dataForm = new FormData();
      dataForm.append("avatarFile", this.staffInfo.avatar);
      dataForm.append("userId", this.staffInfo.userId);
      dataForm.append("name", this.staffInfo.name);
      dataForm.append("icNumber", this.staffInfo.icNumber);
      dataForm.append("idNumber", this.staffInfo.idNumber);
      dataForm.append("jobNumber", this.staffInfo.jobNumber);
      dataForm.append("phoneNumber", this.staffInfo.phoneNumber);
      dataForm.append("prompt", this.staffInfo.prompt);
      dataForm.append("remark", this.staffInfo.remark);
      dataForm.append("companyId", this.staffInfo.companyId);
      dataForm.append("isRegister", this.staffInfo.isRegister);
      var data = dataForm;
      this.$axios({
        url: `/h5/user/h5update`,
        method: "post",
        data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(response => {
          this.loading = false;
          if (response.data.code === 0) {
            this.$toast.success("保存成功");
            localStorage.setItem("staffInfo", JSON.stringify(this.staffInfo));
          } else {
            this.$toast.fail(response.data.desc);
          }
        })
        .catch(err => {
          this.loading = false;
          this.$toast.fail("服务器繁忙");
        });
    },
    onClickLeft() {
      this.$router.push("/login");
      localStorage.clear();
    },
    onClickRight() {
      this.$router.push("/record");
    },
    upload(imgInfo, bool) {
      this.avatar = imgInfo.imgData;
      this.staffInfo.avatar = imgInfo.avatarfile;
      this.cameraShow = bool;
    }
  },
  components: {
    activeCamera
  }
};
</script>

<style lang="less">
#person {
  .image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    box-shadow: 0px 0px 10px 5px pink;
    margin: 20px auto;
    overflow: hidden;
    img {
      width: 100%;
    }
  }

  .van-cell-group {
    padding: 0 20px;
  }
  .van-popup-camera {
    width: 100%;
    height: 100%;
    background-color: transparent;
    .cancel {
      color: #44bb00;
      padding: 15px 15px 0 0;
      text-align: right;
      .cancel-btn {
        display: inline-block;
        padding: 10px;
        box-shadow: 0px 0px 00px 1px #44bb00;
        border-radius: 6px;
      }
    }
    #camera {
      margin-top: 50px;
    }
  }
  .van-loading {
    background-color: rgba(0, 0, 0, 0.7);
  }
}
</style>


