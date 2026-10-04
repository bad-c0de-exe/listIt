$(document).ready(() => {
  // add onClick to grocery list items to make them toggable
  $("#groceries-list").find("li").on("click", toggleItem);
});

// (un)mark item as already in shopping cart
function toggleItem(e) {
  let $item = $(e.target).detach();
  if ($item[0].classList.contains("active")) {
    $("#groceries-list").append($item);
    $($item).removeClass("active");
    $($item).addClass("finished");
  } else {
    $("#groceries-list").prepend($item);
    $($item).removeClass("finished");
    $($item).addClass("active");
  }
}

export { toggleItem };  // importable by other js modules (i.e. type="module")
