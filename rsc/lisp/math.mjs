import Decimal from './decimal.mjs'

const log = console.log;

const Fact = (n) => {
  if (n.lt(1)) return new Decimal(1);
  const collection = [];
  while (n.gt(0)) {
    collection.push(n);
    n = n.sub(1);
  }
  return collection.reduce((a,b) => a.mul(b), new Decimal(1));
}


const add  = (l) => {
  if (l.length < 1) return ['+ x y z'];
  if (l.length == 1) return l[0];
  return l.reduce((a,b) => a.add(b), new Decimal(0));
}
const sub  = (l) => {
  if (l.length < 1) return ['- x y z'];
  if (l.length == 1) return new Decimal(0).sub(l[0]);
  return l.reduce((a,b) => b.sub(a));
}
const mul  = (l) => {
  if (l.length < 2) return ['* x y z'];
  return l.reduce((a,b) => a.mul(b), new Decimal(1));
}
const div  = (l) => {
  if (l.length < 1) return ['/ x y z'];
  if (l.length == 1) return l[0].pow(-1);
  return l.reduce((a,b) => b.div(a), new Decimal(1));
}
const pow  = (l) => {
  if (l.length < 2) return ['^ x y z'];
  return l.reduce((a,b) => b.pow(a));
}
const mod  = (l) => {
  if (l.length < 2) return ['% x y z'];
  return l.reduce((a,b) => b.mod(a));
}
const fact = (l) => {
  if (l.length != 1) return ['! x'];
  return Fact(l[0]);
}
const root = (l) => {
  if (l.length != 2) return ['root exp val'];
  return l.reduce((a,b) => a.pow(b.pow(-1)));
}
const let1 = (l) => {
  if (l.length != 2) return ['let (x y) (1 2)'];
  let lhs = l[0];
  if (!Array.isArray(lhs)) lhs = [lhs];
  // if (Decimal.isDecimal(l[1])) l[1] = l[1];
  if (!Array.isArray(l[1])) l[1] = [l[1]];
  let rhs = l[1].reverse();
  const rhs_copy = l[1];
  log(lhs, rhs);
  for (let item of lhs)
    {
      vars[item] = rhs.pop();
    }
  return rhs_copy;
}
const what = (l) => {
  if ('v' in l) log(vars);
  return Object.keys(env);
}

const env = {};
env['+'] = add;
env['-'] = sub;
env['*'] = mul;
env['/'] = div;
env['^'] = pow;
env['%'] = mod;
env['!'] = fact;
env['root'] = root;
env['let'] = let1;
env['?'] = what;
env['test'] = l => [l[0],'!',l[1],'!',l[2]];

// const argsize = {};
// argsize['+'] = [];
// argsize['-'] = [];
// argsize['*'] = [];
// argsize['/'] = [];
// argsize['^'] = [];
// argsize['%'] = [];
// argsize['!'] = [];
// argsize['root'] = [];
// argsize['let'] = [true, false];
// argsize['?'] = [true];
// argsize['test'] = [false, true, false];

const vars = {
  'z': 5,
};


// const help = {};
// help[add] = "add: (+ 1 2 3) = (1 + (2 + 3))";
// help[sub] = "subtract: (- 1 2 3) = (1 - (2 - 3))";
// help[mul] = "multiply: (* 1 2 3) = (1 * (2 * 3))";
// help[div] = "divide: (/ 1 2 3) = (1 / (2 / 3))";
// help[pow] = "raise: (^ 1 2 3) = (1 ^ (2 ^ 3))";
// help[mod] = "modulo: (% 5 4) = (5 % 4)";
// help[fact] = "factorial: (! 5) = (5 !)";
// help[root] = "nth root: (root 4 2) = (2nd root of 4)";
// help[let1] = "variables: (let (a b c) (1 2 3)) = (a=1, b=2, c=3)";
// help[what] = "Help";


function lookup(token, environment){
  const result = environment[token];
  return result;
}

function tokenize(code){
  return (code
    .replaceAll('(',' ( ')
    .replaceAll(')',' ) ')
    .split(" ")
    .filter(item => item != "")
    .map(token => {
        try {
          return (new Decimal(token));
        } catch (err) {
          return token;
        }
      }
    )
  );
}

