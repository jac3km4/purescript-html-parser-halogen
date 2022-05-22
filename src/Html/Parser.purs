module Html.Parser
  ( HtmlNode(..)
  , Element(..)
  , HtmlAttribute(..)
  , parse
  ) where

import Prelude

import Data.Either (Either(..))

data HtmlNode
  = HtmlElement Element
  | HtmlText String
  | HtmlComment String

derive instance eqHtmlNode :: Eq HtmlNode

type Element =
  { name :: String
  , attributes :: Array HtmlAttribute
  , children :: Array HtmlNode
  }

data HtmlAttribute = HtmlAttribute String String

derive instance eqHtmlAttribute :: Eq HtmlAttribute

foreign import parseFromString
  :: (Element -> HtmlNode)
  -> (String -> String -> HtmlAttribute)
  -> (String -> HtmlNode)
  -> (String -> HtmlNode)
  -> (String -> Either String HtmlNode)
  -> (HtmlNode -> Either String HtmlNode)
  -> String
  -> Either String (Array HtmlNode)

parse :: String -> Either String (Array HtmlNode)
parse input =
  parseFromString HtmlElement HtmlAttribute HtmlText HtmlComment Left Right input
