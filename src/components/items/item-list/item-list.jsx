import ItemCard from '../item-card/item-card'

// Cuadrícula de objetos: 2 columnas en móvil, 3 en tablet y 4 en escritorio.
// renderActions(item) → botones opcionales bajo cada tarjeta
function ItemList({ items, renderActions }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} actions={renderActions?.(item)} />
      ))}
    </div>
  )
}

export default ItemList
