import moment from '../../miniprogram_npm/moment/index.js';
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    bannerList:[],
    dailyList:[],
    _nextPageUrl:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRefresh(){
      wx.request({
        url: app.gBaseUrl + 'v2/feed?num=1',
        success:(res)=>{
          const nextPageUrl = res.data.nextPageUrl
         let itemList = res.data.issueList[0].itemList
         itemList = itemList.filter((value)=> value.type !== 'banner2')
  
         this.setData({
           bannerList:itemList,
           dailyList:[],
           _nextPageUrl:nextPageUrl
         })
  
         wx.stopPullDownRefresh()
  
         this.onLoadMore()
        }
      })
    },
  
    onLoadMore(){
      if(this.data._nextPageUrl === null){
          return
      }
      wx.request({
        url: this.data._nextPageUrl,
        success:(res)=>{
          const nextPageUrl = res.data.nextPageUrl
         let itemList = res.data.issueList[0].itemList
         itemList = itemList.filter((value)=> value.type !== 'banner2')
  
         for(let item of itemList){
           item.videoTimeText = moment(new Date(item.data.duration * 1000)).format('mm:ss')
         }
  
         this.setData({
           dailyList:this.data.dailyList.concat(itemList),
           _nextPageUrl:nextPageUrl
         })
        }
      })
    },
  },
  attached: function() {
    this.onRefresh()
  },
})
