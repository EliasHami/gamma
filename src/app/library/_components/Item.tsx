"use client"

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const Item = ({ id, name, searchKey }: { id: string, name: string, searchKey?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const handleFilter = () => {
    if (!searchKey) return;
    const params = new URLSearchParams(window.location.search);
    params.set(searchKey, id);


    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div onClick={handleFilter} className="bg-slate-100 border border-gray-300 dark:border-neutral-700 rounded-lg p-5">
      <span>{name}</span>
    </div>
  )
}

export default Item