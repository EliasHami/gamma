"use client"

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const Item = ({ id, name, searchKey, resetKey }: { id: string, name: string, searchKey?: string, resetKey?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const handleFilter = () => {
    if (!searchKey) return;
    const params = new URLSearchParams(window.location.search);
    params.set(searchKey, id);

    if (resetKey) params.delete(resetKey)

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div onClick={handleFilter} className="bg-slate-100 border border-gray-300 dark:border-neutral-700 rounded-lg p-5 cursor-pointer">
      <span>{name}</span>
    </div>
  )
}

export default Item