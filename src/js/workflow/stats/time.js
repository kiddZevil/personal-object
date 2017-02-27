define(['laydate'], function(){
	var times = {
		_bformat : function(time){
			return time.substring(0,10) + " 00:00:00"
		}
		,_eformat : function(time){
			return time.substring(0,10) + " 23:59:59"
		}
		/*
		*
		* 计算当前时间内前后N天后日期
		* @param date 要计算的日期
		* @param days 计算日期的前后天数 正整数为后几天  负整数为前几天
		* @param flag
		 */
		,getBeforeDate : function(date,days,flag){
			var d = new Date(date);
			d.setDate(d.getDate() + days);
			var month = d.getMonth() + 1;
			var day = d.getDate();
			if(month < 10){
				month = "0"+month;
			}
			if(day < 10){
				day = "0"+day;
			}
			var getTime;
			if(flag){
				getTime = d.getFullYear() + "-" + month + "-" + day + " 00:00:00"
			}else{
				getTime = d.getFullYear() + "-" + month + "-" + day + " 23:59:59"
			}
			return getTime;
		}
		/*
		 *
		 * 计算两个时间内的时间差
		 * @param startTime 开始时间
		 * @param endTime 结束时间
		 * @param diffType  计算结果单位
		 */
		,GetDateDiff : function(startTime, endTime, diffType) {
			//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
			startTime = (startTime.substring(0,10) + " 00:00:00").replace(/\-/g, "/");
			endTime = (endTime.substring(0,10) + " 23:59:59").replace(/\-/g, "/");
			//将计算间隔类性字符转换为小写
			diffType = diffType.toLowerCase();
			var sTime = new Date(startTime);      //开始时间
			var eTime = new Date(endTime);  //结束时间
			//作为除数的数字
			var divNum = 1;
			switch (diffType) {
				case "second":
					divNum = 1000;
					break;
				case "minute":
					divNum = 1000 * 60;
					break;
				case "hour":
					divNum = 1000 * 3600;
					break;
				case "day":
					divNum = 1000 * 3600 * 24;
					break;
				default:
					break;
			}
			return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
		}
		/*
		 *
		 * 根据时间差返回时间控件的限制选择日期(默认:7天)
		 * @param dates 开始时间
		 * @param difDate 不满时间差条件return的天数
		 * @param day 时间差天数
		 */
		,_dateFn : function(dates,difDate,day){
			var d = day ? day : 7;
			var _date;
			if(this.GetDateDiff(difDate,this.getBeforeDate(dates,d,true),'day') > d ){
				_date = this.getBeforeDate(dates,d);
			}else{
				_date = difDate;
			}
			return _date;
		}
		/*
		 *
		 * 时间空间开始结束时间查询天数限制(默认:7天)
		 * @param bTime 开始时间
		 * @param eTime 结束时间
		 * @param day 相差天数
		 */
		,queryTime : function(bTime,eTime,day){
			var d = day ? day : 7;
			var time = [];
			var beg_end = this.GetDateDiff(bTime, eTime,'day'); //活动周期
			var beg_now = this.GetDateDiff(bTime, laydate.now(-1),'day'); //开始时间与当前时间差
			var end_now = this.GetDateDiff(eTime, laydate.now(-1),'day'); //结束时间与当前时间差
			if(end_now >= 0){  //活动已结束
				if(beg_end < d){ //结束 - 开始 < 7 ，查询 = 开始 ~ 结束
					time.push(this._bformat(bTime),this._eformat(eTime));
				}else if(beg_end > d){ //结束 - 开始 > 7 ，查询 = 结束 - 7 ~ 结束
					time.push(this.getBeforeDate(eTime,-7,true),this._eformat(eTime));
				}
			}else{ //活动进行中
				if(beg_now < d){  //当前 - 开始 < 7 ，查询 = 开始 ~  当前
					time.push(this._bformat(bTime),this._eformat(laydate.now(-1)));
				}else if(beg_now >= d){ //当前 - 开始 > 7 ，查询 = 当前 - 7 ~ 当前
					time.push(this.getBeforeDate(this._eformat(laydate.now(-1)),-7,true),this._eformat(laydate.now(-1)));
				}
			}
			return time;
		}
		/*
		 *
		 * 获取时间差内日期数组
		 * @param bTime 开始时间
		 * @Number eTime 结束时间
		 */
		,getDayArr : function(bTime,eTime){
			var day = this.GetDateDiff(bTime,eTime,'day') + 1;
			var dateArr = [];
			for(var i = 0; i < day; i++){
				var d;
				if(i == 0){
					d = bTime;
				}else{
					d = this.getBeforeDate(bTime,i);
				}
				dateArr.push(d.substring(0,10));
			}
			return dateArr;
		}
	};
	return times;
});