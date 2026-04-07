import { renderRichText } from '@/components/notion/rich-text'
import { NotionRenderer } from '@/components/notion/renderer'

export function BulletedListItem({ block }: { block: any }) {
  return (
    <li className="list-disc font-serif text-base leading-relaxed text-fg">
      {renderRichText(block.bulleted_list_item?.rich_text)}
      {block.children && block.children.length > 0 && (
        <ul className="ml-5 mt-1 space-y-1">
          <NotionRenderer blocks={block.children} />
        </ul>
      )}
    </li>
  )
}

export function NumberedListItem({ block }: { block: any }) {
  return (
    <li className="list-decimal font-serif text-base leading-relaxed text-fg">
      {renderRichText(block.numbered_list_item?.rich_text)}
      {block.children && block.children.length > 0 && (
        <ol className="ml-5 mt-1 space-y-1">
          <NotionRenderer blocks={block.children} />
        </ol>
      )}
    </li>
  )
}
