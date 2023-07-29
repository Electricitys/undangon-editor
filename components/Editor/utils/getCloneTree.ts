import { generateId } from "@/components/utils/generateId";
import { Node } from "@craftjs/core";

export const getCloneTree = (query: any, idToClone: any) => {
  const tree = query.node(idToClone).toNodeTree();
  const newNodes: any = {};

  const changeNodeId = (node: Node, newParentId?: string) => {
    let newNodeId = generateId(16);
    const childNodes = node.data.nodes.map((childId) =>
      changeNodeId(tree.nodes[childId], newNodeId)
    );
    const linkedNodes = Object.keys(node.data.linkedNodes).reduce(
      (accum, id) => {
        newNodeId = changeNodeId(
          tree.nodes[node.data.linkedNodes[id]],
          newNodeId
        );
        return {
          ...accum,
          [id]: newNodeId,
        };
      },
      {}
    );

    let tmpNode = {
      ...node,
      id: newNodeId,
      data: {
        ...node.data,
        parent: newParentId || node.data.parent,
        nodes: childNodes,
        linkedNodes,
      },
    };
    let freshnode = query.parseFreshNode(tmpNode).toNode();
    newNodes[newNodeId] = freshnode;
    return newNodeId;
  };
  const rootNodeId = changeNodeId(tree.nodes[tree.rootNodeId]);
  return {
    rootNodeId,
    nodes: newNodes,
  };
};
