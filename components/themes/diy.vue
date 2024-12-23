<template name="diy">
  <view v-if="loadPageFlag"
        :style="{background:(BgConfig.BackgroundObj.type==1?BgConfig.BackgroundObj.bgColor:('url('+BgConfig.BackgroundObj.path+') no-repeat '+ BgConfig.BackgroundObj.pathColor)), backgroundSize:'100% auto', paddingTop:paddingTop}">

    <view v-for="(item, i) in PageContent" class="dropItem" :key="i" :style="{
                        clear: (item.eltmType==1 || item.eltmType==3) ? 'none' : 'both',
                        paddingTop:(item.paddingTop||0)*2+'rpx',
                        paddingBottom:(item.paddingBottom||0)*2+'rpx',
                        paddingLeft:(item.paddingLeft||0)*2+'rpx',
                        paddingRight:(item.paddingRight||0)*2+'rpx',
                        width:(w-(item.paddingLeft||0)-(item.paddingRight||0))*2+'rpx'}">
      <!--第一个模板-->
      <view :data-id="(item.eltm1.data.did)" :data-name="(item.eltm1.data.name)"
            :data-type="(item.eltm1.data.selectType)" :data-keyword="(item.eltm1.data.keyWord || '')"
            :data-appid="(item.eltm1.data.AppId || '')" :data-appurl="(item.eltm1.data.AppUrl)"
            :data-MinAppUrl="(item.eltm1.data.MinAppUrl || '')" @click="tplGoToPage" v-if="item.eltmType==1"
            :class="{boxFlexItem1:item.flexNum==1,boxFlexItem2:item.flexNum==2,boxFlexItem3:item.flexNum==3,boxFlexItem4:item.flexNum==4,boxFlexItem5:item.flexNum==5,ms:1==1,s1:item.eltm1.layout==1,s2h:item.eltm1.layout==2,s2v:item.eltm1.layout==3,s4h:item.eltm1.layout==4,s4v:item.eltm1.layout==5,s8h:item.eltm1.layout==6,s8v:item.eltm1.layout==7,s16:item.eltm1.layout==8,s250h:item.eltm1.layout==9,fl:item.eltm1.align==1,fr:item.eltm1.align==2,borderStyle:item.eltm1.border}"
            :style="{width:item.eltm1.width+'rpx',height:item.eltm1.height+'rpx',paddingTop:item.eltm1.paddingTop+'px',  paddingRight:item.eltm1.paddingRight+'px', paddingBottom:item.eltm1.paddingBottom+'px', paddingLeft:item.eltm1.paddingLeft+'px', backgroundColor:item.bgColor}">
        <image lazy-load mode="scaleToFill" :src="(item.eltm1.data.path)"></image>
      </view>
      <!--第一个模板-->
      <!--第二个模板-->
      <view v-if="(item.eltmType==2 && item.eltm2.data.words)" class="m-RichText"
            :style="{padding:(item.eltm2.padding)+'px',backgroundColor:(item.bgColor), borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden', clear: 'both'}">
        <wxParse :content="item.eltm2.data.words"/>
      </view>
      <!--第二个模板-->
      <!--第三个模板-->
      <view v-if="(item.eltmType==3)" style="position: relative;"
            :class="{fl:item.eltm3.align==1,fr:item.eltm3.align==2}">
        <view v-if="(item.eltmType==3) && i<3 && (item.eltm3.showNbg || item.eltm3.showNbg!=0)"
              class="bg-ellipse" :style="{backgroundColor: PageNav.window.navigationBarBackgroundColor}"></view>
        <uni-swiper-dot v-if="(item.eltmType==3)" class="uni-swiper-dot-box" @clickItem="clickItem"
                        :info="item.eltm3.data" :current="current" mode="round" field="content" :dots-styles="{backgroundColor: `${item.eltm3.color || '#fff'}`,
					 border: `${item.eltm3.color || '#fff'}`, selectedBackgroundColor: `${item.eltm3.activeColor || '#fff'}`, selectedBorder: `${item.eltm3.activeColor || '#fff'}`}">
          <swiper class="m-scrollBox"
                  :style="{width:(item.eltm3.width*2)+'rpx', height:(item.eltm3.height*2)+'rpx', 'background-color':(item.bgColor), clear: 'both'}"
                  :autoplay="item.eltm3.autoplay" :current="swiperDotIndex" @change="changeswiper">

            <swiper-item v-for="(sitem, si) in item.eltm3.data" :key="si">
              <view :data-id="(sitem.did)" :data-name="(sitem.name)" :data-type="(sitem.selectType)"
                    :data-keyword="(sitem.keyWord || '')" :data-appid="(sitem.AppId || '')"
                    :data-appurl="(sitem.AppUrl)" :data-MinAppUrl="(sitem.MinAppUrl || '')"
                    @click="tplGoToPage">
                <image lazy-load mode="heightFix"
                       :style="{width:(item.eltm3.width*2)+'rpx', height:(item.eltm3.height*2)+'rpx', borderRadius: item.eltm3.borderRadius+ 'px'}"
                       :src="(sitem.path)"></image>
              </view>
            </swiper-item>
          </swiper>
        </uni-swiper-dot>
      </view>
      <!--第三个模板-->


      <!--第四个模板-->
      <scroll-view v-if="(item.eltmType==4)" :scroll-y="item.eltm4.listTyle!=5" :scroll-x="item.eltm4.listTyle==5"
                   :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden', clear: 'both'}">

        <view v-if="(item.eltmType==4)"
              :class="{m_plist:1, p1:item.eltm4.listTyle==1, p2:item.eltm4.listTyle==2, p3:item.eltm4.listTyle==3, p4:item.eltm4.listTyle==4, p5:item.eltm4.listTyle==5}">
          <view class="m_pitem" v-for="(items, ii) in item.eltm4.data" v-if="items" :key="ii" :data-id="(items.did)"
                :data-name="(items.name)"
                :data-type="(items.selectType)" :data-keyword="(items.keyWord || '')" :data-appid="(items.AppId || '')"
                :data-appurl="(items.AppUrl)"
                :data-MinAppUrl="(item.MinAppUrl || '')" @click="tplGoToPage">
            <view class="m_pinfo">
              <view class="pimg" v-if="item.eltm4.listTyle!=5">
                <image lazy-load mode="widthFix" style="width:100%;height:100%"
                       :src="($.img(items.path, 360,  360))"></image>
              </view>
              <view class="pimg" v-else>
                <image lazy-load mode="heightFix" :src="($.img(items.path, 360,  360))"></image>
              </view>

              <view class="pinfo">

                <view class="pname" style="height: 72rpx;">
                  <label
                      :style="{height:'unset !important','line-clamp':item.eltm4.charLine, '-webkit-line-clamp':item.eltm4.charLine}">{{
                      items.name
                    }}</label>
                </view>

                <view class="pSelling"	style="height: 40rpx;"
                      v-if="items.ProductTips!='' && item.eltm4.isProductTips"
                      :style="item.eltm4.isPrice?'':'display: inline-block; padding-top: 24rpx;padding-bottom: 24rpx'">
                  {{ items.ProductTips || '' }}
                </view>

                <view class="pprice" v-if="item.eltm4.isPrice" :style="{color:item.eltm4.priceColor}">

                  <view class="pc" :style="{color:item.eltm4.priceColor}">
                    <block v-if="item.eltm4.isPrice"><label>{{ __('￥') }}</label>{{ items.ItemSalePrice }}
                    </block>
                  </view>

                  <block v-if="items.item_unit_points">
                    <label style="margin: 0rpx 10rpx;">+</label><label
                      style="font-size:32rpx">{{ items.item_unit_points }}</label> <label>{{ __('积分') }}</label>
                  </block>

                  <block v-if="items.item_unit_sp">
                    <label style="margin: 0rpx 10rpx;">+</label><label
                      style="font-size:32rpx">{{ items.item_unit_sp }}</label> <label>{{ __('众宝') }}</label>
                  </block>


                  <view v-if="(item.eltm4.btnType==4)" class="c4"
                        :style="{backgroundColor:(item.eltm4.btnColor),color:(item.eltm4.btnFontColor)}">
                    <label v-if="(item.eltm4.btnType==4)">{{ item.eltm4.btnText }}</label>
                  </view>
                  <view v-else :class="'c'+(item.eltm4.btnType)">
                    <label v-if="(item.eltm4.btnType==3)">buy</label>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <!--第四个模板-->

      <!--第五个模板-->
      <view v-if="(item.eltmType==5)" class="m-blank"
            :style="{height:(item.eltm5.height)+'px','line-height':(item.eltm5.height)+'px','background-color':(item.bgColor)}">
      </view>
      <!--第五个模板-->

      <!--第六个模板-->
      <block v-if="item.eltmType==6">
        <view v-if="item.eltm6.isSwiper" class="card-view"
              :style="{background:'url('+pathBg+') no-repeat', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px'}">
          <swiper class="card-swiper round-dot" previous-margin="288rpx" next-margin="288rpx"
                  :indicator-dots="false" :circular="true" :autoplay="true" interval="5000" duration="500"
                  :data-index="i"
                  @change="cardSwiper" indicator-color="#ffffff" indicator-active-color="#ffffff"
                  :style="{paddingTop:(item.eltm6.paddingTop)+'px',paddingBottom:(item.eltm6.paddingBottom)+'px',paddingLeft:(item.eltm6.paddingLeft)+'px',paddingRight:(item.eltm6.paddingRight)+'px',fontSize:(item.eltm6.fontSize)+'px',color:(item.eltm6.fontColor)}">
            <swiper-item v-for="(items,ii) in item.eltm6.data" :key="ii" :class="cardCur == ii ? 'cur':''">
              <view class="swiper-item shadow-shop" style="border-radius: 24rpx" :data-id="(items.did)"
                    :data-name="(items.name)" :data-type="(items.selectType)"
                    :data-keyword="(items.keyWord || '')" :data-appid="(items.AppId || '')"
                    :data-appurl="(items.AppUrl)" :data-MinAppUrl="(item.MinAppUrl || '')"
                    @click="tplGoToPage">
                <image :src="items.path" mode="aspectFill" style="width: 180rpx;height:100%;"></image>
              </view>
            </swiper-item>
          </swiper>
        </view>
        <scroll-view v-else scroll-x style='clear:both'>
          <view v-if="(item.eltmType==6)"
                :class="{boxFlex:1 ,fdRow:item.eltm6.flexDirection==0, fdRowReverse:item.eltm6.flexDirection==1, fdColumn:item.eltm6.flexDirection==2, fdColumnReverse:item.eltm6.flexDirection==3, fwNowrap:item.eltm6.flexWrap==0,fwWrap:item.eltm6.flexWrap==1,fwWrapReverse:item.eltm6.flexWrap==2,jcFlexStart:item.eltm6.justifyContent==0,jcFlexEnd:item.eltm6.justifyContent==1,jcCenter:item.eltm6.justifyContent==2,jcSpaceBetween:item.eltm6.justifyContent==3,jcSpaceAround:item.eltm6.justifyContent==4,aiFlexStart:item.eltm6.alignItems==0,aiFlexEnd:item.eltm6.alignItems==1,aiCenter:item.eltm6.alignItems==2,aiBaseline:item.eltm6.alignItems==3,aiStretch:item.eltm6.alignItems==4}"
                :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}">
            <view v-for="(items, ii) in item.eltm6.data" :key="ii" :data-id="(items.did)"
                  :data-name="(items.name)" :data-type="(items.selectType)"
                  :data-keyword="(items.keyWord || '')" :data-appid="(items.AppId || '')"
                  :data-appurl="(items.AppUrl)" :data-MinAppUrl="(item.MinAppUrl || '')" @click="tplGoToPage"
                  class="boxFlexItem1"
                  :style="{paddingTop:(item.eltm6.paddingTop)+'px',paddingBottom:(item.eltm6.paddingBottom)+'px',paddingLeft:(item.eltm6.paddingLeft)+'px',paddingRight:(item.eltm6.paddingRight)+'px',fontSize:(item.eltm6.fontSize)+'px',color:(item.eltm6.fontColor)}">
              <view v-if="(item.eltm6.type==1)">{{ items.name }}</view>
              <image lazy-load mode="widthFix" v-if="(item.eltm6.type==0)" :src="(items.path)" class="img"
                     :style="{width:(items.flexNum>1?(items.flexNum+'px'):((w - item.eltm6.paddingLeft - item.eltm6.paddingRight) + 'px')), width:'100%',height:(item.eltm6.height)+'px'}">
              </image>
            </view>
          </view>
        </scroll-view>
      </block>

      <!--第六个模板-->


      <!--第七个模版-->
      <view v-if="(item.eltmType==7) && item.eltm7.data.length>0"
            :class="{boxGrids:1, boxGridsBorder:item.eltm7.border }"
            :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}">
        <view :class="{boxGrid:1, boxGridBorder:item.eltm7.border}"
              v-if="(item.eltmType==7) && item.eltm7.data.length/item.eltm7.column <= 2"
              v-for="(items, ii) in item.eltm7.data"
              :key="ii"
              :style="{width:((100/item.eltm7.column))+'%','padding-top':(item.eltm7.paddingTop)+'px','padding-bottom':(item.eltm7.paddingBottom)+'px','padding-left':(item.eltm7.paddingLeft)+'px','padding-right':(item.eltm7.paddingRight)+'px','background-color':(item.bgColor)}"
              :data-id="(items.did)" :data-name="(items.name)" :data-mobile="(items.mobile)"
              :data-type="(items.selectType)"
              :data-keyword="(items.keyWord || '')"
              :data-appid="(items.AppId || '')" :data-appurl="(items.AppUrl)" :data-MinAppUrl="(item.MinAppUrl || '')"
              @click="tplGoToPage">
          <view class="boxGridIcon">
            <image lazy-load :src="(items.path)"></image>
          </view>
          <label class="boxGridLabel">{{ items.name }}</label>
        </view>

        <swiper v-if="(item.eltmType==7) && item.eltm7.data.length/item.eltm7.column > 2" class="m-scrollBox"
                :class="{boxGrids:1, boxGridsBorder:item.eltm7.border }" :indicator-dots="true" :autoplay="false"
                :style="{height: '340rpx', backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}">
          <block v-for="(bitems, bi) in item.eltm7.data" :key="bi">
            <swiper-item v-if="(bi%(item.eltm7.column*2)==0)">
              <view :class="{boxGrid:1, boxGridBorder:item.eltm7.border}"
                    v-if="ii >= bi  && ii < (bi+item.eltm7.column*2)" v-for="(items, ii) in item.eltm7.data"
                    :key="ii"
                    :style="{width:((100/item.eltm7.column))+'%','padding-top':(item.eltm7.paddingTop)+'px','padding-bottom':(item.eltm7.paddingBottom)+'px','padding-left':(item.eltm7.paddingLeft)+'px','padding-right':(item.eltm7.paddingRight)+'px','background-color':(item.bgColor)}"
                    :data-id="(items.did)" :data-name="(items.name)" :data-mobile="(items.mobile)"
                    :data-type="(items.selectType)"
                    :data-keyword="(items.keyWord || '')"
                    :data-appid="(items.AppId || '')" :data-appurl="(items.AppUrl)"
                    :data-MinAppUrl="(item.MinAppUrl || '')" @click="tplGoToPage">
                <view class="boxGridIcon">
                  <image lazy-load :src="(items.path)"></image>
                </view>
                <label class="boxGridLabel">{{ items.name }}</label>
              </view>
            </swiper-item>

          </block>
        </swiper>
      </view>
      <!--第七个模版-->


      <!--第八个模版-->
      <view v-if="(item.eltmType==8)" class="mTel" :style="{'background-color':(item.bgColor)}"
            :data-tel="(item.eltm8.tel)" @tap="callTel">
        <label class="iconfont icon-dianhua--copy" :style="{'font-size':'30px',color:(item.eltm8.fontColor)}"></label>
      </view>
      <!--第八个模版-->
      <!--第九个模版-->
      <navigator url="/pagesub/search/search" class="u-search-box" v-if="(item.eltmType==9)"
                 :style="{'background-color':(item.bgColor),'padding-top':(item.eltm9.paddingTop)+'px','padding-bottom':(item.eltm9.paddingBottom)+'px','padding-left':(item.eltm9.paddingLeft)+'px','padding-right':(item.eltm9.paddingRight)+'px'}">
        <view class="u-search-cont">
          <uni-icons type="search" size="22" color="#666666"/>
          <text>{{ item.eltm9.tipText }}</text>
        </view>
      </navigator>

      <uni-nav-bar v-if="(item.eltmType==9 && false)" :statusBar="false" :fixed="true" color="#333333"
                   :backgroundColor="BgConfig.BackgroundObj.bgColor" background-color="#ffffff" right-icon="scan"
                   @click-left="showCity" @click-right="scan">
        <block slot="left">
          <view class="city">
            <view>{{ city }}</view>
            <uni-icons type="arrowdown" color="#333333" size="22"/>
          </view>
        </block>
        <view class="input-view">
          <uni-icons type="search" size="22" color="#666666"/>
          <input confirm-type="search" class="input" type="text" :placeholder="__('输入搜索关键词')" @click="onSearch">
        </view>
      </uni-nav-bar>

      <!--第九个模版-->
      <!--第十一个模版-->
      <!-- #ifdef MP-WEIXIN -->
      <movable-area class="movableAreaIM" v-if="(item.eltmType==11 && hasLogin && chatUrl)">
        <movable-view class="movableView" @touchmove.stop.prevent="doNothing" direction="all" :x="initX" :y="initY">
          <view class="mCS"
                :style="{'background-color':(item.bgColor), borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}">

            <view class="m-footer-btn-item" v-if="chatUrl" data-name="管理员" data-keyword="" data-appid="0"
                  :data-appurl="(chatUrl)" :data-type="99" @click="tplGoToPage" style="line-height: 96rpx;">
              <label class="iconfont icon-more" :style="{'font-size':'30px',color:(item.eltm11.fontColor)}"></label>

              <!-- #ifdef MP-WEIXIN -->
              <block v-if="1==plantformInfo.kefu_type_id">
                <contact-button size="27" type="default-dark" session-from="weapp"></contact-button>
              </block>
              <!-- #endif -->
            </view>

          </view>
        </movable-view>
      </movable-area>
      <!-- #endif -->
      <!--第十一个模版-->
      <!--第十二个模版-->
      <view v-if="(item.eltmType==12)"
            :style="{'background-color':(item.bgColor), borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden','padding-top':(item.eltm12.paddingTop)+'px','padding-bottom':(item.eltm12.paddingBottom)+'px','padding-left':(item.eltm12.paddingLeft)+'px','padding-right':(item.eltm12.paddingRight)+'px'}">

        <!-- #ifdef H5 -->
        <video :poster="item.eltm12.poster" :src="(item.eltm12.src)" :controls="(item.eltm12.controls)"
               :loop="(item.eltm12.loop)"
               :style="{width:(item.eltm12.width*2)+'rpx',height:(item.eltm12.height*2)+'rpx', 'background-color':(item.bgColor)}"
               objectFit="fill">
        </video>
        <!-- #endif -->

        <!-- #ifndef H5 -->
        <video :poster="item.eltm12.poster" :src="(item.eltm12.src)" :controls="(item.eltm12.controls)"
               :autoplay="(item.eltm12.autoplay)" :loop="(item.eltm12.loop)"
               :style="{width:(item.eltm12.width*2)+'rpx',height:(item.eltm12.height*2)+'rpx', 'background-color':(item.bgColor)}"
               objectFit="fill" v-if="!hideDiy">
        </video>
        <!-- #endif -->
      </view>
      <!--第十二个模版-->


      <form class="formBox" @submit="formSubmit" @reset="formReset" v-if="item.eltmType==13"
            :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden', clear: 'both'}">
        <view style="margin-left: 40%">{{ item.eltm13.title }}</view>
        <block v-if="all && item.eltm13.collapseNum == 3 ">
          <view v-for="(items, id_d) in item.eltm13.data" :key="id_d" v-if="id_d < item.eltm13.collapseNum ">
            <view class="fromInput" v-if="items.type==1"><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label><input type='text'
                           :name="''+items.id" maxlength="200" v-model="items.value"
                           :placeholder="items.placeholderText"
                           :style='{borderColor:items.borderColor,color:item.eltm13.textColor}'/>
            </view>
            <view class="" v-if="items.type==2"><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label>
              <uni-datetime-picker type="daterange" :start="start" v-model="items.name" :data-id="items.id"
              >

              </uni-datetime-picker>
            </view>

            <view class="fromInput" v-if="items.type==3"><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label><textarea
                :name="''+items.id" maxlength="400" v-model="items.value"
                :placeholder="items.placeholderText"
                :style="{borderColor:items.borderColor,color:item.eltm13.textColor}"></textarea>
            </view>
            <radio-group :name="''+items.id" class="fromInput" v-if="items.type==4 && items.showType == 0 "
                         @change="($event)=>{radioChange(items, $event)}"><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}</label>
              <view class="fromCK_item" v-for="(info, idx) in items.data" :key="idx">
                <radio :color="items.selColor" v-model='info.text'/>
                <text :style="{color:item.eltm13.textColor}">{{ info.text }}</text>
                <input v-if="items.relIndex==idx+1 && info.isCk" v-model="items.kitem"/>
              </view>
            </radio-group>

            <view v-if="items.type==4 && items.showType == 1" class="fromInput">
              <span>{{ items.labelText }}<text class="text-required" v-if="items.isFillIn">*</text></span>
              <xfl-select :list="items.arrDuo" :clearable="false" :showItemNum="5" :listShow="false"
                          :isCanInput="true" :style_Container="'height: 35px; font-size: 16px;'"
                          :placeholder="'请选择'" :selectHideType="'hideAll'"
                          @change="($event)=>{ddp(i, id_d, items, $event)}" :initValue="items.val">
              </xfl-select>
              <block v-for="(info, idx) in items.data" :key="idx">
                <view v-if="items.relIndex==idx+1 && info.isCk" class="fromCK_item">
                  <input v-model="items.kitem"/>
                </view>
              </block>
            </view>


            <checkbox-group :name="''+items.id" class="fromInput"
                            @change="($event)=>{checkboxChange(items, $event)}"
                            v-if="items.type==5 && items.showType == 0 "><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label>

              <view class="fromCK_item" v-for="(info, idx) in items.data" :key="idx">

                <checkbox :color="items.selColor" :checked="info.isCk" :value='info.text'/>
                <text :style="{color:item.eltm13.textColor}">{{ info.text }}</text>
                <input v-if="items.relIndex==idx+1 && info.isCk" v-model="items.kitem"
                       @input="onInputs"/>
              </view>
            </checkbox-group>


            <view v-if="items.type==5 && items.showType == 1" class="fromInput">
              <span>{{ items.labelText }}<text class="text-required" v-if="items.isFillIn">*</text></span>
              <select-cy @change="($event, value)=>{selectCy(i, id_d, items, $event, value)}"
                         :options="items.arrDuo"></select-cy>

              <block v-for="(info, idx) in items.data" :key="idx">
                <view v-if="items.relIndex==idx+1 && info.isCk" class="fromCK_item">
                  <input v-model="items.kitem"/>
                </view>
              </block>
            </view>

            <view class="fromInput" v-if="items.type==6"><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label>
              <view class='upload-view'>
                <view v-for="(info, idx) in items.data" :key="idx" class='upload-img-item'>
                  <image mode="aspectFit" :src='info'></image>
                  <view class='del-upload-img' :data-id="items.id" :data-index='idx'
                        @click.stop='delUploadImg'><label class='iconfont icon-delete'></label></view>
                </view>
                <view class='upload-img' v-if="items.data.length<items.moreNum" :data-id="items.id"
                      :data-num='items.moreNum' @tap='formUploadImage'></view>
              </view>
            </view>
          </view>
          <label style="margin-left: 45%;color: #A76E38;line-height: 40rpx;" @click="expandMenu">展开表单
            <image style="width: 10px;height: 10px;margin-top: 10rpx;" src="../../static/images/zk.png">
            </image>
          </label>
        </block>
        <block v-if="alls || item.eltm13.collapseNum ==0">
          <view v-for="(items, id_d) in item.eltm13.data" :key="id_d">
            <view class="fromInput" v-if="items.type==1"><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label><input type='text'
                           :name="''+items.id" maxlength="200" v-model="items.value"
                           :placeholder="items.placeholderText"
                           :style='{borderColor:items.borderColor,color:item.eltm13.textColor}'/>
            </view>
            <view class="" v-if="items.type==2"><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label>
              <uni-datetime-picker type="daterange" :start="start" v-model="items.name" :data-id="items.id"
              >

              </uni-datetime-picker>
            </view>
            <view class="fromInput" v-if="items.type==3"><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label><textarea
                :name="''+items.id" maxlength="400" v-model="items.value"
                :placeholder="items.placeholderText"
                :style="{borderColor:items.borderColor,color:item.eltm13.textColor}"></textarea>
            </view>
            <radio-group :name="''+items.id" class="fromInput"
                         @change="($event)=>{radioChange(items, $event)}"
                         v-if="items.type==4 && items.showType == 0 "><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label>
              <view class="fromCK_item" v-for="(info, idx) in items.data" :key="idx">
                <radio :color="items.selColor" :checked="info.isCk"
                       :value='info.text'/>
                <text :style="{color:item.eltm13.textColor}">{{ info.text }}</text>

                <input v-if="items.relIndex==idx+1 && info.isCk" v-model="items.kitem"/>
              </view>
            </radio-group>

            <view v-if="items.type==4 && items.showType == 1" class="fromInput">
              <span>{{ items.labelText }}<text class="text-required" v-if="items.isFillIn">*</text></span>
              <xfl-select :list="items.arrDuo" :clearable="false" :showItemNum="5" :listShow="false"
                          :isCanInput="true" :style_Container="'height: 35px; font-size: 16px;'"
                          :placeholder="'请选择'" :selectHideType="'hideAll'"
                          @change="($event)=>{ddp(i, id_d, items, $event)}" :initValue="items.val">
              </xfl-select>
              <block v-for="(info, idx) in items.data" :key="idx">
                <view v-if="items.relIndex==idx+1 && info.isCk" class="fromCK_item">
                  <input v-model="items.kitem"/>
                </view>
              </block>
            </view>


            <checkbox-group :name="''+items.id" class="fromInput"
                            @change="($event)=>{checkboxChange(items, $event)}"
                            v-if="items.type==5 && items.showType == 0 "><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label>
              <view class="fromCK_item" v-for="(info, idx) in items.data" :key="idx">
                <checkbox :color="items.selColor" :checked="info.isCk" :value='info.text'/>
                <text :style="{color:item.eltm13.textColor}">{{ info.text }}</text>
                <input v-if="items.relIndex==idx+1 && info.isCk" v-model="items.kitem"
                       @input="onInputs"/>
              </view>
            </checkbox-group>


            <view v-if="items.type==5 && items.showType == 1" class="fromInput">
              <span>{{ items.labelText }}<text class="text-required" v-if="items.isFillIn">*</text></span>
              <select-cy @change="($event, value)=>{selectCy(i, id_d, items, $event, value)}"
                         :options="items.arrDuo" :value="items.val"></select-cy>

              <block v-for="(info, idx) in items.data" :key="idx">
                <view v-if="items.relIndex==idx+1 && info.isCk" class="fromCK_item">
                  <input v-model="items.kitem"/>
                </view>
              </block>
            </view>

            <view class="fromInput" v-if="items.type==6"><label
                :style="{color:item.eltm13.labelColor}">{{ items.labelText }}
              <text class="text-required" v-if="items.isFillIn">*</text>
            </label>
              <view class='upload-view'>
                <view v-for="(info, idx) in items.data" :key="idx" class='upload-img-item'>
                  <image mode="aspectFit" :src='info'></image>
                  <view class='del-upload-img' :data-id="items.id" :data-index='idx'
                        @click.stop='delUploadImg'><label class='iconfont icon-delete'></label></view>
                </view>
                <view class='upload-img' v-if="items.data.length<items.moreNum" :data-id="items.id"
                      :data-num='items.moreNum' @tap='formUploadImage'></view>
              </view>
            </view>
          </view>

          <label style="margin-left: 40%;color: #A76E38;" v-if="item.eltm13.collapseNum != 0"
                 @click="collapseMenu">折叠表单 ^</label>
        </block>

        <view class="formSubmit">
          <button class="formButtom" formType="submit"
                  :style="{backgroundColor:item.eltm13.btnColor,color:item.eltm13.fontColor}">
            {{ item.eltm13.btnText }}
          </button>
        </view>
      </form>
      <view v-if="item.eltmType==14" class='notice'
            :style="{'background-color':item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden','padding-top':item.eltm14.paddingTop*2 + 'rpx', 'padding-bottom':item.eltm14.paddingBottom*2 + 'rpx',clear: 'both'}">
        <view class="notice-icon ">
          <image
              :src="item.eltm14.image?item.eltm14.image:'https://static.shopsuite.cn/xcxfile/appicon/notice/Notice1.png'"></image>
        </view>
        <swiper autoplay :vertical="item.eltm14.scrollDir==0?true:false" circular class="notice-content">
          <swiper-item v-for="(items, idx) in item.eltm14.data" :key="idx" :data-id="items.did"
                       :data-name="items.name" :data-type="items.selectType"
                       :data-keyword="items.keyWord  || ''" :data-appid="items.AppId  || ''"
                       :data-appurl="items.AppUrl" :data-MinAppUrl="item.MinAppUrl  || ''"
                       @tap="tplGoToPage"><label
              :style="{color:item.eltm14.fontColor}">{{ items.name }}</label></swiper-item>
        </swiper>
        <view class="notice-arrow" :style="{color:item.eltm14.arrowColor}"><label
            class="iconfont icon-right"></label></view>
      </view>
      <view class="head-title" v-if="item.eltmType==15"
            :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden',marginTop:item.eltm15.margin_top*2+'rpx',marginBottom:item.eltm15.margin_bottom*2+'rpx',clear: 'both'}">
        <image v-if="item.eltm15.isIcon" :src="item.eltm15.icon" mode="aspectFit"></image>
        <view class="title-label" :style="{color:item.eltm15.titleColor}">{{ item.eltm15.title }}</view>
        <diy-countdown v-if="item.eltm15.isCountdown" :class="'countdown-box time' + item.eltm15.cssType"
                       :startTime="item.eltm15.startTime" :endTime="item.eltm15.endTime"
                       cttitle="cttitle" time-box="time-box"></diy-countdown>
        <view v-if="item.eltm15.isLink" :data-id="item.eltm15.data.did"
              :data-name="item.eltm15.data.name" :data-type="item.eltm15.data.selectType"
              :data-keyword="item.eltm15.data.keyWord  || ''" :data-appid="item.eltm15.data.AppId  || ''"
              :data-appurl="item.eltm15.data.AppUrl"
              :data-MinAppUrl="item.eltm15.data.MinAppUrl  || ''" @tap="tplGoToPage" class="title-linke"
              :style="{color:item.eltm15.fontColor, fontSize:'24rpx'}">{{ item.eltm15.linkText }}
          <label class="uni-icon uni-icon-arrowright" :style="{color:item.eltm15.arrowColor, fontSize:'30rpx'}"></label>
        </view>
      </view>

      <view v-if="item.eltmType==16"
            :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden',marginTop:item.eltm16.margin_top*2+'rpx',marginBottom:item.eltm16.margin_bottom*2+'rpx',clear: 'both'}">
        <scroll-view scroll-x v-if="item.eltm16.layout==1">
          <view class="activity-box1">
            <block v-for="(items, idx) in item.eltm16.data" :key="idx">
              <navigator v-if="items.selectType!=15"
                         :url="'/pagesub/product/detail?id='+items.did"
                         class="activity-item" :data-Mid="items.mid || ''">
                <view class="activity-img">
                  <image :src="items.path"/>
                  <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                        :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                    <diy-countdown :startTime="items.StartTimeStr"
                                   :endTime="items.EndTimeStr" :showType="1"></diy-countdown>
                  </view>
                  <view class="mark" v-if="item.eltm16.isLabel">
                    <image
                        :src="items.selectType==12?'https://static.shopsuite.cn/xcxfile/appicon/auth/prize3.png':items.selectType==13?'https://static.shopsuite.cn/xcxfile/appicon/auth/prize1.png':items.selectType==14?'https://static.shopsuite.cn/xcxfile/appicon/auth/prize2.png':'https://static.shopsuite.cn/xcxfile/appicon/auth/prize5.png'"
                    />
                  </view>
                </view>
                <view class="activity-info">
                  <view class="activity-name"
                        v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                        :style="{height:item.eltm16.charLine==1?'60rpx':'128rpx','-webkit-line-clamp':item.eltm16.charLine}">
                    {{ items.name }}
                  </view>
                  <view class="activity-price"
                        v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                      class="price"
                      :style="{color:item.eltm16.priceColor}">{{ __('￥') }}{{ items.ItemSalePrice }}</label><label
                      class="del-price"
                      v-if="items.selectType==14">{{ __('￥') }}{{ items.MarketPice }}</label><label
                      class="tip"
                      v-if="items.selectType==12||items.selectType==13">{{ items.UserLimit }}{{ __('人团') }}</label>
                  </view>
                  <view class="activity-desc" v-if="item.eltm16.isShowNum">
                    {{ __('已有') }}{{ items.OrderCount }} {{ __('人参加') }}
                  </view>
                </view>
              </navigator>
              <button v-else class="activity-item" :data-pid="items.did" :data-Mid="items.mid || ''"
                      @click.stop='goCutprice'>
                <view class="activity-img">
                  <image :src="items.path"/>
                  <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                        :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                    <diy-countdown :startTime="items.StartTimeStr"
                                   :endTime="items.EndTimeStr" :showType="1"></diy-countdown>
                  </view>
                  <view class="mark" v-if="item.eltm16.isLabel">
                    <image src='https://static.shopsuite.cn/xcxfile/appicon/auth/prize5.png'/>
                  </view>
                </view>
                <view class="activity-info">
                  <view class="activity-name"
                        v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                        :style="{height:item.eltm16.charLine==1?'60rpx':'128rpx','-webkit-line-clamp':item.eltm16.charLine}">
                    {{ items.name }}
                  </view>
                  <view class="activity-price"
                        v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                      class="price"
                      :style="{color:item.eltm16.priceColor}">{{ __('￥') }}{{ items.ItemSalePrice }}</label>
                  </view>
                  <view class="activity-desc" v-if="item.eltm16.isShowNum">
                    {{ __('已有') }}{{ items.OrderCount }} {{ __('人参加') }}
                  </view>
                </view>
              </button>
            </block>
          </view>
        </scroll-view>
        <view v-if="item.eltm16.layout==2" class="activity-box2">
          <block v-for="(items, idx) in item.eltm16.data" :key="idx">
            <navigator v-if="items.selectType!=15"
                       :url="'/pagesub/product/detail?id='+items.did"
                       class="activity-item" :data-Mid="items.mid || ''">
              <view class="activity-img">
                <image :src="items.path"/>
                <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                      :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                  <diy-countdown :startTime="items.StartTimeStr" :endTime="items.EndTimeStr"
                                 :showType="1"></diy-countdown>
                </view>
                <view class="mark" v-if="item.eltm16.isLabel">
                  <image
                      :src="items.selectType==12?'https://static.shopsuite.cn/xcxfile/appicon/auth/prize3.png':items.selectType==13?'https://static.shopsuite.cn/xcxfile/appicon/auth/prize1.png':'https://static.shopsuite.cn/xcxfile/appicon/auth/prize2.png'"/>
                </view>
              </view>
              <view class="activity-info">
                <view class="activity-name"
                      v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                      :style="{height:item.eltm16.charLine==1?'60rpx':'128rpx','-webkit-line-clamp':item.eltm16.charLine}">
                  {{ items.name }}
                </view>
                <view class="activity-price"
                      v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                    class="price"
                    :style="{color:item.eltm16.priceColor}">{{ __('￥') }}{{ items.ItemSalePrice }}</label><label
                    class="del-price" v-if="items.selectType==14">{{ __('￥') }}{{ items.MarketPice }}</label><label
                    class="tip" v-if="items.selectType!=14">{{ items.UserLimit }}{{ __('人团') }}</label>
                </view>
                <view class="activity-desc" v-if="item.eltm16.isShowNum">{{ __('已有') }}{{ items.OrderCount }}
                  {{ __('人参加') }}
                </view>
              </view>
            </navigator>
            <button v-else class="activity-item" :data-pid="items.did" :data-Mid="items.mid || ''"
                    @click.stop='goCutprice'>
              <view class="activity-img">
                <image :src="items.path"/>
                <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                      :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                  <diy-countdown :startTime="items.StartTimeStr" :endTime="items.EndTimeStr"
                                 :showType="1"></diy-countdown>
                </view>
                <view class="mark" v-if="item.eltm16.isLabel">
                  <image src="https://static.shopsuite.cn/xcxfile/appicon/auth/prize5.png"/>
                </view>
              </view>
              <view class="activity-info">
                <view class="activity-name"
                      v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                      :style="{height:item.eltm16.charLine==1?'60rpx':'128rpx','-webkit-line-clamp':item.eltm16.charLine}">
                  {{ items.name }}
                </view>
                <view class="activity-price"
                      v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                    class="price"
                    :style="{color:item.eltm16.priceColor}">{{ __('￥') }}{{ items.ItemSalePrice }}</label></view>
                <view class="activity-desc" v-if="item.eltm16.isShowNum">{{ __('已有') }}{{ items.OrderCount }}
                  {{ __('人参加') }}
                </view>
              </view>
            </button>
          </block>
        </view>
        <view v-if="item.eltm16.layout==3" class="activity-box3">
          <block v-for="(items, idx) in item.eltm16.data" :key="idx">
            <navigator v-if="items.selectType!=15"
                       :url="'/pagesub/product/detail?id='+items.did"
                       class="activity-item" :data-Mid="items.mid || ''">
              <view class="activity-img">
                <image :src="items.path"/>
                <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                      :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                  <diy-countdown :startTime="items.StartTimeStr" :endTime="items.EndTimeStr"
                                 :showType="1"></diy-countdown>
                </view>
                <view class="mark" v-if="item.eltm16.isLabel">
                  <image
                      :src="items.selectType==12?'https://static.shopsuite.cn/xcxfile/appicon/auth/prize3.png':items.selectType==13?'https://static.shopsuite.cn/xcxfile/appicon/auth/prize1.png':items.selectType==14?'https://static.shopsuite.cn/xcxfile/appicon/auth/prize2.png':'https://static.shopsuite.cn/xcxfile/appicon/auth/prize5.png'"
                  />
                </view>
              </view>
              <view class="activity-info">
                <view class="activity-name"
                      v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                      :style="{height:item.eltm16.charLine==1?'60rpx':'128rpx','-webkit-line-clamp':item.eltm16.charLine}">
                  {{ items.name }}
                </view>
                <view class="activity-desc"><label class="tip"
                                                   v-if="items.selectType==12||items.selectType==13">{{
                    items.UserLimit
                  }}{{ __('人团') }}</label><label
                    v-if="item.eltm16.isShowNum">{{ __('已有') }}{{ items.OrderCount }} {{ __('人参加') }}</label></view>
                <view class="activity-price"
                      v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                    class="price"
                    :style="{color:item.eltm16.priceColor}">{{ __('￥') }}{{ items.ItemSalePrice }}</label><label
                    class="del-price" v-if="items.selectType==14">{{ __('￥') }}{{ items.MarketPice }}</label>
                  <view class='activity-btn'
                        :style="{backgroundColor:item.eltm16.btnBgColor,color:item.eltm16.btnFontColor}">
                    {{
                      items.words || (items.selectType == 14 ? __('去秒杀') : items.selectType == 15 ? __('去砍价') : __('立即开团'))
                    }}
                  </view>
                </view>
              </view>
            </navigator>
            <button v-else class="activity-item" :data-pid="items.did" :data-Mid="items.mid || ''"
                    @click.stop='goCutprice'>
              <view class="activity-img">
                <image :src="items.path"/>
                <view class="activity-countdown" v-if="item.eltm16.isCountdown"
                      :style="{backgroundColor:item.eltm16.countdownBgColor,color:item.eltm16.countdownFontColor}">
                  <diy-countdown :startTime="items.StartTimeStr" :endTime="items.EndTimeStr"
                                 :showType="1"></diy-countdown>
                </view>
                <view class="mark" v-if="item.eltm16.isLabel">
                  <image src='https://static.shopsuite.cn/xcxfile/appicon/auth/prize5.png'/>
                </view>
              </view>
              <view class="activity-info">
                <view class="activity-name"
                      v-if="item.eltm16.isShowPname==null || item.eltm16.isShowPname"
                      style="{height:(item.eltm16.charLine==1?'60rpx':'128rpx'),'-webkit-line-clamp':item.eltm16.charLine}">
                  {{ items.name }}
                </view>
                <view class="activity-desc"><label class="tip"
                                                   v-if="items.selectType==12||items.selectType==13">{{
                    items.UserLimit
                  }}{{ __('人团') }}</label><label
                    v-if="item.eltm16.isShowNum">{{ __('已有') }}{{ items.OrderCount }} {{ __('人参加') }}</label></view>
                <view class="activity-price"
                      v-if="item.eltm16.isShowPrice==null || item.eltm16.isShowPrice"><label
                    class="price"
                    :style="{color:item.eltm16.priceColor}">{{ __('￥') }}{{ items.ItemSalePrice }}</label><label
                    class="del-price" v-if="items.selectType==14">{{ __('￥') }}{{ items.MarketPice }}</label>
                  <view class='activity-btn'
                        :style="{backgroundColor:item.eltm16.btnBgColor,color:item.eltm16.btnFontColor}">
                    {{
                      items.words || (items.selectType == 14 ? __('去秒杀') : items.selectType == 15 ? __('去砍价') : __('立即开团'))
                    }}
                  </view>
                </view>
              </view>
            </button>
          </block>
        </view>
      </view>
      <view v-if="item.eltmType==17"
            :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden', marginTop:item.eltm17.margin_top*2+'rpx',marginBottom:item.eltm17.margin_bottom*2+'rpx',clear: 'both'}">
        <scroll-view scroll-x>
          <view class="coupon_box">
            <button class="coupon_item" open-type='getUserInfo' v-if="item.eltmType==17 && item.eltm17.layout==1"
                    v-for="(items, idx) in item.eltm17.data" :key="idx" :data-id="items.did"
                    :data-name="items.name" :data-type="items.selectType"
                    :data-keyword="items.keyWord  || ''"
                    :data-appid="items.AppId  || ''" :data-appurl="items.AppUrl"
                    :data-MinAppUrl="item.MinAppUrl  || ''" @tap="tplGoToPage" style="margin:0">
              <view class="coupon_price">{{ __('￥') }}{{ items.ItemSalePrice }}</view>
              <view class="coupon_desc">{{ items.name || items.ProductTips }}</view>
            </button>
            <button v-if="item.eltmType==17 && item.eltm17.layout==2" open-type='getUserInfo'
                    v-for="(items, idx) in item.eltm17.data" :key="idx" class="coupon_img"
                    :data-id="items.did" :data-name="items.name" :data-type="items.selectType"
                    :data-keyword="items.keyWord  || ''"
                    :data-appid="items.AppId  || ''" :data-appurl="items.AppUrl"
                    :data-MinAppUrl="item.MinAppUrl  || ''" @tap="tplGoToPage" style="margin:0">
              <image :src="items.path"></image>
            </button>
          </view>
        </scroll-view>
      </view>
      <view class='official-account' v-if="item.eltmType==18"
            :style="{backgroundColor:item.bgColor,paddingTop:item.eltm18.paddingTop*2+'rpx',paddingBottom:item.eltm18.paddingBottom*2+'rpx',clear: 'both'}">
        <official-account @error="mpError" @load="mpLoad"></official-account>
      </view>

      <!--104模板-->
      <product-lists :id="'product-'+ uniId" :uniId="uniId" :isFilterFixed="isFilterFixed" :fixTop="fixTop"
                     :isShowFilter="item.eltm104.isShowFilter" :options="item.eltm104"
                     :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}"
                     v-if="item.eltmType==104">

      </product-lists>

      <!--104模板-->

      <!--301模板-->
      <guess-you-like ref="guessYouLike" :id="'product-'+ uniId" :uniId="uniId" :isFilterFixed="isFilterFixed"  :fixTop="fixTop"
                      :isShowFilter="item.eltm101.isShowFilter"
                      :isShowLoading="item.eltm101.isShowLoading" :optionStr="item.eltm101.options"
                      :viewtype="item.eltm101.viewtype*1" :titleText="item.eltm101.title"
                      :titleColor="item.eltm101.titleColor" :bgColor="item.bgColor" :paddingLeft="item.paddingLeft||0"
                      :paddingRight="item.paddingRight||0"
                      :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}"
                      v-if="item.eltmType==101"></guess-you-like>
      <!--301模板-->


      <!--302模板-->
      <store-lists ref="storeLists" :id="'store-'+ uniId" :uniId="uniId" :isFilterTop0="isFilterFixed"  :isFilterFixed="isFilterFixed"   :fixTop="fixTop"
                   :isShowFilter="item.eltm102.isShowFilter" :isShowLoading="item.eltm102.isShowLoading"
                   :optionStr="item.eltm102.options" :viewtype="item.eltm102.viewtype*1" :titleText="item.eltm102.title"
                   :titleColor="item.eltm102.titleColor" :bgColor="item.bgColor" paddingTop="0"
                   :style="{backgroundColor:item.bgColor, borderTopLeftRadius: (item.borderTopLeftRadius||0) + 'px', borderTopRightRadius: (item.borderTopRightRadius||0) + 'px', borderBottomLeftRadius: (item.borderBottomLeftRadius||0) + 'px', borderBottomRightRadius: (item.borderBottomRightRadius||0) + 'px', overflow: 'hidden'}"
                   v-if="item.eltmType==102"></store-lists>
      <!--302模板-->
    </view>
  </view>
