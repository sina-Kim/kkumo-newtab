<script></script>

<div id="KkumoSearchBar">
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
</div>

<style>
    .inputZone{
        /* border: 1px solid red;*/
        margin-top: 3px;
        display: flex;
        justify-content: center;
    }
    .search {
        display: block;
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
</style>