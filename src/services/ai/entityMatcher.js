// src/services/ai/entityMatcher.js

export const matchEntity = (query, entities) => {
  const q = query.toLowerCase();
  return entities.filter((e) =>
    e.display_name.toLowerCase().includes(q.split(' ')[0])
  );
};
