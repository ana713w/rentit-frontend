import ItemCard from '../item-card/item-card'

// Cuadricula de objetos
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
