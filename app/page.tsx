import Script from "next/script";
// import AboutSection from "@/components/Pages/Home/AboutSection";
// import EarbudsProducts from "@/components/Pages/Home/EarbudsProducts";
// import FastChargerProduct from "@/components/Pages/Home/FastChargerProducts";
import FeatureProducts from "@/components/Pages/Home/FeatureProducts";
import FlashSale from "@/components/Pages/Home/FlashSale";
// import HomeBannerSection from "@/components/Pages/Home/HomeBannerSection";
// import HomeBannerSection2 from "@/components/Pages/Home/HomeBannerSection2";
// import NeckBandProducts from "@/components/Pages/Home/NeckBandProducts";
// import NeckBandProducts2 from "@/components/Pages/Home/NeckBandProducts2";
import NewArrival from "@/components/Pages/Home/NewArrival";
// import NewsLetter from "@/components/Pages/Home/NewsLetter";
import PopularCategories from "@/components/Pages/Home/PopularCategories";
// import PowerBankProducts from "@/components/Pages/Home/PowerBankProducts";
// import PowerBankProducts2 from "@/components/Pages/Home/PowerBankProducts2";
import HeroSlider from "@/components/ui/HeroSlider";
import FeatureSupport from "@/components/Pages/Home/FeatureSupport";
import BannerHighlights from "@/components/Pages/Home/BannerHighlights";
import NewsletterBanner from "@/components/Pages/Home/NewsLetterBanner";
import SmartPhoneBrands from "@/components/Pages/Home/SmartPhoneBrands";
import AuthenticProductsLayout from "@/components/Pages/Home/AuthenticProductsLayout";



export default function Home() {
  return (
    <div >

      <Script id="homepage-data-layer" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'page_view',
            page_type: 'home',
            timestamp: new Date().toISOString()
          });
        `}
      </Script>
      <HeroSlider /> 
      <FeatureSupport />
      <PopularCategories />
       <FlashSale/>
       <BannerHighlights/>
      <NewArrival/>
      {/* <EarbudsProducts/> */}
     
      {/* <FastChargerProduct/>
      <HomeBannerSection/>
      <PowerBankProducts/>
      <NeckBandProducts/>
      <HomeBannerSection2/>
      <PowerBankProducts2/>
      <NeckBandProducts2/> */}
      <FeatureProducts/>
      {/* <AboutSection/>
      <NewsLetter/> */}
      <SmartPhoneBrands/>
      <AuthenticProductsLayout/>
      <NewsletterBanner/>

  
    </div>
  );
}
