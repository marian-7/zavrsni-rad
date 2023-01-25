import { FC, memo, useMemo, useContext } from "react";
import style from "styles/pages/login/components/LoginInfo.module.scss";
import { InfoCard } from "./InfoCard";
import SwiperCore, { Pagination, Autoplay, EffectFade } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import { Card } from "domain/models/Card";
import { I18nextContext } from "providers/I18nextProvider";

SwiperCore.use([Pagination, Autoplay, EffectFade]);

type Props = {
  carousel: Card[] | undefined;
};

export const Info: FC<Props> = memo(function LoginInfoCard(props) {
  const { slides } = useInfo(props);

  return (
    <>
      {slides && slides.length > 0 && (
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: style.bullet,
            bulletActiveClass: style.bulletActive,
          }}
          autoHeight
          className={style.swiper}
          autoplay={{ delay: 30000, disableOnInteraction: false }}
        >
          {slides}
        </Swiper>
      )}
    </>
  );
});

function useInfo({ carousel }: Props) {
  const { lng } = useContext(I18nextContext);

  const slides = useMemo(
    () =>
      carousel?.map((card) => (
        <SwiperSlide key={card.id}>
          <InfoCard title={card.title[lng]} content={card.subtitle[lng]} />
        </SwiperSlide>
      )),
    [carousel, lng]
  );

  return { slides };
}
