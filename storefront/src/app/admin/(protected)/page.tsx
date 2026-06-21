import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getOverviewStats } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const s = await getOverviewStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">개요</h1>
        <p className="mt-1 text-sm text-muted-foreground">오늘 (KST 기준) 현황</p>
      </div>

      {!s.configured ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Supabase 환경 변수가 설정되면 실데이터가 표시됩니다. 현재는 준비
            상태입니다.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          title="오늘 매출"
          value={`${s.todayRevenueMinor.toLocaleString("ko-KR")} 원`}
        />
        <Stat title="결제완료" value={`${s.todayPaidCount} 건`} />
        <Stat
          title="결제 오류"
          value={`${s.todayErrorCount} 건`}
          alert={s.todayErrorCount > 0}
        />
        <Stat title="방문자" value={`${s.todayVisitors} 명`} />
      </div>

      <p className="text-xs text-muted-foreground">
        페이지뷰 {s.todayPageViews.toLocaleString("ko-KR")}회 · 결제 진행/오류
        상세는 “결제·주문”, 유입 상세는 “방문자” 탭에서 확인하세요.
      </p>
    </div>
  );
}

function Stat({
  title,
  value,
  alert,
}: {
  title: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-2xl font-semibold ${alert ? "text-destructive" : ""}`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
