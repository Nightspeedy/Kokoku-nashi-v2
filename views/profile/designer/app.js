/* global ace */
function arrayBufferToBase64 (buffer) {
  var binary = ''
  var bytes = new Uint8Array(buffer)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

const encoder = new TextEncoder()
const cssEditor = ace.edit('css-editor')
cssEditor.session.setUseWorker(false)

const queries = {
  avatar: 'https://cdn.discordapp.com/avatars/215143736114544640/43f2fae1f575156386b3bcd2eee06df5.png',
  level: 17,
  currentXP: 782,
  nextXP: 18 * 200,
  name: 'Leah',
  emojiAlt: '',
  emojiLink: '1f192.png',
  title: 'A mess.',
  description: '👩🏼‍💻 i pretend to know programming.',
  reps: 173,
  credits: 87356,
  backgroundURL: '',
  filters: 'none',
  css: cssEditor.session.getValue()
}

function update () {
  const queryString = encodeURIComponent(arrayBufferToBase64(encoder.encode(JSON.stringify(queries))))
  document.getElementById('preview').src = `http://localhost:8080/profile/card?data=${queryString}`
}

update()

let changeTimeout

cssEditor.session.setMode('ace/mode/css')
cssEditor.session.on('change', () => {
  queries.css = cssEditor.session.getValue()
  clearTimeout(changeTimeout)
  changeTimeout = setTimeout(update, 1500)
})

document.getElementById('bg').oninput = e => {
  queries.backgroundURL = e.target.value
  clearTimeout(changeTimeout)
  changeTimeout = setTimeout(update, 500)
}

document.getElementById('filter').oninput = e => {
  queries.filters = e.target.value
  clearTimeout(changeTimeout)
  changeTimeout = setTimeout(update, 500)
}

document.getElementById('normal').onclick = _ => {
  document.getElementById('bg').value = ''
  queries.backgroundURL = ''
  document.getElementById('filter').value = ''
  queries.filters = ''
  const css = `body {}
.tag {}
.tint {}
.description {}
.desc {}
.progress {}
.progressfill {}`
  cssEditor.session.setValue(css)
  queries.css = css
  update()
}

document.getElementById('dark').onclick = _ => {
  document.getElementById('bg').value = ''
  queries.backgroundURL = ''
  document.getElementById('filter').value = ''
  queries.filters = ''
  const style = `body { color: #eee !important; }
.tag {
    background: #2F3136;
    border: 1px solid #36393F !important;
}
.tint { background: #36393F; }
.description {
    background: #36393F !important;
    border: 1px solid #36393F !important;
}
.desc { color: #bbb !important; }
.blurShadow {
    filter: blur(30px) saturate(200%) !important;
    transform: translateY(6px) !important;
    opacity: 0.2 !important;
}
.progress {
    background: #2F3136 !important;
    border: 1px solid #36393F !important;
}
.progressfill { background: #7589D6 !important; }`
  cssEditor.session.setValue(style)
  queries.css = style
  update()
}

document.getElementById('light').onclick = _ => {
  document.getElementById('bg').value = ''
  queries.backgroundURL = ''
  document.getElementById('filter').value = ''
  queries.filters = ''
  const style = `body { color: #333 !important; }
.tag {
  background: #F3F3F3 !important;
  border: 1px solid #fff !important;
}
.tint {
  background: #fff !important;
}
.description {
  background: #fff !important;
  border: 1px solid #fff !important;
}
.desc {
  color: #555 !important;
}
.progress {
  background: #F3F3F3 !important;
  border: 1px solid #fff !important;
}
.progressfill {
  background: #7589D6 !important;
}`
  cssEditor.session.setValue(style)
  queries.css = style
  update()
}

document.getElementById('blurred').onclick = _ => {
  document.getElementById('bg').value = 'https://www.worldatlas.com/r/w728-h425-c728x425/upload/52/18/7a/untitled-design-447.jpg'
  queries.backgroundURL = 'https://www.worldatlas.com/r/w728-h425-c728x425/upload/52/18/7a/untitled-design-447.jpg'
  document.getElementById('filter').value = 'blur(8px) contrast(25%) brightness(180%)'
  queries.filters = 'blur(8px) contrast(25%) brightness(180%)'
  const style = `.tint { background: rgba(255,255,255,0.2) !important; }
.description { background: rgba(255,255,255,0.8) !important; }`
  cssEditor.session.setValue(style)
  queries.css = style
  update()
}
