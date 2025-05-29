import { MenuItem } from "@constants/common.interface";

function removeNulls(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeNulls);
  } else if (obj && typeof obj === "object") {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        const cleanedValue = removeNulls(value);
        if (
          !(Array.isArray(cleanedValue) && cleanedValue.length === 0 && key === "children")
        ) {
          cleaned[key] = cleanedValue;
        }
      }
    }
    return cleaned;
  }
  return obj;
}

export function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const map = new Map<string, MenuItem>();
  const tree: MenuItem[] = [];

  // Initialize map and children array
  items.forEach(item => {
    item.children = [];
    map.set(item.id, item);
  });

  // Link children to their parents
  items.forEach(item => {
    if (item.parentId) {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children!.push(item);
      }
    } else {
      tree.push(item);
    }
  });

  // Remove null/undefined fields from every node
  return removeNulls(tree);
}
