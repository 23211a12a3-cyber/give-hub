import type { Item } from "../types";

interface Props {
  item: Item;
  uid: string;
  onClaim: (item: Item) => void;
  onRelist: (item: Item) => void;
  onRemove: (item: Item) => void;
}

export default function ItemCard({ item, uid, onClaim, onRelist, onRemove }: Props) {
  const mine = item.owner_id === uid;
  const claimed = item.status === "claimed";
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-line bg-white">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="h-44 w-full object-cover" />
      ) : (
        <div className="flex h-44 items-center justify-center bg-line text-sm text-pine">No photo</div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold leading-tight">{item.title}</h3>
          <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${claimed ? "bg-line" : "bg-marigold"}`}>
            {claimed ? "Claimed" : "Available"}
          </span>
        </div>
        <p className="text-sm text-pine">{item.category}, {item.condition}{item.location ? `, ${item.location}` : ""}</p>
        {item.description && <p className="text-sm">{item.description}</p>}
        <p className="mt-auto text-xs text-ink/60">Shared by {item.owner_name ?? "a neighbour"}</p>
        <div className="flex gap-2 pt-1">
          {!mine && !claimed && <button className="btn" onClick={() => onClaim(item)}>Request item</button>}
          {mine && claimed && <button className="btn-ghost" onClick={() => onRelist(item)}>Make available again</button>}
          {mine && <button className="btn-ghost" onClick={() => onRemove(item)}>Remove</button>}
        </div>
      </div>
    </article>
  );
}
