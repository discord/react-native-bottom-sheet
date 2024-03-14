'use strict';

const noReanimatedHookDeps =
  'Do not include dependency arrays in Reanimated hooks. This can lead to unexpected behavior or bugs. \
See reanimated docs https://reanimated-beta-docs.swmansion.com/docs/core/useAnimatedStyle#dependencies-.';

const REANIMATED_HOOKS = new Set([
  'useAnimatedStyle',
  'useAnimatedProps',
  'useDerivedValue',
  'useAnimatedReaction',
]);

module.exports = {
  meta: {
    messages: {
      noReanimatedHookDeps,
    },
    docs: {
      description: 'Ensure Reanimated hooks do not include dependency arrays.',
      category: 'Code Safety',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    return {
      CallExpression(node, _parent) {
        if (!REANIMATED_HOOKS.has(node.callee.name)) {
          return;
        }

        const depsArgIndex = node.arguments.length - 1;
        const previousArg = node.arguments[depsArgIndex - 1];
        const depsArg = node.arguments[depsArgIndex];

        if (depsArg != null && depsArg.type === 'ArrayExpression') {
          context.report({
            node: depsArg,
            messageId: 'noReanimatedHookDeps',

            fix(fixer) {
              return fixer.removeRange([
                previousArg.range[1],
                depsArg.range[1],
              ]);
            },
          });
        }
      },
    };
  },
};
