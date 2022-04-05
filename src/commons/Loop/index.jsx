
export default ({ items, name, component }) => items && items.map(item => component({ [name || "item"]: item }))
