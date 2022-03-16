<script>
    import KkumoSearchbar from "./Searchbar.svelte";
    import Time from "svelte-time";
    import KkumoTopbar from "./Topbar.svelte";
    let src =
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
    let src1 =
        "https://testweather.kma.go.kr/w/resources/icon/DY@64/A/Light/DB03_N.png";
</script>

<main>
    <div class="screen">
        <!--상단바-->
        <KkumoTopbar />
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
</main>

<style>
    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
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
    .location {
        font-size: 15px;
        border-bottom: 1px solid rgb(219, 215, 215);
    }

    /*모든 a 태그 밑줄 없애기*/
    a {
        text-decoration: none;
        cursor: pointer;
    }
</style>
