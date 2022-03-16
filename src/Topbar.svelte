<script>
</script>

<div id="KkumoTopbar">
    <div class="top">
        <div class="left-icon">
            <a href="" class="top-button">설정</a>
            <a href="" class="top-button">밥</a>
        </div>
        <div class="right-icon">
            <div class="img nav-icon">
                <div class="right_icon">
                    <span class="weather">
                        <!--<img {src1} alt="danni"/>-->
                    </span>
                    <span class="weather">09:23</span>
                    <div>03월 05일 토요일</div>
                </div>
            </div>
            <div class="img nav-icon">
                <span class="weather">℃</span>
                <span class="weather">23</span>
                <div>Gumi</div>
            </div>
        </div>
    </div>
</div>

<style>

    .top {
        display: flex;
        justify-content: space-between;
        height: 100px;
        margin: 4px 11px;
    }

    .top-button {
        width: 96px;
        height: 36px;
        font-size:40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
        background: #1a73e8;
        color: #fff;
        font-weight: 500;
        font-size: 14px;
        letter-spacing: 0.25px;
        line-height: 16px;
        border-radius: 4px;
        margin: 0px 8px;
    }

    .left-icon {
        font-size: 13px;
        display: -webkit-box;
        align-items: center;
        justify-content: space-around;
        width: 281px;
    }

    .right-icon {
        font-size: 13px;
        display: flex;
        align-items: normal;
        justify-content: right;
        width: -webkit-fill-available;
        height: 100px;
        width: 281px;
    }

    .weather{
        font-size: 30px;
    }

    .nav-icon {
        width: 160px;
        color: rgba(0, 0, 0, 0.87);
    }

    .img {
        margin-right: 15px;
        direction: rtl;
    }

</style>