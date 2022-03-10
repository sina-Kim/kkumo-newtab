<script>
</script>

<div class="top-menu-bar">
    <div class="settings-icon" />
    <div class="meal-icon" />
    <div class="time-icon" />
    <div class="weather-icon" />
</div>

<div class="loggo" />

<div class="search-bar" />

<div class="grid-bar" />

<div class="card-bar" />

<style>
    .top-menu-bar {
        flex-shrink: 0;
        box-sizing: border-box;
        height: 60px;
        display: flex;
        align-items: center;
        padding: 6px;
        background-color: aqua;
    }
    .loggo {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 92px;
        max-height: 290px;
        height: calc(100% - 560px);
        background-color: blueviolet;
    }
    .search-bar {
        padding: 20px;
        min-height: 14px;
        max-height: 60px;
        flex-shrink: 0;
        box-sizing: border-box;
        background-color: bisque;
    }
    .grid-bar {
        padding: 0 20px;
        max-height: 160px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        background-color: coral;
    }
    .card-bar {
        text-align: center;
        display: block;
        background-color: crimson;
    }
    div {
        display: block;
    }
    .top-menu-bar {
        height: 60px;
    }
</style>
