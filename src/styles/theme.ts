const mainColor = {
  SkyBlue0: '#88C7F5',
  SkyBlue1: '#54A1D9',
  Blue: '#1D77FF',
  Red: '#FF5E3A',
  White: '#FFFFFF',
  Black: '#000000',
};

const grey = {
  Grey0: '#F8F9FA',
  Grey1: '#F2F3F4',
  Grey2: '#E8EBED',
  Grey3: '#C8CDD2',
  Grey4: '#ACB2B9',
  Grey5: '#9199A1',
  Grey6: '#787F87',
  Grey7: '#535B63',
  Grey8: '#3D4248',
  Grey9: '#26292C',
};

const successColor = {
  Green: '#27C82E',
};
const warningColor = {
  Yellow: '#FCDC0E',
};
const errorColor = {
  Red: '#FF0404',
};

const snsColor = {
  Kakao: '#FEE500',
  Naver: '#06C755',
  Google: '#ffffff',
};

const fontSizes = {
  Display5:
    '40px/1.4 Pretendard-Bold; letter-spacing: -0.6px; font-style: normal;',
  Display4:
    '36px/1.4 Pretendard-Bold; letter-spacing: -0.6px; font-style: normal;',
  Display3:
    '32px/1.4 Pretendard-Bold; letter-spacing: -0.6px; font-style: normal;',
  Display2:
    '28px/1.4 Pretendard-Bold; letter-spacing: -0.6px; font-style: normal;',
  Display1:
    '24px/1.4 Pretendard-Bold; letter-spacing: -0.6px; font-style: normal;',
  Headline3:
    '22px/1.4 Pretendard-SemiBold; letter-spacing: -0.6px; font-style: normal;',
  Headline2:
    '20px/1.4 Pretendard-SemiBold; letter-spacing: -0.6px; font-style: normal;',
  Headline1:
    '18px/1.4 Pretendard-SemiBold; letter-spacing: -0.6px; font-style: normal;',
  Subhead3:
    '16px/1.6 Pretendard-SemiBold; letter-spacing: -0.6px; font-style: normal;',
  Subhead2:
    '14px/1.4 Pretendard-SemiBold; letter-spacing: -0.6px; font-style: normal;',
  Subhead1:
    '12px/1.4 Pretendard-SemiBold; letter-spacing: -0.6px; font-style: normal;',
  Body5:
    '18px/1.6 Pretendard-Medium; letter-spacing: -0.35px; font-style: normal;',
  Body4:
    '16px/1.6 Pretendard-Medium; letter-spacing: -0.35px; font-style: normal;',
  Body3:
    '14px/1.7 Pretendard-Medium; letter-spacing: -0.35px; font-style: normal;',
  Body2:
    '14px/1.6 Pretendard-Regular; letter-spacing: -0.325px; font-style: normal;',
  Body1:
    '12px/1.4 Pretendard-Regular; letter-spacing: -0.3px; line-height: 140%; font-style: normal;',
  BoxText:
    '12px/1.4 Pretendard-SemiBold; letter-spacing: -0.6px; line-height: 140%; font-style: normal;',
  Location2:
    '12px/1.4 Pretendard-Medium; letter-spacing: -0.25px; line-height: 140%; font-style: normal;',
  Location1:
    '9px/1.4 Pretendard-Medium; letter-spacing: -0.225px; line-height: 140%; font-style: normal;',
};

const paddings = {
  small: '8px',
  base: '7%',
};

const background = {
  lightBlurBackground: `rgba(255, 255, 255, 0.5)`,
};

const systemSize = {
  appDisplaySize: {
    maxWidth: '500px',
    widthByPc: '600px',
    profilePostMaxWidth: '580px',

    bothSidePadding: '20px',
    bottomButtonMargin: '40px',
  },
  bottomNavBar: {
    heightNum: 90,
    height: '90px',
  },
  header: {
    height: '50px',
    heightNumber: 50,
    paddingLeftRightMargin: '15px',
    //@REFER: 22px 또는 21px로 할 지 결정
    //paddingLeftRightMargin: '22px',
  },
  popupTopBodyBottomScrollArea: {
    height: '80px',
  },
  reactionButton: {
    padding: '6px',
    gap: '9px',
  },
};

const theme = {
  mainColor,
  grey,
  successColor,
  warningColor,
  errorColor,
  fontSizes,
  paddings,
  systemSize,
  snsColor,
  background,
};

export default theme;
