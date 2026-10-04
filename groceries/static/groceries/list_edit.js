import { toggleItem } from "./groceries.js";


$(function() {
    // add onClick to open edit modal to edit button
    $("#edit-btn").on("click", openListEdit)
});


function openListEdit() {
  // show modal
  $("#modal-background").css("display", "flex"); // TODO: .show()
  // copy edit template into it
  let $template = $("#edit-template").contents();
  $template.attr("id", "edit");
  $template.appendTo($("#modal"));
  // attach onInput event handler to the input field
  $template.find("#edit-input").on("input", getGroceries).focus();
}

function getGroceries(e) {
  let $input = $(e.target);
  let $itemContainer = $("#item-options");

  $itemContainer.empty(); // rm currently rendered item buttons
  if ($input.val() === "") {
    return;
  } // no data -> no request

  $.ajax({
    type: "GET",
    url: $input.attr("x-url"),
    // param-name must align to expected one from SearchFilter class in viewset: "search"
    data: { search: $input.val().trim() },
    success: (items) => {
      // create items buttons from data
      for (const item of items) {
        let $itemButton = $(
          `<button class="selectableOption">${item.name}</button>`,
        ).on("touchend", (e) => setItemOnList(e, item));
        $itemContainer.append($itemButton);
      }
    },
  });
}

function setItemOnList(e, item) {
  let $input = $("#select_item_url");
  let urlTemplate = $input.val();
  $.ajax({
    type: "POST",
    url: urlTemplate.replace($input.attr("x-pkPlaceholder"), item.id),
    success: (item) => {
      clearSelection();
      // add selected item element to groceries list
      $("#groceries-list").append(
        $(`<li href="/" class="active">${item.name}</li>`).on("click", toggleItem),
      );
      $("#edit-input").focus();
    },
  });
}

function clearSelection() {
  $("#edit-input").val("");
  $("#item-options").empty();
}

// function renderGroceriesList() {
//     $groceriesList = $("#groceries-list");
//     $.ajax({
//         type: "GET",
//         url: $("#get_listed_groceries_url").val(),
//         success: (items) => {
//             // re-populate groceries list
//             $groceriesList.empty();
//             items.forEach(item => {
//                 $groceriesList.append($(`<li href="/" class="active">${item.name}</li>`))
//             });
//         }
//     });
// }
