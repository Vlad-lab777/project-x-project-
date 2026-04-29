import { Card, CardContent, CardHeader, Avatar, AvatarFallback } from '@heroui/react'
import { activityFeed } from '../data/mockData'
import { useI18n } from '../i18n/context'

export default function ActivityFeed() {
  const { t } = useI18n()

  return (
    <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <CardHeader className="px-5 pt-5 pb-0">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {t.activityFeed.title}
          </p>
          <p className="text-xs text-zinc-400">{t.activityFeed.subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex flex-col gap-3">
        {activityFeed.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <Avatar
              aria-label={item.user}
              className="bg-violet-100 text-violet-700 text-xs font-bold shrink-0 w-8 h-8"
            >
              <AvatarFallback>{item.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-700 dark:text-zinc-300">
                <span className="font-semibold">{item.user}</span>{' '}
                {(t.activityActions as Record<string, string>)[item.actionKey]}
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
