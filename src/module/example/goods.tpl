<div class="con-title">
    <p><a class="link-blue">商品库</a> / 发布商品</p>
</div>
<!-- title end -->
<!-- 右侧主体内容begain -->
<div class="wrap_right_con">
    <div class="all_order add-product-wrap">
        <div class="tabContainer">
            <div class="J_tab_container mt-10">
                <div class="tab_sheet J_tab_render">
                    <!--切换导航 beg-->
                    <ul class="tab_list">
                        <li class="J_item_click">1.选择商品品类</li>
                        <li class="J_item_click active">2.编辑基本信息</li>
                        <li class="J_item_click">3.编辑商品详情</li>
                    </ul>
                    <!--切换导航 end-->
                </div>
            </div>
        </div>
        <!--切换内容区域 beg-->
        <div class="listContent">
            <!--步骤内容二 beg-->
            <div class="step-container">
                <!--基本信息 beg-->
                <div class="product-section">
                    <div class="product-column-tit">
                        <div>基本信息</div>
                    </div>
                    <div class="form-horizontal product-column-con product-basci-info">
                        <div class="form-group">
                            <label class="form-label">商品类目：</label>

                            <div class="form-controls">
                                <!--步骤一中获得的选择的类目-->
                                <div class="class-value">
                                    商品
                                </div>
                            </div>
                        </div>

                        <!--购买方式 beg-->
                        <div class="form-group">
                            <label class="form-label">购买方式：</label>

                            <div class="form-controls">
                                <label class="radio inline">
                                    <input type="radio" name="product-pay" checked>
                                    线上店铺购买
                                </label>
                                <label class="radio inline">
                                    <input type="radio" name="product-pay">
                                    线下店铺购买
                                </label>
                            </div>
                        </div>
                        <!--购买方式 end-->

                        <!--商品类型 beg-->
                        <div class="form-group">
                            <label class="form-label">商品类型：</label>

                            <div class="form-controls">
                                <label class="radio inline">
                                    <input type="radio" name="product-type" checked>
                                    实物商品(物流发货)
                                </label>
                                <label class="radio inline">
                                    <input type="radio" name="product-type">
                                    虚拟商品(无需发货)
                                </label>

                                <p class="help-tip">发布后不能修改</p>
                            </div>
                        </div>
                        <!--商品类型 end-->

                        <!--预售设置 beg-->
                        <div class="form-group">
                            <label class="form-label">预售设置：</label>

                            <div class="form-controls">
                                <label class="checkbox inline">
                                    <input type="checkbox" name="product-type">
                                    预售商品
                                </label>
                            </div>
                        </div>
                        <!--预售设置 end-->
                    </div>
                </div>
                <!--基本信息 end-->

                <div class="product-section">
                    <div class="product-column-tit">
                        <div>库存规格</div>
                    </div>
                    <!--基本信息 beg-->
                    <div class="form-horizontal product-column-con product-basci-info" id="standard">


                    </div>
                </div>
                <div class="product-section">
                    <div class="product-column-tit">
                        <div>商品信息</div>
                    </div>
                    <!--商品信息 beg-->
                    <div class="form-horizontal product-column-con product-basci-info">
                        <div class="form-group">
                            <label class="form-label">商品规格：</label>

                            <div class="form-controls">
                                <!--店铺联系人手机号输入框-->
                                <input type="text" value="" placeholder="请填写商品规格">
                            </div>
                        </div>

                        <div class="form-group error-help">
                            <label class="form-label">价格：</label>

                            <div class="form-controls">
                                <div class="input-group input-group-small">
                                    <div class="input-group-addon">
                                        ￥
                                    </div>
                                    <!--店铺验证码输入框-->
                                    <input class="input-small" type="text" value="0.00" placeholder="商品价格">
                                </div>
                                <input class="ml-10 input-small" type="text" value="" placeholder="原价￥99.00">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">商品图：</label>

                            <div class="form-controls">
                                <ul class="product-img-list fn-clear">
                                    <li class="product-img-con">
                                        <img src="../../assets/img/logo.png">
                                        <a class="del-img">x</a>
                                    </li>
                                    <li>
                                        <a class="link-blue" href="">+加图</a>
                                    </li>
                                </ul>
                                <p class="help-tip">
                                    建议尺寸：640 x 640 像素；您可以拖拽图片调整图片顺序。
                                </p>
                            </div>

                        </div>


                    </div>
                    <!--商品信息信息 end-->
                </div>
                <div class="product-section">
                    <div class="product-column-tit">
                        <div>物流/其他</div>
                    </div>
                    <!--商品信息 beg-->
                    <div class="form-horizontal product-column-con product-basci-info">
                        <div class="form-group">
                            <label class="form-label">运费设置：</label>

                            <div class="form-controls">
                                <label class="radio inline pt-0 mtm-3">
                                    <input checked type="radio" name="product-freight">
                                    统一运费
                                </label>

                                <div class="input-group input-group-small ml-10">
                                    <div class="input-group-addon">
                                        ￥
                                    </div>
                                    <!--店铺验证码输入框-->
                                    <input class="input-small" type="text" value="0.00" placeholder="运费">
                                </div>
                            </div>
                            <div class="form-controls mt-10">
                                <label class="radio inline mtm-3">
                                    <input type="radio" name="product-freight">
                                    运费模版
                                </label>

                                <div class="product-select-tmp">
                                    <select class="select-item select-large ml-10" name="" id="">
                                        <option>运费模版一</option>
                                        <option>运费模版二</option>
                                        <option>运费模版三</option>
                                    </select>

                                    <div class="operate-btn freight-tem-operate ml-10">
                                        <a class="link-blue">刷新</a>
                                        <a class="link-blue">新建</a>
                                        <a class="link-blue" style="border: 0">如何设置合适的运费模版？</a>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="form-group error-help">
                            <label class="form-label">每人限购：</label>

                            <div class="form-controls">
                                <!--店铺联系人手机号输入框-->
                                <input class="input-small  mr-10" type="text" value="0" placeholder="限购数量">
                                0代表不限购
                            </div>
                        </div>
                        <div class="form-group error-help">
                            <label class="form-label">要求留言：</label>

                            <div class="form-controls">
                                <div class="leave-message-area">
                                    <div class="add-message-list">
                                        <div class="add-message-item">
                                            <input class="input-mini  mr-10" type="text" value="留言">
                                            <select class="select-item select-mini" name="" id="">
                                                <option>文本</option>
                                                <option>邮箱</option>
                                                <option>邮箱邮箱</option>
                                            </select>
                                            <label class="checkbox inline pt-0 ml-10">
                                                <input type="checkbox">
                                                多行
                                            </label>
                                            <label class="checkbox inline pt-0 ml-10">
                                                <input type="checkbox" checked>
                                                必填
                                            </label>
                                            <a class="link-blue ml-10">删除</a>
                                        </div>
                                    </div>
                                    <div class="add-message-btn">
                                        <a class="link-blue">+ 添加字段</a>
                                    </div>
                                    <p class="help-tip">单件商品最多可设置10条留言</p>
                                </div>
                                <p class="error-msg">这里是错误信息</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">开售时间：</label>

                            <div class="form-controls">
                                <label class="radio inline pt-0" style="margin-top: 7px">
                                    <input checked type="radio" name="product-selltime">
                                    立即开售
                                </label>
                            </div>
                            <div class="form-controls mt-15">
                                <label class="radio inline">
                                    <input type="radio" name="product-selltime">
                                    定时开售
                                </label>
                                <!--店铺联系人手机号输入框-->
                                <input class="ml-10" type="text" value="" placeholder="开售时间">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--步骤二 end-->
        </div>
    </div>
    <!--切换内容区域 end-->
</div>
<!-- footer begain -->
<div class="con-footer"></div>
<!-- footer end -->

<!-- 右侧主体内容end -->
