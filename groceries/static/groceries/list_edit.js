function openListEdit() {
    // show modal
    $("#modal-background").css("display", "flex"); // TODO: .show()
    // copy edit template into it
    let $template = $("#edit-template").contents();
    $template.attr("id", "edit");
    $template.appendTo($("#modal"));
    // attach onInput event handler to the input field
    $template.find("#edit-input").on("input", getGroceries);
}

function getGroceries(e) {
    let $input = $(e.target);
    $itemContainer = $("#item-options");

    $itemContainer.empty(); // rm currently rendered item buttons
    if ($input.val() === "") { return; } // no data -> no request

    $.ajax({
        type: "GET",
        url: $input.attr("x-url"),
        // param-name must align to expected one from SearchFilter class in viewset: "search"
        data: {search: $input.val().trim()},
        success: (data) => { // create items buttons from data
            for (const item of data) {
                $itemButton = $(`<button>${item.name}</button>`)
                    .on("click", e => setItemOnList(e, item));
                $itemContainer.append($itemButton);
            };
        }
    });
}

function setItemOnList(e, item) {
    let $input = $("#select_item_url")
    const urlTemplate = $input.val()
    $.ajax({
        type: "POST",
        url: urlTemplate.replace($input.attr("x-pkPlaceholder"), item.id),
        // param-name must align to expected one from SearchFilter class in viewset: "search"
        // data: {"item": item.id},
        success: (data) => { // create items buttons from data
            for (item of data) {
                $itemButton = $(`<button>${item.name}</button>`) //TODO: .click()
                $itemContainer.append($itemButton);
            };
        }
    });
}
