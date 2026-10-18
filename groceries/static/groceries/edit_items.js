$(function () {
  // add onClick to open edit modal
  $("#edit-btn").on("click", openCreateModal);
});

function openCreateModal() {
  $("#modal-background").css("display", "flex");  // show modal

  // insert edit template into it
  let $template = $("#edit-template").contents();
  $template.appendTo($("#modal"));
}
