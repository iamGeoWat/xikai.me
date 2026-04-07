import { renderRichText, NotionBlockRenderer } from '../renderer'

export function BulletedListItem({ block }: { block: any }) {
  return (
    <li className="my-1 ml-6 list-disc font-serif leading-relaxed">
      {renderRichText(block.bulleted_list_item.rich_text)}
      {block.children && <ul className="mt-1">{block.children.map((child: any) => <NotionBlockRenderer key={child.id} block={child} />)}</ul>}
    </li>
  )
}
