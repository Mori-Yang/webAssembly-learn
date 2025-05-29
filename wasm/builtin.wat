(module
  (func (import "wasm:js-string" "cast") (param externref) (result externref))
  (func $concat (import "wasm:js-string" "concat") (param externref externref) (result externref))
  (func (export "do_concat") (param $a externref) (param $b externref) (result externref)
    local.get $a
    local.get $b
    call $concat
  )
)
