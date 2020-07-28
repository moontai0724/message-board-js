window.addEventListener("load", initialize);
const COLORS = ["primary", "secondary", "success", "warning", "danger", "info"];

function initialize() {
  jQuery("#message-modal").on("show.bs.modal", messageModalInitializer);
  jQuery("#message-modal button[type=submit]").on("click", submitHandler);
  jQuery("#faker").on("click", () => fetchMessageFaker().forEach(message => addMessage(message.id, message.author, message.time, message.content)));
}

function fetchMessageFaker() {
  let messages = [], base = Number(jQuery(".card:first").data("id") ?? 0);

  for (let i = 1; i < 100; i++)
    messages.push({
      id: base + i,
      author: nameGenerator(),
      time: timeGenerator(),
      content: `This is ${i} in 100 messages.`.repeat(Math.round(Math.random() * 20) + 1)
    });

  return messages.sort((a, b) => (new Date(a.time)) - (new Date(b.time)));
}

function addMessage(id, author, time, content) {
  let messages = jQuery("#messages");

  let message = jQuery(jQuery("#message").html());
  message.attr("data-id", id);
  message.find(".author").text(author);
  message.find(".time").attr("data-iso-time", time).text(new Date(time).toLocaleString("zh-TW", { hour12: false }));
  message.find(".content").text(content);
  message.addClass("border-" + COLORS[Math.round(Math.random() * 5)]);
  messages.prepend(message);
}

function editMessage(id, author, time, content) {
  let message = jQuery(`.card[data-id=${id}]`);
  message.find(".author").text(author);
  message.find(".time").text(time);
  message.find(".content").text(content);
}

function removeMessage(id) {
  jQuery(`.card[data-id=${id}]`).remove();
}

function messageModalInitializer(event) {
  let relatedTarget = jQuery(event.relatedTarget);
  let editMode = relatedTarget.hasClass("edit");
  let removeMode = relatedTarget.hasClass("remove");
  console.log(relatedTarget, removeMode);
  jQuery(this).find("h5.modal-title").text("新增留言");
  jQuery(this).find("[name=id]").val("").prop("disabled", removeMode);
  jQuery(this).find("[name=author]").val("").prop("disabled", removeMode);
  jQuery(this).find("[name=content]").val("").prop("disabled", removeMode);
  jQuery(this).find("button[type=submit]").removeClass("btn-danger").text("送出");
  jQuery(this).find(".alert").hide();

  if (removeMode) {
    jQuery(this).find("button[type=submit]").addClass("btn-danger").text("確定刪除");
    jQuery(this).find("h5.modal-title").text("確定要刪除該留言？");
    jQuery(this).find(".alert").show();
  }

  if (editMode) {
    jQuery(this).find("h5.modal-title").text("編輯留言");
    let target = relatedTarget.parents(".card");
    jQuery(this).find("[name=id]").val(target.attr("data-id"));
    jQuery(this).find("[name=author]").val(target.find(".author").text());
    jQuery(this).find("[name=content]").val(target.find(".content").text());
  }

  if (editMode || removeMode) {
    let target = relatedTarget.parents(".card");
    jQuery(this).find("[name=id]").val(target.attr("data-id"));
    jQuery(this).find("[name=author]").val(target.find(".author").text());
    jQuery(this).find("[name=content]").val(target.find(".content").text());
  }
}

function submitHandler(event) {
  let target = jQuery(event.target).parents(".modal");
  target.modal("hide");

  let id = target.find("[name=id]").val();
  if (target.find("button[type=submit]").hasClass("btn-danger")) {
    removeMessage(id);
    return;
  }

  let author = target.find("[name=author]").val();
  let content = target.find("[name=content]").val();
  let time = new Date().toISOString();

  if (id)
    editMessage(id, author, time, content);
  else
    addMessage((jQuery(".card:first").data("id") ?? 0) + 1, author, time, content);
}

function nameGenerator() {
  return Math.random().toString(36).substring(Math.round(Math.random() * 10));
}

function timeGenerator() {
  let random = Math.round(Math.random() * 1000000000000 + 1000000000000);
  return new Date(random).toISOString();
}
