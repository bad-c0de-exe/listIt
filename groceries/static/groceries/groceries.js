const GROCERIES_LIST_EL_ID = "#groceries-list";

$(document).ready(() => {
  loadGroceriesList();
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

// create the grocery item elements for given [items]
function createItemElements(items) {
  let $itemTemplate = $("#item-template");

  for (const item of items) {
    let $item = $itemTemplate.contents().clone();
    $item.find("li").attr("x-obj-id", item.id);
    $item.find("p").text(item.name);
    $item.on("click", toggleItem);
    $item.appendTo($(GROCERIES_LIST_EL_ID));

    let $deleteBtn = $item.find(".delete-icon-btn");
    let urlTemplate = $deleteBtn.attr("x-url");
    const url = urlTemplate.replace(
      $deleteBtn.attr("x-pkPlaceholder"),
      item.id,
    );
    $deleteBtn.attr("x-url", url).on("click", removeItemFromList);
  }
}

function renderGroceriesList(items) {
  $(GROCERIES_LIST_EL_ID).empty();
  createItemElements(items);
}

// load and render the grocery's list items
function loadGroceriesList() {
  $.ajax({
    type: "GET",
    url: $(GROCERIES_LIST_EL_ID).attr("x-url"), 
    success: (items) => {
      renderGroceriesList(items);
    },
  });  
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
      renderGroceriesList(items);
    },
  });
}

function removeItemFromList(e) {
  e.stopPropagation(); // prevent delete event to bubble up

  $.ajax({
    type: "POST",
    // currentTarget gets the element where event handler is attached
    url: $(e.currentTarget).attr("x-url"), 
    success: (items) => {
      renderGroceriesList(items);
    },
  });
}

export { toggleItem, createItemElements }; // importable by other js modules (i.e. type="module")
