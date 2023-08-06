<template>
  <a-modal
    :title="title || '选择执行时间'"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="close"
    cancelText="关闭"
  >
    <div class="card-container">
      <a-tabs type="card">
        <a-tab-pane key="1" type="card">
          <span slot="tab"><a-icon type="schedule" /> 秒</span>
          <a-radio-group v-model="result.second.cronEvery">
            <a-row>
              <a-radio value="2">
                每
                <a-input-number
                  size="small"
                  v-model="result.second.incrementIncrement"
                  :min="0"
                  :max="60"
                ></a-input-number>
                秒执行一次
              </a-radio>
            </a-row>
            <a-row>
              <a-radio value="3">指定秒数(可多选)</a-radio>
              <a-select
                style="width: 354px"
                size="small"
                mode="multiple"
                v-model="result.second.specificSpecific"
              >
                <a-select-option
                  v-for="(val, index) in 60"
                  :key="index"
                  :value="index"
                  >{{ index }}</a-select-option
                >
              </a-select>
            </a-row>
          </a-radio-group>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab"><a-icon type="schedule" />分</span>
          <div class="tabBody">
            <a-radio-group v-model="result.minute.cronEvery">
              <a-row>
                <a-radio value="2"
                  >每
                  <a-input-number
                    size="small"
                    v-model="result.minute.incrementIncrement"
                    :min="1"
                    :max="60"
                  ></a-input-number>
                  分执行一次
                </a-radio>
              </a-row>
              <a-row>
                <a-radio value="3">指定分钟数(可多选)</a-radio>
                <a-select
                  style="width: 340px"
                  size="small"
                  mode="multiple"
                  v-model="result.minute.specificSpecific"
                >
                  <a-select-option
                    v-for="(val, index) in Array(60)"
                    :key="index"
                    :value="index"
                  >
                    {{ index }}</a-select-option
                  >
                </a-select>
              </a-row>
            </a-radio-group>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3">
          <span slot="tab"><a-icon type="schedule" /> 时</span>
          <div class="tabBody">
            <a-radio-group v-model="result.hour.cronEvery">
              <a-row>
                <a-radio value="2"
                  >每
                  <a-input-number
                    size="small"
                    v-model="result.hour.incrementIncrement"
                    :min="0"
                    :max="23"
                  ></a-input-number>
                  小时执行一次
                </a-radio>
              </a-row>
              <a-row>
                <a-radio class="long" value="3">指定小时数(可多选)</a-radio>
                <a-select
                  style="width: 340px"
                  size="small"
                  mode="multiple"
                  v-model="result.hour.specificSpecific"
                >
                  <a-select-option
                    v-for="(val, index) in Array(24)"
                    :key="index"
                    >{{ index }}</a-select-option
                  >
                </a-select>
              </a-row>
            </a-radio-group>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4">
          <span slot="tab"><a-icon type="schedule" /> 天</span>
          <div class="tabBody">
            <a-radio-group v-model="result.day.cronEvery">
              <a-row>
                <a-radio value="3"
                  >每
                  <a-input-number
                    size="small"
                    v-model="result.day.incrementIncrement"
                    :min="1"
                    :max="31"
                  ></a-input-number>
                  天执行一次
                </a-radio>
              </a-row>
              <a-row>
                <a-radio class="long" value="4">指定周几(可多选)</a-radio>
                <a-select
                  style="width: 340px"
                  size="small"
                  mode="multiple"
                  v-model="result.week.specificSpecific"
                >
                  <a-select-option
                    v-for="(val, index) in Array(7)"
                    :key="index"
                    :value="index + 1"
                    >{{ weekDays[index] }}</a-select-option
                  >
                </a-select>
              </a-row>
              <a-row>
                <a-radio class="long" value="5">指定几号(可多选)</a-radio>
                <a-select
                  style="width: 354px"
                  size="small"
                  mode="multiple"
                  v-model="result.day.specificSpecific"
                >
                  <a-select-option
                    v-for="(val, index) in Array(31)"
                    :key="index"
                    :value="index + 1"
                    >{{ index + 1 }}</a-select-option
                  >
                </a-select>
              </a-row>
            </a-radio-group>
          </div>
        </a-tab-pane>
        <a-tab-pane key="5">
          <span slot="tab"><a-icon type="schedule" /> 月</span>
          <div class="tabBody">
            <a-radio-group v-model="result.month.cronEvery">
              <a-row>
                <a-radio value="2"
                  >每
                  <a-input-number
                    size="small"
                    v-model="result.month.incrementIncrement"
                    :min="0"
                    :max="12"
                  ></a-input-number>
                  月执行开始
                </a-radio>
              </a-row>
              <a-row>
                <a-radio class="long" value="3">指定月份(可多选)</a-radio>
                <a-select
                  style="width: 354px"
                  size="small"
                  filterable
                  mode="multiple"
                  v-model="result.month.specificSpecific"
                >
                  <a-select-option
                    v-for="(val, index) in Array(12)"
                    :key="index"
                    :value="index + 1"
                    >{{ index + 1 }}</a-select-option
                  >
                </a-select>
              </a-row>
            </a-radio-group>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>
