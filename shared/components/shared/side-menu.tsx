'use client'

import { cn } from '@/shared/lib/utils'
import React from 'react'
import { User, Music, LayoutGrid, CreditCard, Banknote, Briefcase, HelpCircle, Globe } from 'lucide-react'
import { useSideMenuStore } from '@/shared/store/side-menu'
import Link from 'next/link'

interface Props {
  className?: string
}

const menu = [
    { id: 1, icon: User, href: '/account' },
    { id: 2, icon: Music, href: '/' },
    { id: 3, icon: LayoutGrid, href: '/' },
    { id: 4, icon: CreditCard, href: '/' },
    { id: 5, icon: Banknote, href: '/' },
    { id: 6, icon: Briefcase, href: '/' },
    { id: 7, icon: HelpCircle, href: '/' },
    { id: 8, icon: Globe, href: '/' },
]
export const SideMenu: React.FC<Props> = ({ className }) => {
    const sideMenuActiveId = useSideMenuStore((state) => state.activeId)
    const setSideMenuActiveId = useSideMenuStore((state) => state.setActiveId)
  return (
    <div
      className={cn(
        'h-full w-25 m-8 bg-white border rounded-2xl flex flex-col items-center py-6 gap-7',
        className
      )}
    >
        {
            menu.map(({id, icon: Icon, href}, i) => (
                 <Link key={i} href={href} onClick={() => setSideMenuActiveId(id)}  
                    className={cn('text-gray-400 hover:text-black transition-colors',
                        sideMenuActiveId == id && 'text-black'
                    )}>

                        <Icon className='w-10 h-10'/>
                </Link>
            ))
        }
    </div>
  )
}
