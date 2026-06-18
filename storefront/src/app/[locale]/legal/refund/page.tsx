import { LegalPage } from "@/components/legal-page";

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage locale={locale} titleKey="refundTitle">
      <RefundContent />
    </LegalPage>
  );
}

function RefundContent() {
  return (
    <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-8">
      <p className="text-sm text-muted-foreground">시행일자: 2026년 6월 15일</p>
      <p>
        주식회사 폴라리스아틀리에코리아(이하 "회사")는 「전자상거래 등에서의
        소비자보호에 관한 법률」 및 「공정거래위원회 표준약관」에 따라 아래와
        같이 취소 및 환불 정책을 운영합니다.
      </p>

      <section>
        <h2 className="text-lg font-semibold mb-3">제1조 (굿즈 주문 취소)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>발송 전 취소:</strong> 결제 완료 후 상품 발송 전이라면 고객센터(polarbearmini@naver.com)를 통해 전액 취소가 가능합니다.
          </li>
          <li>
            <strong>발송 후 취소:</strong> 상품이 발송된 이후에는 수령 후 반품 절차를 통해 처리합니다.
          </li>
          <li>
            <strong>한정판·특별 기획 상품:</strong> 별도 구매 조건이 명시된 한정판 상품은 취소 및 환불이 제한될 수 있으며, 상품 페이지에 이를 사전 공지합니다.
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제2조 (굿즈 반품 및 환불)</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">① 반품 가능 기간</h3>
            <p>상품 수령일로부터 <strong>7일 이내</strong>에 반품을 요청할 수 있습니다 (「전자상거래법」 제17조).</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">② 소비자 귀책(단순 변심) 반품</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>반품 배송비(왕복)는 소비자 부담입니다.</li>
              <li>상품과 포장이 훼손되지 않은 경우에 한합니다.</li>
              <li>동봉된 사은품·증정품이 있는 경우 함께 반송해야 합니다.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">③ 회사 귀책(상품 불량·오배송) 반품</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>반품 배송비(왕복)는 회사 부담입니다.</li>
              <li>수령 후 7일 이내에 고객센터로 문의하고, 불량 사진을 첨부해주세요.</li>
              <li>확인 후 동일 상품 교환 또는 전액 환불로 처리합니다.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">④ 반품 불가 사항</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>이용자의 사용 또는 일부 소비에 의해 상품 가치가 현저히 감소한 경우</li>
              <li>시간의 경과에 의해 재판매가 곤란할 정도로 상품 가치가 감소한 경우</li>
              <li>복제 가능한 상품의 포장이 훼손된 경우</li>
              <li>주문 제작(커스텀 굿즈) 상품</li>
              <li>수령 후 7일이 경과한 경우</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제3조 (공연 티켓 취소 및 환불)</h2>
        <p className="mb-3">
          공연 티켓은 회사 또는 제휴 티켓 플랫폼(야놀자 NOL 등)을 통해 판매됩니다. 제휴 플랫폼을 통해 구매한 티켓의 환불 정책은 해당 플랫폼의 규정을 따릅니다.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">① 회사 직접 판매 티켓 환불 기준</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left">취소 시점</th>
                    <th className="border border-border px-3 py-2 text-left">환불 금액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-3 py-2">공연일 10일 전까지</td>
                    <td className="border border-border px-3 py-2">전액 환불</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">공연일 9일 전 ~ 7일 전</td>
                    <td className="border border-border px-3 py-2">결제 금액의 90% 환불</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">공연일 6일 전 ~ 3일 전</td>
                    <td className="border border-border px-3 py-2">결제 금액의 70% 환불</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">공연일 2일 전 ~ 1일 전</td>
                    <td className="border border-border px-3 py-2">결제 금액의 50% 환불</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">공연 당일 및 이후</td>
                    <td className="border border-border px-3 py-2">환불 불가</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">※ 공연 날짜 기준은 공연 시작 시각을 기준으로 합니다. 예매 수수료는 환불 대상에서 제외될 수 있습니다.</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">② 공연 취소·변경 시 환불</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>회사 또는 공연 주최 측의 사정으로 공연이 취소되는 경우: 전액 환불 및 예매 수수료 포함 환불</li>
              <li>공연 날짜·장소·출연진이 변경되는 경우: 변경 공지 후 7일 이내 취소 신청 시 전액 환불</li>
              <li>천재지변, 불가항력으로 공연이 취소되는 경우: 전액 환불</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">③ 티켓 환불 불가 사항</h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>공연 당일 이후 취소 요청</li>
              <li>티켓 수령 후(실물 티켓) 분실·훼손</li>
              <li>본인 사정으로 인한 공연 당일 불참</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제4조 (환불 처리 기간 및 방법)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>환불 승인 후 원결제 수단으로 환불합니다.
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>신용카드: 카드사 정책에 따라 3~5 영업일 소요</li>
              <li>계좌이체·간편결제: 3~5 영업일 소요</li>
            </ul>
          </li>
          <li>반품 상품 수령 확인 후 영업일 기준 3일 이내에 환불 처리합니다.</li>
          <li>배송비 등 공제 금액이 있는 경우 공제 후 환불됩니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제5조 (교환)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>불량품·오배송의 경우 동일 상품으로 교환하거나 환불을 선택할 수 있습니다.</li>
          <li>단순 변심에 의한 교환의 경우, 교환 배송비는 소비자 부담이며 재고 상황에 따라 처리 가능 여부가 달라질 수 있습니다.</li>
          <li>한정판·품절 상품의 경우 교환이 불가능할 수 있으며, 이 경우 환불로 대체합니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제6조 (해외 구매자 환불)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>해외 배송 상품의 반품 배송비는 원칙적으로 소비자 부담이며, 불량·오배송의 경우 회사가 부담합니다.</li>
          <li>관세 등 수입 제세공과금은 환불 대상에 포함되지 않습니다.</li>
          <li>해외 결제의 경우 환율 차이로 인한 환불 금액 차이가 발생할 수 있습니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제7조 (고객센터 연락처)</h2>
        <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
          <p>취소·환불 문의는 아래로 연락해주세요.</p>
          <p><strong>이메일:</strong> polarbearmini@naver.com</p>
          <p className="text-muted-foreground text-xs">
            문의 시 주문번호, 성함, 문의 내용을 포함해 주시면 빠른 처리가 가능합니다.<br />
            영업일 기준 1~2일 이내에 답변 드립니다.
          </p>
        </div>
      </section>

      <section className="border-t pt-6 text-sm text-muted-foreground space-y-1">
        <p>상호: 주식회사 폴라리스아틀리에코리아</p>
        <p>대표: 이혜원</p>
        <p>사업자등록번호: 769-88-03948</p>
        <p>주소: 서울특별시 중구 장충단로13길 20, 11층 오픈석씨 14번(을지로6가, 현대시티타워)</p>
        <p>고객문의: polarbearmini@naver.com</p>
      </section>
    </div>
  );
}
