"use client"

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import Delete from "./Delete";

type ItemProps = {
  id: string,
  name: string,
  searchKey?: string,
  resetKey?: string,
  selected?: boolean,
  className?: string
  deleteAction: (id: string) => Promise<void>
}

const Item = ({ id, name, searchKey, resetKey, selected, className, deleteAction }: ItemProps) => {
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
    <div onClick={handleFilter} tabIndex={0} className={clsx(className, selected ? "bg-slate-400" : "focus:bg-slate-400 bg-slate-100",
      "border border-gray-300 dark:border-neutral-700 ",
      "rounded-lg p-5 cursor-pointer",
      "flex justify-between")}>
      <span>{name}</span>
      <Delete id={id} action={deleteAction} />
    </div>
  )
}

export default Item