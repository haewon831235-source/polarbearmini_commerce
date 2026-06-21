import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { getRecentPageViews } from "@/lib/admin/queries";
import { formatDateTime } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

export default async function AdminVisitorsPage() {
  const { configured, rows } = await getRecentPageViews();

  // Top paths summary from the recent window.
  const pathCounts = new Map<string, number>();
  for (const r of rows) pathCounts.set(r.path, (pathCounts.get(r.path) ?? 0) + 1);
  const topPaths = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const uniqueVisitors = new Set(
    rows.map((r) => r.visitor_id).filter(Boolean),
  ).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">방문자</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          최근 페이지뷰 {rows.length}회 · 고유 방문자 {uniqueVisitors}명
        </p>
      </div>

      {!configured ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Supabase 환경 변수가 설정되면 방문 기록이 표시됩니다.
          </CardContent>
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            아직 방문 기록이 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-lg border border-border">
            <div className="border-b border-border px-4 py-2 text-sm font-medium">
              인기 페이지
            </div>
            <ul className="divide-y divide-border text-sm">
              {topPaths.map(([path, count]) => (
                <li
                  key={path}
                  className="flex items-center justify-between gap-2 px-4 py-2"
                >
                  <span className="truncate text-muted-foreground">{path}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>시간</TableHead>
                  <TableHead>경로</TableHead>
                  <TableHead>언어</TableHead>
                  <TableHead>국가</TableHead>
                  <TableHead>유입</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 100).map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDateTime(v.created_at)}
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate">
                      {v.path}
                    </TableCell>
                    <TableCell className="text-xs uppercase">
                      {v.locale ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs">{v.country ?? "—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {v.referrer ?? "직접"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
