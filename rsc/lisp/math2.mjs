import Decimal from './decimal.mjs'

const log = (...a) => {return;};
const callable = (v) => (typeof v === 'function');
const len = (v) => v.length;
const isString = (v) => (typeof v === 'string');
const isArray  = (v) => (Array.isArray(v));
const isDecimal = (v) => (Decimal.isDecimal(v));
const isDefined = (v) => (v !== undefined);

/*
  FUNCTIONS FOR USE
*/
const add = v => {
  if (len(v) < 1) return ('(? +)');
  return v.reduce((a,b) => a.add(b), new Decimal(0));
}
const sub = v => {
  if (len(v) <  1) return ('(? -)');
  if (len(v) == 2) return v[0].sub(v[1]);
  if (len(v) == 1) return new Decimal(0).sub(v[0]);
  return v.reduce((a,b) => b.sub(a), new Decimal(0));
}
const mul = v => {
  if (len(v) < 2) return ('(? *)');
  return v.reduce((a,b) => a.mul(b), new Decimal(1));
}
const div = v => {
  if (len(v) < 1) return ('(? /)');
  if (len(v) == 1) return v[0].pow(-1);
  if (len(v) == 2) return v[0].div(v[1]);
  return v.reduce((a,b) => b.div(a), new Decimal(1));
}
const pow = v => {
  if (len(v) < 2) return ('(? ^)');
  if (len(v) == 2) return v[0].pow(v[1]);
  return v.reduce((a,b) => a.pow(b));
}

const mod = v => {
  if (len(v) < 2) return ('(? %)');
  return v.reduce((a,b) => a.mod(b));
}

/*
  EOF FOR USE
*/

let vars = {
  
};

let help = {
  '+': '(+ 1 2 3) -> (1 + (2 + 3))',
  '-': '(- 1 2 3) -> (1 - (2 - 3))',
  '*': '(* 1 2 3) -> (1 * (2 * 3))',
  '/': '(/ 1 2 3) -> (1 / (2 / 3))',
  '^': '(^ 1 2 3) -> (1 ^ (2 ^ 3))',
  '%': '(% 1 2 3) -> (1 % (2 % 3))',
  '.': '(. a b c) -> (a b c)',
};

let env  = {
  '+'  : add,
  '-'  : sub,
  '*'  : mul,
  '/'  : div,
  '^'  : pow,
  '%'  : mod,
  '.'  : v => `${v}`.replaceAll('[','(').replaceAll(']',')').replaceAll(',',' '),
  '?'  : v => {
    if (len(v) == 0) return Object.keys(vars).sort().map(k => [k,vars[k]]);
    let tmp = help[v[0]];
    if (!isDefined(tmp)) return ['Unknown Op:',v[0]]
    return tmp;
  },
  'let': v => {
      if (len(v) != 2) return ['let (x y) (1 2)'];
      if (!isArray(v[0])) v[0] = [v[0]];
      if (!isArray(v[1])) v[1] = [v[1]];
      
      const backup = v[1].slice();
      for (let val of v[0])
        vars[val] = v[1].shift();
      
      return backup;
    }
};



let exempt = {
  'let': [true, false],
  '?': [true],
};

function findExemptions(name){
  let res = exempt[name];
  if (!isDefined(res)) return [];
  return res;
}



function tokens(prog){
  return (
    prog.
      replaceAll('(',' ( ').
      replaceAll(')',' ) ').
      split(" ").
      filter(e => e != "").
      map(tok => {
        try { return new Decimal(tok); } catch (e) { return tok };
      }));
}

function parse(toks){
  let res = [];
  while (len(toks) > 0){
    const tok = toks.pop();
    if (tok == '(') res.push(parse(toks));
    else if (tok == ')') return res;
    else res.push(tok);
  }
  return res;
}

const substitute = (a,b,c) => {
  let res = c;
  if (isDefined(b)) res = b;
  else if (isDefined(a)) res = a;
  return res;
}

function exec(prog){
  let result = [];
  let car = undefined;
  let cdr = [];
  while (len(prog) > 0) {
    let v = prog.pop();
    
    if (isArray(v))
      cdr.push(exec(v));
    else
      cdr.push(v);
  }
  cdr = cdr.reverse();
  if (cdr.length == 0) return [];
  
  car = cdr.shift();
  let exemptions = findExemptions(car);
  // log('exemptions on',car,':',exemptions);
  let cdr2 = [];
  for (const idx in cdr){
    let arg = cdr[idx];
    if (exemptions[idx] === true){
      cdr2.push(arg);
      continue;
    }
    if (isString(arg)) {
      let variable = substitute(env[arg], vars[arg], arg);
      cdr2.push(variable);
      continue;
    }
    cdr2.push(arg);
    continue;
  }
  let car2 = substitute(env[car], vars[car], car);
  
  if (callable(car2)) {
    result.push(car2(cdr2));
  } else {
    result.push(car2,...cdr2);
  }
  return result;
}





function run(program){
  try {
    const toks = tokens(program);
    let pars = parse(toks.reverse());
    if (len(pars) == 1) pars = pars[0];
    const exed = exec(pars);
    log('exed:',exed);
    return exed;
  } catch (err) {
    log(err);
  }
}

log('\x1Bc')

export { run };


// run('(let x 1)');
// run('(?)');

//run('(+ 1 2 3)');
//run('(- 1 2 3)');
//run('(* 1 2 3)');
//run('(/ 1 2 3)');
//run('(^ 3 2 1)');
//run('(% 3 2 1)');
//run('(. a b c)');

// run('(+ 2 1)');
// run('(let x 4)');
// run('(?)');
// run('(+ x x)');
// run('(let x 5)');
// run('(?)');
// run('(+ x x)');
// run('(let y 4)');
// run('(?)');
// run('(+ x y)');
// run('(let y x)');
// run('(?)');
// run('(+ y x)');