function parse_1(tokens){
  let result = [];
  let token;
  while (tokens.length > 0) {
    token = tokens.pop();
    if (token == '(') 
      result.push(parse_1(tokens))
    else if (token == ')') 
      return result;
    else if (typeof token != 'string')
      result.push(token);
    else {
      result.push(token); //don't lookup in just in case
      // let temp = lookup(token, env);
    }
  }
  return result;
}

function parse(tokens){
  return parse_1(tokens.reverse());
}

function isExempt(name, index){
  if (name === 'none'){
    return false;
  }
  log('status:',argsize[name]);
  indicators = argsize[name][index];
  if (indicators == undefined)
    return false;
  return true;
}

function execute_1(prog)
  {
    let res, pred, name, args;
    res  = [];
    args = [];
    pred = undefined;
    name = undefined;

    while (prog.length > 0)
      {
        const bit  = prog.pop();
        const type = typeof bit;

        if ( Array.isArray(bit) )
          {
            args.push(execute_1(bit));
          }
        else
          {
            args.push(bit);
          }
      }
    for (let chunk of args)
      {
        const type = typeof chunk;
        let tmp = undefined;
        if (type === 'string')
          {
            const fun_value = lookup(chunk, env );
            const var_value = lookup(chunk, vars);
            
            const isValidFun = fun_value !== undefined;
            const isValidVar = var_value !== undefined;

            if (var_value !== undefined)
              {
                tmp = var_value;
              }
            else if (fun_value !== undefined)
              {
                tmp = fun_value;
                pred = tmp;
                name = chunk;
              }
            else
              {
                tmp = chunk;
              }
            chunk = tmp;
          }
      }
    if (args.length < 1) return res;

    if (pred !== undefined)
      {
        args.pop();
        res.push(pred(args.reverse()));
      }
    else
      {
        res.push(...args);
      }
    return res;
  }

function execute_2(program){
  let result = [];
  let predicate = undefined;
  let name = "none";
  let args = [];
  const maxl = program.length;
  while (program.length > 0){
    let bit = program.pop();
    if (typeof bit === 'string' && program.length == 0) {
      const tmp = lookup(bit, env);
      if (tmp !== undefined){
        predicate = tmp;
        name = bit;
        continue;
      }
    }
    if (typeof bit === 'string') {
      const arg_index = program.length;
      if (isExempt(name, arg_index)){
        args.unshift(bit);
        continue;
      }
      // log(`is ${bit} exempt?: ${isExempt(name, arg_index)}`);
      const tmp = lookup(bit, vars);
      if (tmp != undefined) args.push(tmp);
      else args.push(bit);
      // log(`return value: ${args[args.length - 1]}`);
    }
    else if (Array.isArray(bit)) {
      args.push(execute_1(bit));
    }
    else if (Decimal.isDecimal(bit) || typeof bit == 'string') {
      args.push(bit);
    }
    else {
      log('unexpected:',bit,'typeof:',`${typeof(bit)}`);
      continue;
    }
  }
  if (predicate !== undefined && typeof predicate == 'function') {
    const temp = predicate(args);
    if (temp.length == 1) result.push(temp[0]); else result.push(temp);
  } else {
    if (args.length == 1) result.push(args[0]); else result.push(args.reverse());
  }
  
  if (result.length == 1) {
    return result[0];
  } else {
    return result;
  }
}

function execute(program){
  try {
    const tmp = execute_1(program);
    if (tmp.length == 1) return tmp[0]; else return tmp;
  } catch (err) {
    throw err;
  }
}

function test(sample,expected,name="test",callback=undefined,verbose=false){
  function log2(...args){
    if (verbose) {
      console.log(...args);
    } else {
      return;
    }
  }
  log2(`INPUT:\n ${sample}`);
  const tokens = tokenize(sample);
  log2(`TOKENS:\n ${tokens}`);
  const parsed_tokens = parse(tokens);
  log2(`PROGRAM:\n ${parsed_tokens}`);
  const executed_program = execute(parsed_tokens);
  log2(`RESULT:\n ${executed_program}`);
  
  let failFunc = callback || ((...args) => {
    try {
      return !executed_program.equals(expected)
    } catch (err) {
      try {
        return !(executed_program === expected)
      } catch (err2) {
        log('--truly not equal,'`${err2}`);
        return true;
      }
      log('--failed with error',`${err}`);
      return true;
    }
    return true;
  });
  const shouldFail = failFunc(expected, executed_program);

  if (shouldFail) {
    log(`--[ FAIL ] ${name}`);
    log(`    expected type ${expected.constructor.name} with value ${expected}`);
    log(`    recieved type ${executed_program.constructor.name} with value ${executed_program}`);
  } else {
    log(`[ PASS ] ${name}`)
  }
}


