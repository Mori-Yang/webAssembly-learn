(module
    (import "funcs" "print" (func $print (param i32)))
    (import "memory" (memory $mem 1))
    (func $print_str (param $len i32)
        (local $i i32)
        (loop $loop
            ;; 从内存中读取字符
            (i32.load (local.get $i))
            ;; 调用打印函数
            call $print
            ;; i++
            (local.set $i 
                (i32.add (local.get $i) (i32.const 4))
            )
            ;; 如果i < $len 则继续循环
            (i32.lt_s (local.get $i) (local.get $len))
            br_if $loop
        )
    )
    (export "print_str" (func $print_str))
)