(module 
    (type $fn_type (func (param i32 i32) (result i32)))
    (func $add (param $a i32) (param $b i32) (result i32)
        (i32.add (local.get $a) (local.get $b))
    )
    (func $sub (param $a i32) (param $b i32) (result i32)
        (i32.sub (local.get $a) (local.get $b))
    )
    (func $mul (param $a i32) (param $b i32) (result i32)
        (i32.mul (local.get $a) (local.get $b))
    )
    (func $div (param $a i32) (param $b i32) (result i32)
        (i32.div_s (local.get $a) (local.get $b))
    )
    (table $tbl 4 funcref)
    (elem $tbl (i32.const 0) $add $mul $sub $div)
    (func (export "call_fn") (param $fn_idx i32) (param $a i32) (param $b i32) (result i32)
        local.get $a
        local.get $b
        local.get $fn_idx
        call_indirect (type $fn_type)
    )
)