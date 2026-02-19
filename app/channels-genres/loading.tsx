import { Sidebar, Header, Chatbot } from "@/components/layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function ChannelsGenresLoading() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="relative h-[70vh] min-h-[420px] w-full shrink-0">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          <div className="px-8 py-8">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Skeleton className="h-10 min-w-[200px] max-w-sm flex-1 rounded-xl" />
              <Skeleton className="h-10 w-[140px] rounded-xl" />
              <Skeleton className="h-10 w-[160px] rounded-xl" />
              <Skeleton className="h-10 w-[160px] rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  )
}
