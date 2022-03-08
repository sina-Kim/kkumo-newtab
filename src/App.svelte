<script>
  let name = "world";
</script>

<header>
  <div class="flex-container">
    <div
      style="width: 50px; height: 50px; border: 1px solid;"
      class="flex-item"
    />
    <div
      style="width: 50px; height: 50px; border: 1px solid;"
      class="flex-item"
    />
    <div class="flex-right-item" />
    <div
      style="width: 50px; height: 50px; border: 1px solid;"
      class="flex-item"
    />
    <div
      style="width: 50px; height: 50px; border: 1px solid;"
      class="flex-item"
    />
  </div>
</header>
<main />
<footer>footer</footer>

<style>
  /* flex: https://d2.naver.com/helloworld/8540176#ch4 */
  header {
    min-height: 20px;
    background-color: antiquewhite;
  }

  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    min-height: 20px;
    background-color: antiquewhite;
  }

  .flex-container {
    display: flex;
  }

  .flex-item {
    background-color: aqua;
    flex: none;
  }

  .flex-right-item {
    background-color: aqua;
    margin-left: auto;
  }
</style>