</template>

<script>
import wxParse from '@/components/u-parse/u-parse.vue'
import diyCountdown from '../../components/themes/diy-countdown'

import guessYouLike from '@/components/product-list.vue'
import storeLists from '@/components/store-lists.vue'
import productLists from '@/components/item-list.vue'
import selectCy from '@/components/select-cy/select-cy.vue'
import xflSelect from '@/components/xfl-select/xfl-select.vue'
import {mapMutations, mapState} from 'vuex'
import $ from "../../helpers/util";

export default {
  name: "diy",
  components: {
    guessYouLike,
    storeLists,
    wxParse,
    diyCountdown,
    productLists,
    selectCy,
    xflSelect
  },
  props: {
    BgConfig: {
      type: Object,
      default() {
        return {BackgroundObj: {type: 1, bgColor: '#ffffff', "pathColor": "#f8f8f8", "path": ""}}
      },
    },
    PageContent: {
      type: Array,
      default() {
        return []
      },
    },
    pageId:
        {
          type: Number,
          default() {
            return 0
          },
        },
    PageNav: {
      type: Object,
      default() {
        return {
          window: {
            "navigationBarBackgroundColor": "#ffffff",
            "navigationBarTextStyle": "black",
            "navigationBarTitleText": "",
            "backgroundColor": "#f8f8f8",
            "backgroundTextStyle": "dark"
          }
        }
      },
    },
    StoreInfo: {
      type: Object,
      default() {
        return {}
      },
    },
    loadPageFlag: {
      type: Boolean,
      default() {
        return false
      },
    },
    isFilterFixed: {
      type: Boolean,
      default() {
        return false
      },
    },
    fixTop: {
      type: Number,
      default() {
        return 0
      },
    },
    hideDiy: {
      type: Boolean,
      default() {
        return false
      },
    },
    uniId: {
      type: String,
      default() {
        return 'diy'
      },
    },
    paddingTop: {
      type: String,
      default() {
        return '0rpx'
      },
    }
  },
  data() {
    return {
      w: 375, //windowWidth
      loaded: false,
      all: true,
      alls: false,
      inputs: false,
      dxks: false,
      chatUrl: '',
      images: '',
      groupitem: '',
      radioitem: '',
      initX: '690',
      initY: '1336',
      dotsStyles: {
        backgroundColor: '#fff',
        border: '#fff',
        selectedBackgroundColor: '#fff',
        selectedBorder: '#fff'
      },
      current: 0,
      dxk: false,
      swiperDotIndex: 0,
      num: 50,
      cardCur: 0,
      previous: '100rpx',
      start: '2022-12-21',
      title: '',
      tval: [],
      tvals: [],
      LinList: [{
        value: '1',
        label: '精装',
        isCheckbox: false
      }, {
        value: '2',
        label: '简装',
        isCheckbox: false
      }, {
        value: '3',
        label: '豪装',
        isCheckbox: false
      }, {
        value: '4',
        label: '清水',
        isCheckbox: false
      }],
      isMultiple: true, //true多选/false单选
      isShow: false, //显示

      pathBg: '',

    }
  },
  mounted() {
    let that = this;
    let view = uni.createSelectorQuery().in(that).select(".movableAreaIM");
    view.fields({
      size: true,
      scrollOffset: true
    }, data => {
      if (data) {
        that.setData({
          initX: data.width,
          initY: data.height - 100,
        });
      }
    }).exec();
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  /**
   * 生命周期函数--监听页面显示
   */

  created: function () {
    let that = this;
	
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = (month > 9) ? month : ('0' + month);
    day = (day < 10) ? ('0' + day) : day;
    this.start = year + '-' + month + '-' + day;
    if (this.StoreInfo.im_enable) {

      var perm_id = that.$.getStorageSync('uid');
      var perm_key = that.$.getStorageSync('ukey');

      /*
      let chat_url = that.$.sprintf(
              "%s/wap/im.html?from=app&item_id=%s&user_other_id=%s&puid=%s&name=%s&avatar=%s&uid=%s&ukey=%s", that.cf.fileBasePath,
              '', this.StoreInfo.im_user_id, this.StoreInfo.puid, encodeURIComponent('管理员'), encodeURIComponent(that.cf.SiteLogo), perm_id, encodeURIComponent(perm_key))
      */
      //chat_url = that.$.sprintf("%s/wap/tmpl/member/chat_info_app.html?from=app&item_id=%s&user_other_id=%s&puid=%s&name=%s", that.cf.fileBasePath, '', this.StoreInfo.im_user_id, this.StoreInfo.puid, encodeURIComponent('管理员'))

      let chat_url = this.$.sprintf("/im/chat/chat?uid=%s", this.StoreInfo.im_user_id);

      this.setData({
        chatUrl: chat_url
      });
    }

    for (var i in this.PageContent) {
      if (this.PageContent[i].eltm6 && this.PageContent[i].eltm6.isSwiper) {
        this.pathBg = this.PageContent[i].eltm6.data[0].pathBg;

      }
    }
    console.log(this.PageContent)
    that.sharingBackgroundImage()
    setTimeout(() => {
      this.loaded = true;
    }, 10);
  },

  onPageScroll: function (e) { //nvue暂不支持滚动监听，可用bindingx代替
    console.log("滚动距离为：" + e.scrollTop);
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum']),
    cardSwiper(e) {
      this.cardCur = e.detail.current
      var index = e.currentTarget.dataset.index
      var img = this.PageContent[index].eltm6.data[this.cardCur].pathBg;
      this.pathBg = img;
      console.log(e.detail.current)
    },
    mpError: function (e) {
      console.info(e)
    },
    selectCy: function (x, id_d, items, evt, value) {
      console.log(evt, value)
      console.log(items)
      items.val = []


      this.PageContent[x].eltm13.data[id_d].val = [];


      for (let i = 0; i < items.data.length; i++) {
        for (var j in value) {
          if (value[j] == items.data[i].text) {
            items.data[i].isCk = true;
            this.PageContent[x].eltm13.data[id_d].data[i].isCk = true;
            items.val.push(value[j])
            this.PageContent[x].eltm13.data[id_d].val.push(value[j])
            break;
          }

          items.data[i].isCk = false;
          this.PageContent[x].eltm13.data[id_d].data[i].isCk = false;
        }
      }

      this.$forceUpdate();
    },

    checkboxChange: function (items, evt) {
      items.val = [];

      for (let i = 0; i < items.data.length; i++) {
        for (var j in evt.detail.value) {
          if (evt.detail.value[j] == items.data[i].text) {
            items.data[i].isCk = true;
            items.val.push(evt.detail.value[j]);
            break;
          }

          items.data[i].isCk = false;
        }
      }
    },

    onInputs: function (evt) {
    },

    radioChange: function (items, evt) {
      items.val = evt.detail.value;

      for (let i = 0; i < items.data.length; i++) {
        if (items.data[i].text === evt.detail.value) {
          items.data[i].isCk = true;
        } else {
          items.data[i].isCk = false;
        }
      }
    },

    ddp: function (i, id_d, items, evt) {
      console.log('ddp')
      console.log(items)
      console.log(evt)

      this.PageContent[i].eltm13.data[id_d].val = evt.newVal;

      for (let j = 0; j < items.data.length; j++) {
        if (items.data[j].text === evt.newVal) {
          this.PageContent[i].eltm13.data[id_d].data[j].isCk = true;
        } else {
          this.PageContent[i].eltm13.data[id_d].data[j].isCk = false;
        }
      }

      this.$forceUpdate();
    },
    checkedx: function (text, value) {

      for (var i in value) {
        if (text == value[i]) {

          return true;
        }

      }

      return false;
    },
    checked(text, value) {
      if (text == '其他') {
        this.inputs = true
      } else {

      }
      if (text == value) {
        return true;
      }

      return false;

    },

    mpLoad: function (e) {
      console.info(e)
    },
    sharingBackgroundImage: function () {
      var that = this;
    },
    doNothing: function () {
    },
    handleContact(e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
    },
    callTel: function (e) {
      let that = this;
      that.$.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel
      });
    },
    tplGoToPage: function (e) {
      let that = this;
      var t = e.currentTarget.dataset;

      //console.info(t);
      switch (parseInt(t.type)) {
        case 1:
          that.$.gopage("/pagesub/product/detail?id=" + t.id);
          break;
        case 2:
          that.$.gopage("/pagesub/product/list?category_id=" + (t.id || 0) + "&cname=" + t.name);
          break;
        case 3:
          that.$.gopage("/pagesub/product/list?pname=" + t.keyword);
          break;
        case 4: //快捷入口
          //console.info(t.appurl);
          if (t.appurl.indexOf("article-list") >= 0) {
            that.$.gopage('/pagesub/article/list');
          } else if (t.appurl.indexOf("cashaccount/cashaccount") >= 0) {
            that.$.gopage('/member/cash/predeposit');
          } else if (t.appurl.indexOf("kind_id=1202") >= 0) {
            that.$.gopage('/member/order/list?kind_id=1202');
          } else if (t.appurl.indexOf("?type=3&sl=3") >= 0) {
            that.$.gopage('/member/order/list?type=3&sl=3');
          } else if (t.appurl.indexOf("goodcollection/goodcollection") >= 0) {
            that.$.gopage('/member/member/favorites');
          } else if (t.appurl.indexOf("luckydraw/luckydraw") >= 0) {
            that.$.gopage('/member/luckydraw/detail');
          } else {
            that.$.gopage(t.appurl);
          }


          //console.info(t.appurl);
          break;
        case 5:
          if (t.appurl.indexOf("fanslist/fanslist") >= 0) {
            that.$.gopage('/member/fans/list');
          } else {
            that.$.gopage("/pagesub/article/list?category_id=" + (t.id || 0));
          }
          //that.$.gopage(t.appurl);
          break;
        case 6:
          that.$.gopage("/pagesub/article/detail?id=" + t.id);
          //that.$.gopage(t.appurl);
          break;
        case 7:
          uni.navigateToMiniProgram({
            appId: t.appid,
            path: t.appurl || ""
          });
          break;
        case 8:
          that.$.gopage("/pagesub/diy-page/diy-page?id=" + t.id);
          break;
        case 9:
          that.$.gopage(
              '/pagesub/webpage/webpage?u=' +
              encodeURIComponent(t.appurl) +
              '&tn=' +
              t.name +
              '&tc=' +
              t.appid +
              '&tb=' +
              t.keyword
          );
          break;
        case 99:
          if (0 == that.plantformInfo.kefu_type_id) {
            that.$.gopage(t.appurl);
          }
          break;
        case 10:
          that.$.gopage(t.appurl);
          break;
        case 11:
          that.$.gopage(t.appurl);
          break;

        case 12:
          if (typeof t.mobile != "undefined") {
            that.$.makePhoneCall({
              phoneNumber: t.mobile, //电话号码
              success: function (e) {
                console.log(e);
              },
              fail: function (e) {
                console.log(e);
              },
            });
          } else {
            that.$.makePhoneCall({
              phoneNumber: t.name
            });
          }

          break;
        case 17:
          that.getCoupon(t.id)
          break;
        case 62:
          that.$.gopage("/product/index/list?store_category_id=" + (t.id || 0) + "&cname=" + t.name);
          break;
      }
    },

    formUploadImage: function (t) {
      var a = this,
          e = t.target.dataset,
          o = this.PageContent,
          r = a.getFormImageObj(o, e.id);
      a.$.chooseImage({
        count: e.num - r.item.data.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: function (t) {
          a.uploadImg(t.tempFilePaths, function (t) {
            o[r.i].eltm13.data[r.j].data = r.item.data.concat(t), a.setData({
              PageContent: o
            })
          })
        }
      })
    },
    getFormImageObj: function (t, a) {
      for (var e = 0; e < t.length; e++) {
        if (13 == t[e].eltmType) {
          for (var o = t[e].eltm13.data, r = 0; r < o.length; r++) {
            if (o[r].id == a) {
              return {
                item: o[r],
                i: e,
                j: r
              }
            }
          }
        }
      }
    },
    delUploadImg: function (t) {
      var a = t.currentTarget.dataset,
          e = this.PageContent,
          o = this.getFormImageObj(e, a.id);
      o.item.data.splice(a.index, 1), e[o.i].eltm13.data[o.j].data = o.item.data, this.setData({
        PageContent: e
      })

      this.$forceUpdate();
    },
    uploadImg: function (t, e) {
      let that = this;
      for (var a = 0; a < t.length; a++) {
        that.$.showLoading(), that.$.uploadFile({
          url: that.cf.URL.upload,
          method: "POST",
          filePath: t[a],
          name: "upfile",
          formData: {
            user: a,
            store_id: that.cf.storeId
          },
          //header: {"content-type": "multipart/form-data"},
          success: function (t) {
            that.$.hideLoading();

            var up_res = that.$.parseJSON(t.data);
            var url = up_res.data.file_url;
            e(url)


            that.$forceUpdate();
          },
          fail: function (t) {
          },
          complete: function (t) {
          }
        })
      }
    },
    expandMenu: function () {
      this.all = !this.all,
          this.alls = !this.alls;
    },
    collapseMenu: function () {
      this.all = !this.all,
          this.alls = !this.alls;
      this.num = 3
    },

    bindDateChange: function (t) {
      for (var a = this.PageContent, e = 0; e < a.length; e++) {
        if (13 == a[e].eltmType) {
          for (var o = a[e].eltm13.data, r = 0; r < o.length; r++) {
            o[r].id == t.target.dataset.id && (o[r].name = t.detail.value);
            o[r].id == t.target.dataset.id && (this.$set(this.PageContent[e].eltm13.data, r, o[r]));
          }
        }
      }
      this.$forceUpdate();
      //this.setData({PageContent: a})
    },
    formSubmit: function (t) {
      var that = this;

      for (var a = this, e = 1, form_data = [], r = 0; r < a.PageContent.length; r++) {
        if (13 == a.PageContent[r].eltmType) {
          that.title = a.PageContent[r].eltm13.title
          e = a.PageContent[r].eltm13.submitNum;
          for (var elt_data = a.PageContent[r].eltm13.data, i = 0; i < elt_data.length; i++) {
            var item_val = t.detail.value[elt_data[i].id],
                d = elt_data[i].isFillIn,
                c = elt_data[i].labelText,
                l = elt_data[i].type,
                m = elt_data[i].id,
                vit = {},
                u = true;
            if (2 == elt_data[i].type) {
              if (d) {
                if (that.$.isNull(elt_data[i].name)) {
                  return that.$.confirm(elt_data[i].placeholderText), u = false;
                }
                item_val = elt_data[i].name, u = true
              } else {
                that.$.isNull(elt_data[i].name) || (item_val = elt_data[i].name), u = !0;
              }
            } else if (6 == elt_data[i].type) {
              if (elt_data[i].isUploadImage) {
                if (0 == elt_data[i].data.length) {
                  return that.$.confirm(that.__("请上传图片！")), u = false;
                }
                item_val = elt_data[i].data
              } else {
                item_val = elt_data[i].data;
              }
            } else if (d) {

              if (that.$.isNull(item_val)) {
                console.log(elt_data[i])
                //select 控件form表单不具备值
                if (1 == elt_data[i].showType) {
                  //设置值, 修正的。
                  console.info("设置值, 修正的")
                  console.info(elt_data[i])
                  item_val = elt_data[i].val

                  if (that.$.isNull(item_val)) {
                    return that.$.confirm(elt_data[i].labelText + "未填写"), u = false;
                  }

                } else {
                  return that.$.confirm(elt_data[i].labelText + "未填写"), u = false;
                }
              }

              if (0 < elt_data[i].isVerification) {
                if (1 == elt_data[i].isVerification) {
                  if (!/^1[3456789]\d{9}$/.test(item_val)) {
                    return that.$.confirm(that.__("请输入正确的手机号码！")), u = false;
                  }
                  u = true
                }
                if (2 == elt_data[i].isVerification) {
                  if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(item_val)) {
                    return that.$.confirm(that.__("请输入正确的邮箱地址！")), u = false;
                  }
                  u = true
                }
              } else {
                u = true
              }
            } else {
              if (!that.$.isNull(item_val)) {
                if (0 < elt_data[i].isVerification) {
                  if (1 == elt_data[i].isVerification) {
                    if (!/^1[3456789]\d{9}$/.test(item_val)) {
                      return that.$.confirm(that.__("请输入正确的手机号码！")), u = false;
                    }
                    u = true
                  }
                  if (2 == elt_data[i].isVerification) {
                    if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(
                        item_val)) {
                      return that.$.confirm(that.__("请输入正确的邮箱地址！")), u = false;
                    }
                    u = true
                  }
                } else {
                  u = true;
                }
              }
              u = true
            }
            u && (vit.id = m, vit.key = c, vit.value = item_val, vit.type = l, vit.kitem = elt_data[i]
                .kitem, form_data.push(vit))
          }
        }
      }

      /*
      for (var i in form_data) {
        for (var j in elt_data) {
          if (elt_data[j].type == 5) {
            elt_data[j].kitem = that.groupitem
          }
          if (elt_data[j].type == 4) {
            elt_data[j].kitem = that.radioitem
          }
          if (form_data[i].type == 5) {
            form_data[i].kitem = that.groupitem
          }
          if (form_data[i].type == 4) {
            form_data[i].kitem = that.radioitem
          }
        }
      }
       */

      var params = {
        question_data: JSON.stringify(elt_data),
        page_id: that.pageId,
        title: that.title,
        form_data: JSON.stringify(form_data),
      };

      console.info(params);


      that.$.request({
        url: this.cf.URL.survey,
        data: params,
        method: "POST",
        success: function (data, status, msg, code) {
          if (status == 200) {
            (that.$.alert(that.__('提交信息成功！')), that.formReset());
            that.$.navigateBack(1);
          } else {
            that.$.confirm(that.__(msg));
          }
        }
      });
    },
    formReset: function (t) {
      var that = this;
    },
    confirm: function (t) {
      var that = this;
    },
    clickItem(e) {
      console.log(e);
      this.swiperDotIndex = e;
    },
    changeswiper(e) {
      this.current = e.detail.current;
    },
    getCoupon: function (t) {
      let that = this;
      var params = {
        activity_id: t,
        user_is_new: 0
      };

      this.forceUserInfo((user) => {
        if (user) {
          $.request({
            url: this.Config.URL.user.voucher_add,
            data: params,
            success: function (data, status, msg, code) {
              if (200 == status) {
                $.alert(that.__("领取成功!"));
                //that.getCouponlist()
              } else {
                $.alert(msg);
              }
            },
          });
        }
      });


      /*
      t && $.clearxsr($.makeUrl(userapi.UserReceiveCoupon, params), function (t) {
          0 == t.Code ? (that.setData({isCancelSuccess: false, mskType: 2, Coupons: t.Info}), wx.showToast({
              title: "领取成功！",
              icon: "none"
          })) : wx.showToast({title: t.Msg, icon: "none"})
      })

      */
    }
  }
}
</script>


<style lang="scss">
@import "../../styles/_variables";

@import '../../styles/layout.scss';
@import '../../styles/store_themes.scss';
@import '../../styles/store_tpl.scss';

uni-page-body {
  background-color: $body-bg !important;
  min-height: 100% !important;
  height: 100% !important;
}

.m-footer-btn-item {
  width: 88rpx;
  height: 120rpx;
  background-image: url('data:image/png;base64,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');
  background-repeat: no-repeat;
  background-position: top center !important;

}


.card-swiper {
  height: 240rpx !important;
}

.card-swiper swiper-item {
  width: 180rpx !important;
  // left: 288rpx;
  box-sizing: border-box;
  // margin: 0rpx 10rpx;
  overflow: initial;
  /* margin: 100rpx 0; */

}

.card-swiper swiper-item .swiper-item {
  width: 100%;
  display: block;
  height: 100%;
  border-radius: 10rpx;
  transform: scale(0.833333);
  transition: all 0.2s ease-in 0s;
  overflow: hidden;

}

.card-swiper swiper-item.cur .swiper-item {
  transform: none;
  transition: all 0.2s ease-in 0s;
}

.card-view {
  background-size: 100% auto !important;
}

.text-required {
  padding: 0 6rpx;
  color: red;
}
</style>
