const getType = el => {
  if (!el) {
    return 'null'
    }
  if (Array.isArray(el)) {
    return 'array'
  }

  return typeof el;
}

const getExemple = el => {
  let exemple = ': ';
  const type = getType(el);

  if (type === 'string' &&
      el.length > 60) {
    el = el.slice(0, 60).trim() + '...';
  }

  switch (type) {
    case 'number':
      exemple += Number(el);
    break;

    case 'string':
      exemple += '`' + el + '`';
    break;

    default:
      exemple = ''
  }

  return exemple;
}

const json2md = (obj, layer) => {
  layer = layer || 0;
  obj = getType(obj) === 'string' ? JSON.parse(obj) : obj;

  let
    espace = '    ',
    indent = espace.repeat(layer),
    str = '';
  const params = Object.keys(obj);

  for (let param of params) {
    const
      type = getType(obj[param]),
      exemple = getExemple(obj[param]);

  str += `${indent}- ${param}${exemple} (${type})\n`;

  if (type === 'object') {
    str += json2md(obj[param], layer + 1);
    }

  if (type === 'array' &&
    obj[param].length > 0 &&
    getType(obj[param][0]) === 'object') {
    str += `${indent}${espace}- (object)\n`;
      str += json2md(obj[param][0], layer + 2);
    }
  }

  return str
}

const updateMson = () => {

  const
    cmJson = $('.form-json .CodeMirror')[0].CodeMirror,
    oldContent = cmJson.getValue(),
    newContent = json2md(oldContent);

  localStorage.setItem('json', oldContent);

  var cm = $('.form-mson .CodeMirror')[0].CodeMirror;
  update(cm, newContent);
}

const updateJson = () => {
  const newContent = localStorage.getItem('json');
  var cm = $('.form-json .CodeMirror')[0].CodeMirror;
  update(cm, newContent);
}

const update = (cm, val) => {
  var doc = cm.getDoc();
  var cursor = doc.getCursor(); // gets the line number in the cursor position
  var line = doc.getLine(cursor.line); // get the line contents
  var pos = { // create a new object to avoid mutation of the original selection
      line: 0,
      ch: 0 // set the character position to the end of the line
  }
  doc.setValue(val); // adds a new line
}
