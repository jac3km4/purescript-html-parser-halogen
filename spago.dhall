{ name = "html-parser-halogen"
, dependencies =
  [ "arrays"
  , "bifunctors"
  , "control"
  , "dom-indexed"
  , "either"
  , "lists"
  , "strings"
  , "halogen"
  , "prelude"
  , "string-parsers"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
