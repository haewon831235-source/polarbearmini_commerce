import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getRecentOrders } from "@/lib/admin/queries";
import {
  formatAmount,
  formatDateTime,
  STATUS_LABEL,
  ERROR_REASON_LABEL,
} from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  paid: "default",
  started: "secondary",
  failed: "destructive",
  error: "destructive",
};

export default async function AdminOrdersPage() {
  const { configured, rows } = await getRecentOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">결제·주문</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          모든 결제 시도(완료·실패·오류)가 기록됩니다 · 최근 {rows.length}건
        </p>
      </div>

      {!configured ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Supabase 환경 변수가 설정되면 결제 기록이 표시됩니다.
          </CardContent>
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            아직 결제 시도 기록이 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>시간</TableHead>
                <TableHead>주문명</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>오류 사유</TableHead>
                <TableHead className="text-right">금액</TableHead>
                <TableHead>고객</TableHead>
                <TableHead>결제ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatDateTime(o.created_at)}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">
                    {o.order_name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[o.status] ?? "outline"}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-destructive">
                    {o.error_reason
                      ? (ERROR_REASON_LABEL[o.error_reason] ?? o.error_reason)
                      : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    {formatAmount(o.amount_minor, o.currency)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {o.customer_name || o.customer_email || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">
                    {o.payment_id}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
