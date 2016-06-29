const bindings = new Map();

export function bind(context, target, event, original, ...args) {
  const listener = original.bind(context, ...args);
  const contextBindings = bindings.get(context) || [];

  contextBindings.push({
    target,
    event,
    original,
    listener
  });

  bindings.set(context, contextBindings);

  const method = target.addListener ?
    'addListener' : 'addEventListener';
  args = event ? [event, listener] : [listener];

  target[method](...args);
}

export function unbind(context, target, event, original) {
  let listener = null;
  let index = -1;

  const contextBindings = bindings.get(context);

  contextBindings.every((binding, i) => {
    if (binding.target === target &&
      binding.event === event &&
      binding.original === original) {

      listener = binding.listener;
      index = i;

      return false;
    }

    return true;
  });

  if (index === -1) {
    return;
  }

  contextBindings.splice(index, 1);
  bindings.set(context, contextBindings);

  const method = target.removeListener ?
    'removeListener' : 'removeEventListener';
  const args = event ? [event, listener] : [listener];

  target[method](...args);
}
