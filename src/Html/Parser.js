function getAttributes(node) {
  var entries = [];
  for (var i = 0; i < node.attributes.length; i++) {
    let { name, value } = node.attributes.item(i);
    entries.push([name, value]);
  }
  return entries;
}

function walk(treeWalker) {
  var nodes = [];

  function handleNode(node) {
    if (["#comment", "#text"].includes(node.nodeName)) {
      var text = node.textContent;
      if (text) {
        nodes.push({
          type: node.nodeName.slice(1),
          text
        });
      }
    } else {
      var children = walk(treeWalker);
      treeWalker.currentNode = node;
      nodes.push({
        type: "element",
        name: node.localName,
        attributes: getAttributes(node),
        children
      });
    }
  }

  var currentNode = treeWalker.currentNode;
  var firstChild = treeWalker.firstChild();
  if (firstChild) {
    handleNode(firstChild);
  } else {
    return nodes;
  }

  var nextSibling = treeWalker.nextSibling();
  while (nextSibling) {
    handleNode(nextSibling);
    treeWalker.currentNode = nextSibling;
    nextSibling = treeWalker.nextSibling();
  }

  return nodes;
}

function isValidAttrName(str) {
  return str.match(/^(\w|-)+$/) !== null
}

function isValidNode(node) {
  const invalid = node.attributes.find(([k]) => !isValidAttrName(k));
  return invalid ? invalid[0] : undefined;
}

export const parseFromString = elementCtor => attributeCtor => textCtor => commentCtor => Left => Right => input => {
  let error = null;
  function mapNode(node) {
    if (node.type == "element") {
      const res = isValidNode(node);
      if (res !== undefined) {
        error = `Invalid attribute '${res}'`;
      }
      return elementCtor({
        name: node.name,
        attributes: node.attributes.map(([k, v]) => attributeCtor(k)(v)),
        children: node.children.map(mapNode)
      });
    } else {
      var ctor = node.type == "text" ? textCtor : commentCtor;
      return ctor(node.text);
    }
  }

  var doc = new DOMParser().parseFromString(input, "text/html");
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    return Left(errorNode.textContent);
  }

  var headNodes = walk(
    doc.createTreeWalker(doc.documentElement.querySelector("head"))
  );
  var bodyNodes = walk(
    doc.createTreeWalker(doc.documentElement.querySelector("body"))
  );

  const res = [...headNodes, ...bodyNodes].map(node => {
    if (node.type == "element") {
      return mapNode(node);
    } else {
      var ctor = node.type == "text" ? textCtor : commentCtor;
      return ctor(node.text);
    }
  });

  if (error !== null) {
    return Left(error);
  } else {
    return Right(res);
  }
};
