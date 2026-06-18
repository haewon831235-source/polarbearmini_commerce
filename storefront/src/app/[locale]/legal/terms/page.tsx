import { LegalPage } from "@/components/legal-page";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage locale={locale} titleKey="termsTitle">
      <TermsContent />
    </LegalPage>
  );
}

function TermsContent() {
  return (
    <div className="prose prose-sm max-w-none text-foreground leading-relaxed space-y-8">
      <p className="text-sm text-muted-foreground">시행일자: 2026년 6월 15일</p>

      <section>
        <h2 className="text-lg font-semibold mb-3">제1조 (목적)</h2>
        <p>
          이 약관은 주식회사 폴라리스아틀리에코리아(이하 "회사")가 운영하는
          Polaris Atelier Korea(polarisatelierkorea.com, 이하 "사이트")에서
          제공하는 IP 굿즈 및 공연 티켓 구매 서비스(이하 "서비스")의 이용과
          관련하여 회사와 이용자 사이의 권리·의무 및 책임사항을 규정함을
          목적으로 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제2조 (정의)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>"서비스"란 회사가 제공하는 굿즈 판매, 공연 티켓 예매, 캠페인 참여 등 일체의 서비스를 말합니다.</li>
          <li>"이용자"란 사이트에 접속하여 이 약관에 따라 서비스를 이용하는 모든 자를 말합니다.</li>
          <li>"회원"이란 사이트에 개인정보를 제공하여 회원 등록을 한 자로서, 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
          <li>"굿즈"란 회사가 정식 라이선스 계약을 체결한 IP(애니메이션·게임·뮤지컬 등)를 기반으로 제작·판매하는 물리적 상품을 말합니다.</li>
          <li>"티켓"이란 회사 또는 제휴사가 주관하는 공연·행사 입장권을 말합니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제3조 (약관의 게시 및 개정)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>회사는 이 약관을 사이트 초기 화면 또는 연결 화면을 통해 이용자가 확인할 수 있도록 게시합니다.</li>
          <li>회사는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」 등 관련 법령을 위반하지 않는 범위에서 이 약관을 개정할 수 있습니다.</li>
          <li>회사가 약관을 개정할 때에는 적용일자 및 개정 사유를 명시하여 현행 약관과 함께 사이트에 그 적용일자 7일 이전부터 공지합니다. 다만, 이용자에게 불리한 내용으로 변경되는 경우에는 30일 이전부터 공지합니다.</li>
          <li>이용자가 개정 약관의 적용일 이후에도 서비스를 계속 이용하는 경우, 개정 약관에 동의한 것으로 봅니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제4조 (서비스의 제공 및 변경)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>회사는 다음의 서비스를 제공합니다.
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>IP 공식 굿즈(한정판 포함) 판매</li>
              <li>공연 티켓 예매 및 정보 제공</li>
              <li>캠페인 및 이벤트 운영</li>
              <li>공연 아카이브 열람</li>
              <li>기타 회사가 추가 개발하거나 제휴를 통해 제공하는 서비스</li>
            </ul>
          </li>
          <li>회사는 운영상·기술상의 필요에 따라 제공하는 서비스를 변경할 수 있으며, 변경 전에 사이트를 통해 공지합니다.</li>
          <li>서비스 중단이 불가피한 경우, 가능한 한 사전에 공지하며, 불가피한 사정이 있을 때에는 사후에 공지합니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제5조 (회원가입 및 계정)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>이용자는 회사가 정한 양식에 따라 이름, 이메일 주소 등 필수 정보를 기재하고 약관에 동의함으로써 회원가입을 신청할 수 있습니다.</li>
          <li>회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자에 대하여 서비스 이용을 승낙하는 것을 원칙으로 합니다. 다만, 아래에 해당하는 경우에는 승낙을 하지 않거나 사후에 이용 계약을 해지할 수 있습니다.
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>가입 신청서에 허위 내용을 기재한 경우</li>
              <li>타인의 정보를 도용한 경우</li>
              <li>이전에 서비스 이용 제한을 받은 이력이 있는 경우</li>
              <li>관련 법령에 위반되거나 사회 질서를 해하는 목적으로 신청한 경우</li>
            </ul>
          </li>
          <li>회원은 자신의 계정 정보를 안전하게 관리해야 하며, 제3자에게 계정 정보를 제공하거나 공유해서는 안 됩니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제6조 (회원 탈퇴 및 이용 제한)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>회원은 언제든지 회원 탈퇴를 요청할 수 있으며, 회사는 즉시 이를 처리합니다.</li>
          <li>회원이 다음의 행위를 하는 경우 회사는 사전 통보 없이 이용을 제한하거나 계약을 해지할 수 있습니다.
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>가입 신청 시 허위 정보를 기재한 경우</li>
              <li>서비스의 정상적인 운영을 방해하는 경우</li>
              <li>타인의 명예를 손상시키거나 불이익을 주는 행위를 한 경우</li>
              <li>저작권법, 개인정보보호법 등 관련 법령을 위반한 경우</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제7조 (이용자의 의무)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>이용자는 다음 행위를 해서는 안 됩니다.
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>신청 또는 변경 시 허위 내용을 등록하는 행위</li>
              <li>회사에 게시된 정보를 변경하는 행위</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등)를 송신·게시하는 행위</li>
              <li>회사 또는 제3자의 저작권 등 지식재산권을 침해하는 행위</li>
              <li>구매한 굿즈·티켓을 영리 목적으로 무단 재판매하는 행위</li>
              <li>기타 불법적이거나 부당한 행위</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제8조 (구매 신청 및 결제)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>이용자는 사이트에서 다음의 방법으로 구매를 신청합니다.
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>상품 선택 및 장바구니 담기</li>
              <li>수취인 정보 입력</li>
              <li>결제 수단 선택 및 결제</li>
            </ul>
          </li>
          <li>회사는 다음 각 호의 구매 신청에 대하여 승낙하지 않을 수 있습니다.
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>신청 내용에 허위, 기재누락, 오기가 있는 경우</li>
              <li>재고 부족 등 기술적 장애로 이행이 불가능한 경우</li>
            </ul>
          </li>
          <li>회사의 승낙이 이용자에게 도달한 시점에 계약이 성립합니다.</li>
          <li>결제는 신용·체크카드, 토스페이, 카카오페이, 네이버페이 등 회사가 지정하는 수단으로 진행합니다.</li>
          <li>회사는 이용자가 결제 수단에 대한 정당한 사용 권한을 보유하고 있는지 확인할 수 있으며, 확인 전까지 거래를 보류하거나 취소할 수 있습니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제9조 (배송)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>회사는 이용자가 구매한 굿즈를 결제 완료 후 영업일 기준 3일 이내에 발송하는 것을 원칙으로 합니다. 다만, 재고 사정 또는 불가항력적 사유로 지연될 수 있으며 이 경우 사전에 공지합니다.</li>
          <li>국내 배송은 회사가 지정한 택배사를 통해 이루어지며, 배송비는 상품 페이지에 별도 표기합니다.</li>
          <li>해외 배송은 지원 국가 및 요금이 상품 페이지에 별도 표기됩니다. 수입 관세 및 현지 세금은 수취인 부담입니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제10조 (지식재산권)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>사이트 내의 게시물, 디자인, 이미지, 텍스트, 상표 등 일체의 지식재산권은 회사 또는 적법한 권리자에게 귀속됩니다.</li>
          <li>이용자는 회사의 사전 서면 동의 없이 서비스상의 콘텐츠를 복제, 배포, 수정, 공표, 전시하거나 2차 저작물 제작에 사용해서는 안 됩니다.</li>
          <li>굿즈 상품에 포함된 IP 디자인은 각 IP 권리자와의 정식 라이선스 계약에 따라 사용되며, 이용자가 이를 무단으로 사용하거나 복제하는 것은 금지됩니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제11조 (면책사항)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>회사는 천재지변, 전쟁, 분쟁, 테러, 정부 규제, 해킹, 통신 장애 등 불가항력적 사유로 서비스를 제공할 수 없는 경우에는 책임을 지지 않습니다.</li>
          <li>회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.</li>
          <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 서비스를 통해 얻은 자료로 인해 발생한 손해에 대해 책임을 지지 않습니다.</li>
          <li>회사가 제공하는 외부 링크(제휴사 티켓 사이트 등)의 서비스에 대해서는 보증하지 않으며, 해당 사이트의 약관과 정책이 별도 적용됩니다.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">제12조 (분쟁 해결)</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>서비스 이용과 관련하여 분쟁이 발생한 경우, 회사와 이용자는 성실하게 협의하여 해결하는 것을 원칙으로 합니다.</li>
          <li>협의가 이루어지지 않는 경우, 「전자상거래 등에서의 소비자보호에 관한 법률」에서 정하는 절차에 따른 분쟁 조정 기관에 분쟁 조정을 신청할 수 있습니다.</li>
          <li>이 약관과 관련된 소송의 관할 법원은 서울중앙지방법원으로 합니다.</li>
          <li>이 약관에 관한 준거법은 대한민국 법령으로 합니다.</li>
        </ol>
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