<script>
import parser from "cron-parser";
export default {
  name: "VueCron",
  props: ["data", "title", "outOperation"],
  data() {
    return {
      value: 2,
      visible: false,
      confirmLoading: false,
      size: "large",
      weekDays: ["日", "一", "二", "三", "四", "五", "六"].map(
        (val) => "周" + val
      ),
      //result.second.cronEvery
      result: {
        second: {},
        minute: {},
        hour: {},
        day: {},
        week: {},
        month: {},
      },
      defaultValue: {
        second: {
          cronEvery: "2",
          incrementStart: 0,
          incrementIncrement: 30,
          rangeStart: 3,
          rangeEnd: 3,
          specificSpecific: [],
        },
        minute: {
          cronEvery: "",
          incrementStart: 0,
          incrementIncrement: 30,
          rangeStart: 1,
          rangeEnd: "0",
          specificSpecific: [],
        },
        hour: {
          cronEvery: "",
          incrementStart: 0,
          incrementIncrement: 1,
          rangeStart: "0",
          rangeEnd: "0",
          specificSpecific: [],
        },
        day: {
          cronEvery: "",
          incrementStart: 1,
          incrementIncrement: "1",
          rangeStart: "",
          rangeEnd: "",
          specificSpecific: [],
          cronLastSpecificDomDay: 1,
          cronDaysBeforeEomMinus: 1,
          cronDaysNearestWeekday: 1,
        },
        week: {
          cronEvery: "",
          incrementStart: 1,
          incrementIncrement: 1,
          specificSpecific: [],
          cronNthDayDay: 1,
          cronNthDayNth: 1,
        },
        month: {
          cronEvery: "",
          incrementStart: 1,
          incrementIncrement: 12,
          rangeStart: 1,
          rangeEnd: 1,
          specificSpecific: [],
        },
        label: "",
      },
      cronArray: [],
      cronArray1: [],
      weekdict: {
        Mon: "周一",
        Tue: "周二",
        Wed: "周三",
        Thur: "周四",
        Fri: "周五",
        Sat: "周六",
        Sun: "周日",
      },
      monthsdict: {
        Jan: "1月",
        Feb: "2月",
        Mar: "3月",
        Apr: "4月",
        May: "5月",
        Jun: "6月",
        Jul: "7月",
        Aug: "9月",
        Sep: "9月",
        Oct: "10月",
        Nov: "11月",
        Dec: "12月",
      },
    };
  },
  computed: {
    modalWidth() {
      return 608;
    },
    secondsText() {
      let seconds = "";
      let cronEvery = this.result.second.cronEvery || "";
      switch (cronEvery.toString()) {
        case "0":
          seconds = "0";
          break;
        case "1":
          seconds = "*";
          break;
        case "2":
          seconds =
            this.result.second.incrementStart +
            "/" +
            this.result.second.incrementIncrement;
          break;
        case "3":
          this.result.second.specificSpecific.map((val) => {
            seconds += val + ",";
          });
          seconds = seconds.slice(0, -1);
          break;
        case "4":
          seconds =
            this.result.second.rangeStart + "-" + this.result.second.rangeEnd;
          break;
      }
      return seconds;
    },
    minutesText() {
      let minutes = "";
      let cronEvery = this.result.minute.cronEvery || "";
      switch (cronEvery.toString()) {
        case "1":
          minutes = "*";
          break;
        case "2":
          minutes =
            this.result.minute.incrementStart +
            "/" +
            this.result.minute.incrementIncrement;
          break;
        case "3":
          this.result.minute.specificSpecific.map((val) => {
            minutes += val + ",";
          });
          minutes = minutes.slice(0, -1);
          break;
        case "4":
          minutes =
            this.result.minute.rangeStart + "-" + this.result.minute.rangeEnd;
          break;
      }
      return minutes;
    },
    hoursText() {
      let hours = "";
      let cronEvery = this.result.hour.cronEvery || "";
      switch (cronEvery.toString()) {
        case "1":
          hours = "*";
          break;
        case "2":
          hours =
            this.result.hour.incrementStart +
            "/" +
            this.result.hour.incrementIncrement;
          break;
        case "3":
          this.result.hour.specificSpecific.map((val) => {
            hours += val + ",";
          });
          hours = hours.slice(0, -1);
          break;
        case "4":
          hours = this.result.hour.rangeStart + "-" + this.result.hour.rangeEnd;
          break;
      }
      return hours;
    },
    daysText() {
      let days = "";
      let cronEvery = this.result.day.cronEvery || "";
      switch (cronEvery.toString()) {
        case "1":
          break;
        case "2":
        case "4":
        case "11":
          days = "?";
          break;
        case "3":
          days =
            this.result.day.incrementStart +
            "/" +
            this.result.day.incrementIncrement;
          break;
        case "5":
          this.result.day.specificSpecific.map((val) => {
            days += val + ",";
          });
          days = days.slice(0, -1);
          break;
        case "6":
          days = "L";
          break;
        case "7":
          days = "LW";
          break;
        case "8":
          days = this.result.day.cronLastSpecificDomDay + "L";
          break;
        case "9":
          days = "L-" + this.result.day.cronDaysBeforeEomMinus;
          break;
        case "10":
          days = this.result.day.cronDaysNearestWeekday + "W";
          break;
      }
      return days;
    },
    weeksText() {
      let weeks = "";
      let cronEvery = this.result.day.cronEvery || "";
      switch (cronEvery.toString()) {
        case "1":
        case "3":
        case "5":
          weeks = "?";
          break;
        case "2":
          weeks =
            this.result.week.incrementStart +
            "/" +
            this.result.week.incrementIncrement;
          break;
        case "4":
          this.result.week.specificSpecific.map((val) => {
            weeks += val + ",";
          });
          weeks = weeks.slice(0, -1);
          break;
        case "6":
        case "7":
        case "8":
        case "9":
        case "10":
          weeks = "?";
          break;
        case "11":
          weeks =
            this.result.week.cronNthDayDay +
            "#" +
            this.result.week.cronNthDayNth;
          break;
      }
      return weeks;
    },
    monthsText() {
      let months = "";
      let cronEvery = this.result.month.cronEvery || "";
      switch (cronEvery.toString()) {
        case "1":
          months = "*";
          break;
        case "2":
          months =
            this.result.month.incrementStart +
            "/" +
            this.result.month.incrementIncrement;
          break;
        case "3":
          this.result.month.specificSpecific.map((val) => {
            months += val + ",";
          });
          months = months.slice(0, -1);
          break;
        case "4":
          months =
            this.result.month.rangeStart + "-" + this.result.month.rangeEnd;
          break;
      }
      return months;
    },
    cron() {
      return `${this.secondsText || "0"} ${this.minutesText || "0"} ${
        this.hoursText || "8,12,16,20"
      } ${this.daysText || "1/1"} ${this.monthsText || "1/1"} ${
        this.weeksText || "?"
      }`;
    },
  },
  watch: {
    visible: {
      handler() {
        let label = this.data;
        if (label) {
          this.secondsReverseExp(label);
          this.minutesReverseExp(label);
          this.hoursReverseExp(label);
          this.daysReverseExp(label);
          this.daysReverseExp(label);
          this.monthsReverseExp(label);
          JSON.parse(JSON.stringify(label));
        } else {
          this.result = JSON.parse(JSON.stringify(this.defaultValue));
        }
      },
    },
  },

  methods: {
    show() {
      this.visible = true;
    },
    handleSubmit() {
      this.$emit("ok", this.cron);
      if (this.outOperation) {
        return;
      }
      this.close();
      this.visible = false;
    },
    handlenCron() {
      this.cron1 = parser.parseExpression(this.cron);
      for (var i = 0; i < 10; i++) {
        this.cronArray[i] = this.cron1.next().toString();
      }
      this.CutArray(this.cronArray);
    },
    CutArray(e) {
      var nay = e.map((item) => {
        let list = [];
        list.push(...item.split(" "));
        return list;
      });
      this.cronArray1 = nay.map((item) => {
        let arr1 = [];
        arr1.push(
          item.map((x) => {
            if (Object.keys(this.weekdict).includes(x)) {
              return this.weekdict[x];
            }
            if (Object.keys(this.monthsdict).includes(x)) {
              return this.monthsdict[x];
            }
            return x;
          })
        );
        return arr1;
      });
    },
    close() {
      this.$emit("closeCronDialog");
      this.visible = false;
    },
    secondsReverseExp(seconds) {
      let val = seconds.split(" ")[0];
      let second = {
        cronEvery: "",
        incrementStart: 0,
        incrementIncrement: 30,
        rangeStart: 1,
        rangeEnd: 0,
        specificSpecific: [],
      };
      switch (true) {
        case val.includes("*"):
          second.cronEvery = "1";
          break;
        case val.includes("/"):
          second.cronEvery = "2";
          second.incrementStart = val.split("/")[0];
          second.incrementIncrement = val.split("/")[1];
          break;
        case val.includes(","):
          second.cronEvery = "3";
          second.specificSpecific = val
            .split(",")
            .map(Number)
            .sort((a, b) => a - b);
          break;
        case val.includes("-"):
          second.cronEvery = "4";
          second.rangeStart = val.split("-")[0];
          second.rangeEnd = val.split("-")[1];
          break;
        default:
          second.cronEvery = "3";
          second.specificSpecific = [val];
      }
      this.result.second = second;
    },
    minutesReverseExp(minutes) {
      let val = minutes.split(" ")[1];
      let minute = {
        cronEvery: "",
        incrementStart: 0,
        incrementIncrement: 30,
        rangeStart: 1,
        rangeEnd: 0,
        specificSpecific: [],
      };
      switch (true) {
        case val.includes("*"):
          minute.cronEvery = "1";
          break;
        case val.includes("/"):
          minute.cronEvery = "2";
          minute.incrementStart = val.split("/")[0];
          minute.incrementIncrement = val.split("/")[1];
          break;
        case val.includes(","):
          minute.cronEvery = "3";
          minute.specificSpecific = val
            .split(",")
            .map(Number)
            .sort((a, b) => a - b);
          break;
        case val.includes("-"):
          minute.cronEvery = "4";
          minute.rangeStart = val.split("-")[0];
          minute.rangeEnd = val.split("-")[1];
          break;
        default:
          minute.cronEvery = "3";
          minute.specificSpecific = [val];
      }
      this.result.minute = minute;
    },
    hoursReverseExp(hours) {
      let val = hours.split(" ")[2];
      let hour = {
        cronEvery: "",
        incrementStart: 0,
        incrementIncrement: 1,
        rangeStart: 1,
        rangeEnd: "0",
        specificSpecific: [],
      };
      switch (true) {
        case val.includes("*"):
          hour.cronEvery = "1";
          break;
        case val.includes("/"):
          hour.cronEvery = "2";
          hour.incrementStart = val.split("/")[0];
          hour.incrementIncrement = val.split("/")[1];
          break;
        case val.includes(","):
          hour.cronEvery = "3";
          hour.specificSpecific = val
            .split(",")
            .map(Number)
            .sort((a, b) => a - b);
          break;
        case val.includes("-"):
          hour.cronEvery = "4";
          hour.rangeStart = val.split("-")[0];
          hour.rangeEnd = val.split("-")[1];
          break;
        default:
          hour.cronEvery = "3";
          hour.specificSpecific = [val];
      }
      this.result.hour = hour;
    },
    daysReverseExp(cron) {
      let days = cron.split(" ")[3];
      let weeks = cron.split(" ")[5];
      let day = {
        cronEvery: "",
        incrementStart: 1,
        incrementIncrement: 1,
        rangeStart: 1,
        rangeEnd: 1,
        specificSpecific: [],
        cronLastSpecificDomDay: 1,
        cronDaysBeforeEomMinus: 1,
        cronDaysNearestWeekday: 1,
      };
      let week = {
        cronEvery: "",
        incrementStart: 1,
        incrementIncrement: 1,
        specificSpecific: [],
        cronNthDayDay: 1,
        cronNthDayNth: "1",
      };
      if (!days.includes("?")) {
        switch (true) {
          case days.includes("*"):
            day.cronEvery = "1";
            break;
          case days.includes("?"):
            // 2、4、11
            break;
          case days.includes("/"):
            day.cronEvery = "3";
            day.incrementStart = days.split("/")[0];
            day.incrementIncrement = days.split("/")[1];
            break;
          case days.includes(","):
            day.cronEvery = "5";
            day.specificSpecific = days
              .split(",")
              .map(Number)
              .sort((a, b) => a - b);
            // day.specificSpecific.forEach(function (value, index) {
            //   day.specificSpecific[index] = value -1;
            // });
            break;
          case days.includes("LW"):
            day.cronEvery = "7";
            break;
          case days.includes("L-"):
            day.cronEvery = "9";
            day.cronDaysBeforeEomMinus = days.split("L-")[1];
            break;
          case days.includes("L"):
            //alert(days);
            if (days.len == 1) {
              day.cronEvery = "6";
              day.cronLastSpecificDomDay = "1";
            } else {
              day.cronEvery = "8";
              day.cronLastSpecificDomDay = Number(days.split("L")[0]);
            }
            break;
          case days.includes("W"):
            day.cronEvery = "10";
            day.cronDaysNearestWeekday = days.split("W")[0];
            break;
          default:
            day.cronEvery = "5";
            day.specificSpecific = [days];
        }
      } else {
        switch (true) {
          case weeks.includes("/"):
            day.cronEvery = "2";
            week.incrementStart = weeks.split("/")[0];
            week.incrementIncrement = weeks.split("/")[1];
            break;
          case weeks.includes(","):
            day.cronEvery = "4";
            week.specificSpecific = weeks
              .split(",")
              .map(Number)
              .sort((a, b) => a - b);
            break;
          case "#":
            day.cronEvery = "11";
            week.cronNthDayDay = weeks.split("#")[0];
            week.cronNthDayNth = weeks.split("#")[1];
            break;
          default:
            day.cronEvery = "4";
            week.specificSpecific = weeks
              .split(",")
              .map(Number)
              .sort((a, b) => a - b);
            break;
        }
      }
      this.result.day = day;
      this.result.week = week;
    },
    monthsReverseExp(cron) {
      let months = cron.split(" ")[4];
      let month = {
        cronEvery: "",
        incrementStart: 1,
        incrementIncrement: 1,
        rangeStart: 1,
        rangeEnd: 1,
        specificSpecific: [],
      };
      switch (true) {
        case months.includes("*"):
          month.cronEvery = "1";
          break;
        case months.includes("/"):
          month.cronEvery = "2";
          month.incrementStart = months.split("/")[0];
          month.incrementIncrement = months.split("/")[1];
          break;
        case months.includes(","):
          month.cronEvery = "3";
          month.specificSpecific = months
            .split(",")
            .map(Number)
            .sort((a, b) => a - b);
          break;
        case months.includes("-"):
          month.cronEvery = "4";
          month.rangeStart = months.split("-")[0];
          month.rangeEnd = months.split("-")[1];
          break;
        default:
          month.cronEvery = "3";
          month.specificSpecific = [months];
      }
      this.result.month = month;
    },
    // yearReverseExp(cron) {
    // 	let years = cron.split(" ")[6];
    // 	let year = {
    // 		cronEvery: "",
    // 		incrementStart: 3,
    // 		incrementIncrement: 5,
    // 		rangeStart: 2019,
    // 		rangeEnd: 2019,
    // 		specificSpecific: [],
    // 	};
    // 	switch (true) {
    // 		case years.includes("*"):
    // 			year.cronEvery = "1";
    // 			break;
    // 		case years.includes("/"):
    // 			year.cronEvery = "2";
    // 			year.incrementStart = years.split("/")[0];
    // 			year.incrementIncrement = years.split("/")[1];
    // 			break;
    // 		case years.includes(","):
    // 			year.cronEvery = "3";
    // 			year.specificSpecific = years.split(",").map(Number).sort((a,b)=>a-b);
    // 			break;
    // 		case years.includes("-"):
    // 			year.cronEvery = "4";
    // 			year.rangeStart = years.split("-")[0];
    // 			year.rangeEnd = years.split("-")[1];
    // 			break;
    // 		default:
    // 			year.cronEvery = "1";
    // 	}
    // 	this.result.year = year;
    // },
  },
};
</script>

