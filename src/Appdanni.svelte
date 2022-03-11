<script>
    import KkumoSearchbar from "./Searchbar.svelte";
    import Time from "svelte-time";
    let name = "world";
    let src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
    let src1 = "https://ssl.gstatic.com/onebox/weather/48/partly_cloudy.png"
</script>

<header>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script crossorigin="anonymous"></script>
</header>

<main>
    <div class="screen">
        <!--상단바-->
        <div class="top">
            <div class="lefticon">
                <a href="" class="login">설정</a>
                <a href="" class="login">밥</a>
            </div>
            <div class="icon">
                <div class="img nav-icon">
                    <div class="icon icon-weather">
                        <span class="weather">
                            <img {src1} alt="danni"/>
                        </span>
                        <span class="weather">H</span>
                        <span class="weather">A</span>
                    </div>
                </div>
                <div class="img nav-icon">

                </div>
            </div>
        </div>
        <!--중간메인-->
        <div class="logo">
            <a href="" class="logo">
                <img {src} alt="danni" />
            </a>
        </div>
        <div class="search">
            <div class="inputZone inputZone-size">
                <div class="inputBox">
                    <i class="fas fa-search" />
                    <input type="text" class="searchInput" />
                    <i class="fas fa-keyboard" />
                    <i class="fas fa-microphone" />
                </div>
            </div>
            <div class="clickBox">
                <input
                    type="button"
                    class="clickBoxBtn one"
                    value="Google 검엄색ㅇㅇ"
                />
                <input type="button" class="clickBoxBtn two" value="ㅇㅇ" />
            </div>
            <div class="blank blank-size" />
            <!--하단-->
            <div class="footer">
                <div class="location">대한민국</div>
            </div>
        </div>
    </div>
    <script src="index.js"></script>
</main>

<style>
    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }

    html,
    body {
        color: black;
        font-family: "Apple SD Gothic Neo", arial, sans-serif;
        font-size: 10px;
    }

    /*---Navigation Bar---*/
    .top {
        display: flex;
        justify-content: space-between;
        height: 100px;
        margin: 4px 11px;
    }

    .lefticon {
        font-size: 13px;
        display: -webkit-box;
        align-items: center;
        justify-content: space-around;
        width: 281px;
    }

    .icon {
        font-size: 13px;
        display: flex;
        align-items: normal;
        justify-content: right;
        width: -webkit-fill-available;
        height: 100px;
        width: 281px;
    }

    .weather{
        font-size: 40px;
    }

    .nav-icon {
        width: 160px;
        color: rgba(0, 0, 0, 0.87);
    }

    .login {
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

    .img {
        margin-right: 15px;
    }

    .fa-th {
        font-size: 16px;
        color: rgb(95, 99, 104);
    }

    .app:hover {
        text-decoration: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        background-color: rgb(236, 236, 236);
    }

    /*---main---*/
    #logo {
        width: 270px;
    }

    .logo,
    .inputZone,
    .clickBox,
    .blank {
        /* border: 1px solid red;*/
        margin-top: 3px;
        display: flex;
        justify-content: center;
    }

    .search {
        display: block;
    }

    .inputZone-size {
        margin: 30px 0px;
    }

    .inputBox {
        border: 1px solid rgb(215, 219, 223);
        width: 560px;
        height: 47px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0px 8px 0px 14px;
        border-radius: 30px;
    }
    .searchInput {
        width: 447px;
        height: 34px;
        border: none;
    }

    .searchInput:focus {
        outline: none;
    }

    .inputBox i {
        font-size: 16px;
        color: rgb(183, 183, 184);
        padding: 0px 10px;
    }

    .inputBox .fa-keyboard,
    .inputBox .fa-microphone {
        color: rgb(99, 99, 105);
        cursor: pointer;
    }
    .inputBox:hover {
        box-shadow: 0px 2px 5px rgb(215, 219, 223);
    }

    .clickBox {
        height: 40px;
        border: 1px;
    }

    .clickBoxBtn {
        cursor: pointer;
        margin: 4px 14px;
        border: 0;
        outline: 0;
        background-color: #f8f9fa;
        color: rgb(50, 50, 54);
        padding: 0px 16px;
    }

    .clickBoxBtn .one {
        width: 77px;
    }

    .clickBoxBtn .two {
        width: 108px;
    }

    .clickBoxBtn:hover {
        border: 1px solid rgb(204, 204, 204);
        border-radius: 4px;
        box-shadow: 0px 0.4px 1px rgb(204, 204, 204);
    }

    .blank-size {
        height: 225px;
    }

    .screen {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    /*---footer---*/
    .footer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
    }

    .location,
    .other {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 52px;
        color: rgb(113, 113, 113);
        padding-left: 30px;
        background-color: rgb(242, 242, 242);
    }

    .location {
        font-size: 15px;
        border-bottom: 1px solid rgb(219, 215, 215);
    }

    .otherDetail {
        font-size: 14px;
        padding: 0;
        margin: 10px 15px 10px 9px;
        color: rgb(113, 113, 113);
    }

    .otherDetail:hover {
        text-decoration: underline;
    }

    .other-left {
        display: flex;
        justify-content: flex-end;
        margin-right: 20px;
    }

    .settingBtn {
        border: 0;
        outline: 0;
        cursor: pointer;
    }

    /*---설정 메뉴바---*/
    .setting-menu {
        border: 1px solid #70757a;
        background-color: #ffffff;
        width: 230px;
        font-size: 14px;
        padding: 0px 15px;
        position: absolute;
        /*top: 50%;
  left: 81%;*/
        bottom: 52px;
        right: 20px;
        z-index: 15;
        display: none;
    }
    /*셋팅클릭하면 나타타는 클래스이름*/
    .settingShowing {
        display: block;
    }

    li {
        list-style: none;
        margin: 21px 0px 21px 0px;
    }

    li a {
        color: rgb(113, 113, 113);
    }

    li:hover {
        cursor: pointer;
        text-decoration: underline;
    }

    /*모든 a 태그 밑줄 없애기*/
    a {
        text-decoration: none;
        cursor: pointer;
    }
</style>
