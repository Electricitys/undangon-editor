export const importProps = (node: any, props: any) =>
  props.reduce((res: any, key: any) => {
    res[key] = node.data.props[key] || null;
    return res;
  }, {});
