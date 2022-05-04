{ name = "html-parser-halogen"
, dependencies =
  [ "arrays"
  , "control"
  , "dom-indexed"
  , "halogen"
  , "maybe"
  , "prelude"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
