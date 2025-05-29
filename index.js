import { printNum } from './exported.js';

const importedObj = {
    my_namespace: {
        imported_func: printNum
    }
}

// 串流
// WebAssembly.instantiateStreaming(fetch('./wasm/simple.wasm'), importedObj).then(obj => {
//     // 调用导出的函数
//     obj.instance.exports.exported_func()
// })

// 非串流
fetch('./wasm/simple.wasm')
    // 转为 ArrayBuffer
    .then(res => res.arrayBuffer())
    // 实例化
    .then(buffer => WebAssembly.instantiate(buffer, importedObj))
    // 调用导出的函数
    .then(obj => obj.instance.exports.exported_func())


// 内存 Memory
const memory = new WebAssembly.Memory({
    initial: 10,
    maximum: 100,
    shared: false
})
const dataView = new DataView(memory.buffer);
dataView.setInt32(0, 42, true);
console.log(dataView.getInt32(0, true));
console.log(memory.buffer.byteLength);

// 扩展内存
memory.grow(1);
console.log(memory.buffer.byteLength);


// 向wasm传参
WebAssembly.instantiateStreaming(fetch('./wasm/memory.wasm'), {
    js: {
        mem: memory
    }
}).then(obj => {
    const dataView = new DataView(memory.buffer);
    for (let i = 0; i < 2; i++) {
        dataView.setUint32(i * 4, i, true);
    }
    const res = obj.instance.exports.accumulate(0, 2);
    console.log('accumulate num:', res);
})


// 表格
WebAssembly.instantiateStreaming(fetch('./wasm/table.wasm')).then(obj => {
    const tbl = obj.instance.exports.tbl;
    console.log(tbl.get(0)());
    console.log(tbl.get(1)());
})

// 自己写一个简单的wat文件，实现传入什么打印什么
const mem = new WebAssembly.Memory({
    initial: 10,
    maximum: 100,
})
WebAssembly.instantiateStreaming(fetch('./wasm/print.wasm'), {
    funcs: {
        print: (num) => {
            console.log(String.fromCharCode(num));
        }
    },
    memory: {
        memory: mem
    }
}).then(obj => {
    // 写入数据到内存
    const dataView = new DataView(mem.buffer);
    const str = 'hello world';
    for (let i = 0; i < str.length; i++) {
        dataView.setUint32(i * 4, str.charCodeAt(i), true);
    }
    obj.instance.exports.print_str(str.length * 4);
})

// 使用call_indirect指令
WebAssembly.instantiateStreaming(fetch('./wasm/useTable.wasm')).then(obj => {
    const call_fn = obj.instance.exports.call_fn;
    console.log(call_fn(1, 4, 10));
})

// 验证内建方法
const compileOptions = {
    builtins: ["js-string"],
    importedStringConstants: "string_constants"
};

fetch("./wasm/builtin.wasm")
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.validate(bytes, compileOptions))
    .then((result) => console.log(`Builtins available: ${!result}`));

// 调用内建方法concat
fetch("./wasm/log-concat.wasm")
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes, {
        m: {
            log: console.log,
        }
    }, compileOptions))
    .then((module) => module.instance.exports.main());