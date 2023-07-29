import { ERROR_NOT_IN_RESOLVER } from '@craftjs/utils';
import { ComponentClass } from 'react';
import invariant from 'tiny-invariant';

export const resolveComponent = (
  resolver: { [x: string]: any; },
  comp: ComponentClass<any, any>
) => {
  const componentName: string = (comp.name || comp.displayName) as string;

  const getNameInResolver = () => {
    if (resolver[componentName]) {
      return componentName;
    }

    for (let i = 0; i < Object.keys(resolver).length; i++) {
      const name = Object.keys(resolver)[i];
      const fn = resolver[name];

      if (fn === comp) {
        return name;
      }
    }

    if (typeof comp === 'string') {
      return comp;
    }
  };

  const resolvedName = getNameInResolver();

  invariant(
    resolvedName,
    ERROR_NOT_IN_RESOLVER.replace('%node_type%', componentName)
  );

  return resolvedName;
};