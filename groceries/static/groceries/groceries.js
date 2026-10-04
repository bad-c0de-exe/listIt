const GROCERIES_LIST_EL_ID = "#groceries-list";

$(document).ready(() => {
  // add onClick to grocery list items to make them toggable
  $(GROCERIES_LIST_EL_ID).find("li").on("click", toggleItem);
  // add onClick to check btn that finishes a shopping trip
  $("#finish-btn").on("click", removeGrabbedItems);
});

// (un)mark item as already in shopping cart
function toggleItem(e) {
  let $item = $(e.target).detach();
  if ($item[0].classList.contains("active")) {
    $(GROCERIES_LIST_EL_ID).append($item);
    $($item).removeClass("active");
    $($item).addClass("finished");
  } else {
    $(GROCERIES_LIST_EL_ID).prepend($item);
    $($item).removeClass("finished");
    $($item).addClass("active");
  }
}

function createItemElements(items) {
  for (const item of items) {
    $(GROCERIES_LIST_EL_ID).append(
      $(
        `<li href="/" class="active" x-id=${item.id}>${item.name}</li>`,
      ).on("click", toggleItem),
    );
  }
}

// remove items from the groceries list that are already in the cart
function removeGrabbedItems() {
  // $(GROCERIES_LIST_EL_ID).find("li").not(".active").remove();
  let $inactiveGroceries = $(GROCERIES_LIST_EL_ID).find("li.finished");
  const ids = $inactiveGroceries
    .map(function () {
      return this.getAttribute("x-id");
    })
    .get();
  $.ajax({
    type: "POST",
    url: $("#finish-cart-url").val(),
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({ items: ids }),
    traditional: true,
    success: (items) => {
      // re-render list content
      $(GROCERIES_LIST_EL_ID).empty();
      createItemElements(items); // create items buttons from data
    },
  });
}

export { toggleItem, createItemElements }; // importable by other js modules (i.e. type="module")
