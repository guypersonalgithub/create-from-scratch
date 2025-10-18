- Replace

  const callback = callbacks[newTokenValue];
  if (!callback) {
  return { updatedIndex: currentIndex };
  }

  with if (!Object.hasOwn(callbacks, newTokenValue)) {
  return { updatedIndex: currentIndex };
  }

since otherwise, callbacks[newTokenValue] can work with javascript properties such as hasOwnProperty even if its not an intended behavior.