function testAll(){
  // 39 working tests!!
  test('(+ 1 2)', new Decimal(3),   'Simple Addition 1')
  test('(+ 2 1)', new Decimal(3),   'Simple Addition 2')
  test('(+ 1 2 3)', new Decimal(6), 'Long Addition 1')
  test('(+ 3 1 2)', new Decimal(6), 'Long Addition 2')
  test('(+ 1)', new Decimal(1),     'Short Addition 1')
  test('(+ -1)', new Decimal(-1),     'Short Addition 2')
  test('(- 5 4)', new Decimal(1), 'Simple Subtraction 1')
  test('(- 4 5)', new Decimal(-1), 'Simple Subtraction 2')
  test('(- 5 2 1)', new Decimal(4), 'Long Subtraction 1')
  test('(- 5 4 2)', new Decimal(3), 'Long Subtraction 2')
  test('(- 1)', new Decimal(-1), 'Short Subtraction 1')
  test('(- -1)', new Decimal(1), 'Short Subtraction 2')
  test('(* 5 4)', new Decimal(20), 'Simple Multiplicaton 1')
  test('(* 4 5)', new Decimal(20), 'Simple Multiplication 2')
  test('(* 1 2 3 4 5)', new Decimal(120), 'Long Multiplication 1')
  test('(* 5 1 2 3 4)', new Decimal(120), 'Long Multiplication 2')
  test('(* 5)', new Decimal(5), 'Short Multiplication 1')
  test('(* 7)', new Decimal(7), 'Short Multiplication 2')
  test('(/ 5 4)', new Decimal(1.25), 'Simple Division 1')
  test('(/ 2 1)', new Decimal(2   ), 'Simple Division 2')
  test('(/ 5 4 3 2)', new Decimal(1.875), 'Long Division 1')
  test('(/ 1 2 3 4)', new Decimal(0.375), 'Long Division 2')
  test('(/ 5)', new Decimal(0.2), 'Short Division 1')
  test('(/ 2)', new Decimal(0.5), 'Short Division 2')
  test('(^ 2 3)', new Decimal(8) , 'Simple Exp 1')
  test('(^ 5 2)', new Decimal(25), 'Simple Exp 2')
  test('(^ 1 2 3)', new Decimal(1), 'Long Exp 1')
  test('(^ 3 2 2)', new Decimal(81), 'Long Exp 2')
  test('(! 5)', new Decimal(120), 'Fact 1')
  test('(! -1)', new Decimal(1), 'Fact 2')
  test('(% 4 3)', new Decimal(1), 'Mod 1')
  test('(% 3 4)', new Decimal(3), 'Mod 2')
  test('(% 5 -1)', new Decimal(0), 'Mod 3')
  test('(% -4 3)', new Decimal(-1), 'Mod 4')
  test('(root 2 4)', new Decimal(2), 'Root 1')
  test('(root 1 369)', new Decimal(369), 'Root 2')
  test('(root 3 (+ 4 4))', new Decimal(2), 'Root 3')
  test('(1 2 3)', [new Decimal(1), new Decimal(2), new Decimal(3)], 'Temp 1', (expected, executed)=>expected.every(element => executed.includes(element)));
  test('()',[],'Temp 2',(exp, fnd) => !exp.every(e=>fnd.includes(e)));
}

/*
[x]  '+'   
[x]  '-'   
[x]  '*'   
[x]  '/'   
[x]  '^'   
[x]  '!'   
[x]  '%'   
[x]  'root'
[x]  just numbers
[x]  <nothing>
*/

function run(program){
  try {
    const tokens = tokenize(program);
    // log(tokens);
    const parsed = parse(tokens);
    // log(parsed);
    const executed = execute(parsed);
    // log(executed);
    return executed;
  } catch (err) {
    console.log(err);
  }
}

export {run};
