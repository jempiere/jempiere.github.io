<span id="overlay">_</span>
<div id="editor" contenteditable="true" placeholder="..."></div>

<script>
  function insertAtCaret(element, text) {
    var txtarea = element
    var scrollPos = txtarea.scrollTop;
    var caretPos = txtarea.selectionStart;
    var front = (txtarea.value).substring(0, caretPos);
    var back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
    txtarea.value = front + text + back;
    caretPos = caretPos + text.length;
    txtarea.selectionStart = caretPos;
    txtarea.selectionEnd = caretPos;
    txtarea.focus();
    txtarea.scrollTop = scrollPos;
  }

  let v;
  let item = document.getElementById("editor");
  try{
    v = localStorage.getItem("editor_text");
    item.value = v;
  } catch (err) {
    localStorage.setItem("editor_text","");
  }
  item.addEventListener("keydown",(e)=>{
    e.stopImmediatePropagation();
    if (e.keyCode == 9){
      e.preventDefault();
      insertAtCaret(item, "  ")
    }
  })
  item.addEventListener("keyup",(e)=>{
    localStorage.setItem("editor_text",item.value);
  });
</script>
