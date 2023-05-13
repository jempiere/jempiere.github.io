import {run} from '../lisp/math2.mjs'

document.getElementById('search').addEventListener('keydown',e => {
  if (e.keyCode == 13){
    const prompt = e.target.value;
    const url_formatted = encodeURIComponent(prompt);
    const prefix = "https://duckduckgo.com/?q=";
    window.location.href = `${prefix}${url_formatted}`;
  }
});

const store = {
  history: [],
  count: 0,
  add : function (v) {
    this.history = this.history.filter(v => v !== undefined);
    this.count ++;
    if (this.count > (this.history.length)) this.count = this.history.length;
    // console.log(this.count);
    this.history.push(v);
  },
  down : function () {
    this.history = this.history.filter(v => v !== undefined);
    this.count ++;
    if (this.count > (this.history.length)) this.count = this.history.length;
    // console.log(this.count);
    const res = this.history[this.count];
    if (res === undefined) return '';
    return res;
  },
  up   : function () {
    this.history = this.history.filter(v => v !== undefined);
    this.count --;
    if (this.count < 0) this.count = 0;
    // console.log(this.count);
    return this.history[this.count];
  },
}

// let history = ['()'];
// let position = 0;

document.getElementById('math').addEventListener('keydown',e => {
  if (e.keyCode == 13){
    const program = e.target.value;
    let result = run(program);
    if (result === undefined) result = '';

    let v = `${result}`.replaceAll('[','(').replaceAll(']',')').replaceAll(',',' ');

    e.target.value = `(${v})`;

    store.add(program);
    e.target.placeholder = e.target.value;
  }
  if (e.keyCode == 38){ //up arrow
    e.target.value = store.up();
  }
  if (e.keyCode == 40){ //down arrow
    // position += 1;
    e.target.value = store.down();
  }
  // console.log(e.keyCode);
});
