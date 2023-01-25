'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const categoryMostPopular = {
  name: {
    hr: "Most popular (hr)",
    en: "Most popular (en)",
    de: "Most popular (de)",
    es: "Most popular (es)",
    fr: "Most popular (fr)"
  },
  description: {
    hr: "Description (hr)",
    en: "Description (en)",
    de: "Description (de)",
    es: "Description (es)",
    fr: "Description (fr)"
  },
  image: {
    id: 6,
    name: "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    alternativeText: "",
    caption: "",
    width: 1950,
    height: 1300,
    formats: {
      large: {
        ext: ".1&auto=format&fit=crop&w=1950&q=80",
        url: "https://loc-staging.s3.eu-central-1.amazonaws.com/large_photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1950%26q%3D80",
        hash: "large_photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b",
        mime: "image/jpeg",
        name: "large_https://images.unsplash.com/photo-1513151233558-d860c5398176?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        path: null,
        size: 46.1,
        width: 1000,
        height: 667
      },
      small: {
        ext: ".1&auto=format&fit=crop&w=1950&q=80",
        url: "https://loc-staging.s3.eu-central-1.amazonaws.com/small_photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1950%26q%3D80",
        hash: "small_photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b",
        mime: "image/jpeg",
        name: "small_https://images.unsplash.com/photo-1513151233558-d860c5398176?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        path: null,
        size: 17.36,
        width: 500,
        height: 333
      },
      medium: {
        ext: ".1&auto=format&fit=crop&w=1950&q=80",
        url: "https://loc-staging.s3.eu-central-1.amazonaws.com/medium_photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1950%26q%3D80",
        hash: "medium_photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b",
        mime: "image/jpeg",
        name: "medium_https://images.unsplash.com/photo-1513151233558-d860c5398176?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        path: null,
        size: 29.92,
        width: 750,
        height: 500
      },
      thumbnail: {
        ext: ".1&auto=format&fit=crop&w=1950&q=80",
        url: "https://loc-staging.s3.eu-central-1.amazonaws.com/thumbnail_photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1950%26q%3D80",
        hash: "thumbnail_photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b",
        mime: "image/jpeg",
        name: "thumbnail_https://images.unsplash.com/photo-1513151233558-d860c5398176?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        path: null,
        size: 6.25,
        width: 234,
        height: 156
      }
    },
    hash: "photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b",
    ext: ".1&auto=format&fit=crop&w=1950&q=80",
    mime: "image/jpeg",
    size: 153.14,
    url: "https://loc-staging.s3.eu-central-1.amazonaws.com/photo_1513151233558_d860c5398176_ixid_Mnwx_Mj_A3f_DB_8_M_Hxwa_G90by1w_Y_Wdlf_Hx8f_G_Vuf_DB_8f_Hx8_and_ixlib_rb_1_2_efb2569a3b.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1950%26q%3D80",
    previewUrl: null,
    provider: "aws-s3",
    provider_metadata: null,
  }
}

module.exports = {
  categoryMostPopular,
};
