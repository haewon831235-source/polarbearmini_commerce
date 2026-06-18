import { LegalPage } from "@/components/legal-page";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage locale={locale} titleKey="privacyTitle">
      <PrivacyContent />
    </LegalPage>
  );
}

function PrivacyContent() {
  return (
    <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-8">
      <p className="text-sm text-muted-foreground">시행일자: 2026년 6월 15일</p>
      <p>
        주식회사 폴라리스아틀리에코리아(이하 "회사")는 「개인정보보호법」 제30조에 따라
        정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게
        처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
      </p>

      <section>
        <h2 className="text-lg font-semibold mb-3">제1조 (개인정보의 처리 목적)</h2>
        <p className="mb-2">회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리된 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받습니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>회원가입 및 관리:</strong> 회원가입 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 계정 유지·관리, 서비스 부정이용 방지</li>
          <li><strong>굿즈·티켓 구매 및 배송:</strong> 주문 처리, 결제, 배송, 취소·환불 처리</li>
          <li><strong>고객 문의 및 민원 처리:</strong> 문의 접수, 불만 처리, 공지사항 전달</li>
          <li><strong>마케팅 및 광고 활용(선택):</strong> 신상품 안내, 이벤트·캠페인 정보 제공, 맞춤형 광고 제공</li>
          <li><strong>서비스 개선:</strong> 서비스 이용 통계 분석, 서비스 품질 향상</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제2조 (처리하는 개인정보의 항목)</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-1">① 회원가입 시 (필수)</p>
            <p className="text-muted-foreground">이메일 주소, 비밀번호(암호화 저장), 이름</p>
          </div>
          <div>
            <p className="font-medium mb-1">② 주문·결제 시 (필수)</p>
            <p className="text-muted-foreground">이름, 연락처(전화번호), 이메일 주소, 배송지 주소, 결제 수단 정보(카드사명·카드번호 일부 — 결제대행사에서 직접 처리)</p>
          </div>
          <div>
            <p className="font-medium mb-1">③ 해외 배송 시 (필수)</p>
            <p className="text-muted-foreground">수취인 영문 이름, 국제 배송지 주소, 연락처</p>
          </div>
          <div>
            <p className="font-medium mb-1">④ 마케팅 동의 시 (선택)</p>
            <p className="text-muted-foreground">이메일 주소, 수신 동의 여부</p>
          </div>
          <div>
            <p className="font-medium mb-1">⑤ 서비스 이용 중 자동 수집</p>
            <p className="text-muted-foreground">IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 기기 정보(OS, 브라우저 종류)</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제3조 (개인정보의 처리 및 보유 기간)</h2>
        <p className="mb-3">회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">보유 기간</th>
                <th className="border border-border px-3 py-2 text-left">근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">회원가입 정보</td>
                <td className="border border-border px-3 py-2">회원 탈퇴 시까지</td>
                <td className="border border-border px-3 py-2">본인 동의</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">계약·청약 철회 기록</td>
                <td className="border border-border px-3 py-2">5년</td>
                <td className="border border-border px-3 py-2">전자상거래법 제6조</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">대금결제·공급 기록</td>
                <td className="border border-border px-3 py-2">5년</td>
                <td className="border border-border px-3 py-2">전자상거래법 제6조</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">소비자 불만·분쟁 기록</td>
                <td className="border border-border px-3 py-2">3년</td>
                <td className="border border-border px-3 py-2">전자상거래법 제6조</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">접속 로그</td>
                <td className="border border-border px-3 py-2">3개월</td>
                <td className="border border-border px-3 py-2">통신비밀보호법</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">마케팅 수신 동의 정보</td>
                <td className="border border-border px-3 py-2">동의 철회 시까지</td>
                <td className="border border-border px-3 py-2">본인 동의</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제4조 (개인정보의 제3자 제공)</h2>
        <p className="mb-3">회사는 원칙적으로 정보주체의 개인정보를 제1조에서 명시한 목적 범위 내에서만 처리하며, 다음의 경우에만 제3자에게 제공합니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>정보주체가 사전에 동의한 경우</li>
          <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
        </ul>
        <p className="mt-3 text-muted-foreground text-sm">현재 회사는 배송사에 수취인의 이름, 주소, 연락처를 제공하며, 이는 배송 목적으로만 사용됩니다.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제5조 (개인정보 처리 위탁)</h2>
        <p className="mb-3">회사는 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁합니다.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">수탁 업체</th>
                <th className="border border-border px-3 py-2 text-left">위탁 업무</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">포트원(PortOne)</td>
                <td className="border border-border px-3 py-2">결제 처리</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Vercel Inc.</td>
                <td className="border border-border px-3 py-2">서버 호스팅 및 데이터 처리</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Supabase Inc.</td>
                <td className="border border-border px-3 py-2">데이터베이스 운영</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">택배사(배송 시 공지)</td>
                <td className="border border-border px-3 py-2">상품 배송</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제6조 (정보주체의 권리·의무 및 행사 방법)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
          </li>
          <li>권리 행사는 이메일(polarbearmini@naver.com)을 통해 하실 수 있으며, 회사는 이에 대해 지체 없이 조치합니다.</li>
          <li>정보주체가 개인정보의 오류 정정을 요청한 경우, 정정을 완료할 때까지 해당 개인정보를 이용하거나 제공하지 않습니다.</li>
          <li>14세 미만 아동의 경우 법정대리인의 동의가 필요합니다. 회사는 14세 미만 아동의 개인정보를 수집하지 않습니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제7조 (개인정보의 안전성 확보 조치)</h2>
        <p className="mb-2">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 보안 교육</li>
          <li><strong>기술적 조치:</strong> 개인정보처리시스템 접근 제한, 접속 기록 보관·위변조 방지, 개인정보 암호화(HTTPS, 비밀번호 해싱)</li>
          <li><strong>물리적 조치:</strong> 전산실 등 접근 통제</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제8조 (쿠키의 설치·운영 및 거부)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>회사는 이용자에게 맞춤화된 서비스를 제공하기 위해 쿠키를 사용합니다.</li>
          <li>쿠키는 서버가 이용자 브라우저에 전송하는 소량의 정보이며, 이용자의 컴퓨터 하드디스크에 저장됩니다.</li>
          <li>이용자는 웹 브라우저 옵션 설정을 통해 쿠키 허용, 확인 요청, 또는 거부할 수 있습니다. 다만 쿠키 저장을 거부하는 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제9조 (개인정보 보호책임자)</h2>
        <p className="mb-3">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 정보주체의 개인정보 관련 문의·불만 처리를 위해 아래와 같이 개인정보 보호책임자를 지정합니다.</p>
        <div className="bg-muted rounded-lg p-4 text-sm space-y-1">
          <p><strong>개인정보 보호책임자</strong></p>
          <p>성명: 이혜원</p>
          <p>직책: 대표</p>
          <p>연락처: polarbearmini@naver.com</p>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          정보주체는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 관련 문의, 불만, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의할 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제10조 (개인정보처리방침의 변경)</h2>
        <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경 사항의 시행 7일 전부터 사이트를 통하여 공지합니다.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제11조 (권익 침해 구제 방법)</h2>
        <p className="mb-2">개인정보 침해로 인한 구제를 받기 위하여 아래 기관에 분쟁해결이나 상담 등을 신청할 수 있습니다.</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>개인정보 침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
          <li>개인정보 분쟁조정위원회 (www.kopico.go.kr / 1833-6972)</li>
          <li>대검찰청 사이버범죄수사단 (www.spo.go.kr / 02-3480-3573)</li>
          <li>경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</li>
        </ul>
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
