import { renderRichText, NotionBlockRenderer } from '../renderer'

export function NumberedListItem({ block }: { block: any }) {
  return (
    <li className="my-1 ml-6 list-decimal font-serif leading-relaxed">
      {renderRichText(block.numbered_list_item.rich_text)}
      {block.children && <ol className="mt-1">{block.children.map((child: any) => <NotionBlockRenderer key={child.id} block={child} />)}</ol>}
    </li>
  )
}