<style lang="less">
.card-container {
  background: #fff;
  overflow: hidden;
  padding: 12px;
  position: relative;
  width: 100%;
  .ant-tabs {
    border: 1px solid #e6ebf5;
    padding: 0;
    .ant-tabs-bar {
      margin: 0;
      outline: none;
      border-bottom: none;
      .ant-tabs-nav-container {
        margin: 0;
        .ant-tabs-tab {
          padding: 0 24px !important;
          background-color: #f5f7fa !important;
          margin-right: 0px !important;
          border-radius: 0;
          line-height: 38px;
          border: 1px solid transparent !important;
          border-bottom: 1px solid #e6ebf5 !important;
          width: 106.5px !important;
        }
        .ant-tabs-tab-active.ant-tabs-tab {
          color: #409eff;
          background-color: #fff !important;
          border-right: 1px solid #e6ebf5 !important;
          border-left: 1px solid #e6ebf5 !important;
          border-bottom: 1px solid #fff !important;
          font-weight: normal;
          transition: none !important;
          width: 106.5px !important;
        }
      }
    }

    .ant-tabs-tabpane {
      padding: 15px;
      .ant-row {
        margin: 10px 0;
      }
      .ant-select,
      .ant-input-number {
        width: 100px;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.container-widthEn {
  width: 755px;
}
.container-widthCn {
  width: 608px;
}
.language {
  text-align: center;
  position: absolute;
  right: 13px;
  top: 13px;
  border: 1px solid transparent;
  height: 40px;
  line-height: 38px;
  font-size: 16px;
  color: #409eff;
  z-index: 1;
  background: #f5f7fa;
  outline: none;
  width: 47px;
  border-bottom: 1px solid #e6ebf5;
  border-radius: 0;
}
.card-container {
  .bottom {
    display: flex;
    justify-content: center;
    padding: 10px 0 0 0;
    .cronButton {
      margin: 0 10px;
      line-height: 40px;
    }
  }
}
.tabBody {
  .a-row {
    margin: 10px 0;
    .long {
      .a-select {
        width: 354px;
      }
    }
    .a-input-number {
      width: 110px;
    }
  }
}
.bottom-left {
  float: left;
}
.bottom-right {
  float: right;
  > ul {
    list-style-type: none;
  }
}
</style>
