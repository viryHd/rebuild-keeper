<template>
  <div id="bypic">
    <div v-if="userLogin.isRegister" class="title">
      <h3>SenseKeeper</h3>
      <p>用户系统</p>
    </div>
    <div v-else class="title">
      <h3>用户系统</h3>
      <p class="tips">注意：初次上传，请确保为本人头像，后续登录头像验证以本次特征为准！</p>
    </div>
    <div class="videoBox">
      <video id="video"></video>
      <canvas v-show="canvasShow" id="canvas" width="240" height="320"></canvas>
    </div>
    <div class="bottom-btn">
      <span class="icon-btn" @click="getVideo">
          <van-icon name="chongxinpai" />
        </span>
      <span class="icon-btn" @click="snip">
          <van-icon name="paizhao" />
        </span>
      <span class="icon-btn" @click="login">
          <van-icon name="denglu" />
        </span>
    </div>
    <van-popup v-model="loading" :close-on-click-overlay="false">
      <van-loading type="spinner" color="white" />
    </van-popup>
  </div>
</template>
<script>
  export default {
    name: "bypic",
    data() {
      return {
        canvasShow: false,
        avatarfile: null,
        imgData: "",
        userLogin: {},
        loading:false
      };
    },
    created() {},
    mounted() {
      this.userLogin = JSON.parse(localStorage.userLogin);
      this.getVideo();
    },
    methods: {
      // checkPhone() {
      //   let reg = /(^[0-9]{8}$)|(^[0-9]{10}$)|(^[0-9]{11}$)/;
      //   if (reg.test(this.phone)) {
      //     this.disabledLogin = false;
      //   }
      // },
      getVideo() {
        this.canvasShow = false;
        let constraints = {
          video: {
            width: 300,
            height: 300
          }
        };
        //获得video摄像头区域
        // 这里要使用原生的，用ref好像不行
        let video = document.getElementById("video");
        //这里介绍新的方法，返回一个 Promise对象
        // 这个Promise对象返回成功后的回调函数带一个 MediaStream 对象作为其参数
        // then()是Promise对象里的方法
        // then()方法是异步执行，当then()前的方法执行完后再执行then()内部的程序
        // 避免数据没有获取到
        // if (navigator.mediaDevices.getUserMedia) {
        //   navigator.mediaDevices
        //     .getUserMedia(constraints)
        //     .then(function(MediaStream) {
        //       video.srcObject = MediaStream;
        //       video.play();
        //     });
        // } else if (navigator.webkitGetUserMedia) {
        //   navigator.webkitGetUserMedia(constraints).then(function(MediaStream) {
        //     video.srcObject = MediaStream;
        //     video.play();
        //   });
        // } else if (navigator.mozGetUserMedia) {
        //   navigator.mozGetUserMedia(constraints).then(function(MediaStream) {
        //     video.srcObject = MediaStream;
        //     video.play();
        //   });
        // } else if (navigator.msGetUserMedia) {
        //   navigator.msGetUserMedia(constraints).then(function(MediaStream) {
        //     video.srcObject = MediaStream;
        //     video.play();
        //   });
        // }
        const promisifiedOldGUM = function(constraints) {
          // First get ahold of getUserMedia, if present
          const getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
        }
        navigator.mediaDevices.getUserMedia(constraints).then(
          MediaStream => {
            try {
              video.srcObject = MediaStream;
            } catch (error) {
              window.URL =
                window.URL || window.webkitURL || window.mozURL || window.msURL;
              video.src =
                (window.URL && window.URL.createObjectURL(MediaStream)) ||
                MediaStream;
            }
            video.play();
          },
          error => {
            // 失败
            const {
              name
            } = error;
            let errorMessage;
            switch (name) {
              // 用户拒绝
              case "NotAllowedError":
              case "PermissionDeniedError":
                errorMessage = "用户已禁止网页调用相机设备";
                break;
                // 没接入录音设备
              case "NotFoundError":
              case "DevicesNotFoundError":
                errorMessage = "未找到相机设备";
                break;
                // 其它错误
              case "NotSupportedError":
                errorMessage = "不支持相机功能";
                break;
              default:
                errorMessage = "相机调用错误";
                window.console.log(error);
            }
            this.$toast.fail(errorMessage);
          }
        );
      },
      snip() {
        this.canvasShow = true;
        let video = document.getElementById("video");
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, 240, 320);
        // base64的图片
        this.imgData = canvas.toDataURL("image/png");
        this.avatarfile = this.dataURLtoFile(this.imgData, "avatar.png");
      },
      login() {
        if (!this.avatarfile) {
          return;
        }
        this.loading = true;
        let dataForm = new FormData();
        dataForm.append("companyId", this.userLogin.company_id);
        dataForm.append("userId", this.userLogin.id);
        dataForm.append("image", this.avatarfile);
        let data = dataForm;
        this.$axios({
            url: `/h5/userLogin`,
            method: "post",
            data
          })
          .then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$toast.success("成功");
              this.$router.push("/person");
            } else {
              this.$toast.fail(res.data.desc);
            }
          })
          .catch(err => {
            this.loading = false;
            this.$toast.fail("服务器繁忙");
          });
      },
      // base64转图片
      dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {
          type: mime
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  #bypic {
    .title {
      padding: 20px 0 10px;
      .tips {
        padding: 0 30px;
      }
    }
    .bottom-btn {
      margin-top: 18px;
    }
    .icon-btn {
      display: inline-block;
      width: 40px;
      height: 40px;
      margin: 0 30px;
      .van-icon {
        font-size: 40px;
        color: #44bb00;
        vertical-align: middle;
      }
    }
    .videoBox {
      width: 240px;
      height: 0;
      padding-bottom: 240px;
      box-shadow: 2px 2px 30px 2px pink;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      margin: 0 auto;
      #video,
      #canvas {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
      }
      #video {
        width: 240px;
        height: 320px;
        object-fit: contain;
      }
      #canvas {
        z-index: 2;
        width: 240px;
        height: 320px;
      }
    }
    .van-popup{
      .van-loading{
        background-color: rgba(0,0,0,.7);
      }
    }
  }
</style>
