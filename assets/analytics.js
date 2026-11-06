// Change only this ID. The placeholder does not contact Google Analytics.
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
if (GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
 window.dataLayer = window.dataLayer || [];
 window.gtag = function(){ window.dataLayer.push(arguments); };
 gtag('js', new Date()); gtag('config', GA_MEASUREMENT_ID);
 const script=document.createElement('script');script.async=true;
 script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA_MEASUREMENT_ID);
 document.head.append(script);
}
