import CampaignTemplate from '@/app/components/CampaignTemplate';

export default function Springbok3Page() {
  
  // Define the data that will be passed to the template
  const campaignData = {
    title: "ULT Dream Careers Lion Charity Collection",
    imageUrl: "https://deins.s3.eu-central-1.amazonaws.com/images/ubu3.png", // Assuming this is the correct path to your image
    descriptionHtml: `
      <p>Welcome to the ULT Dream Careers Lions Collection, a heartfelt journey where dreams become collectibles! ✨</p>
      <p>In collaboration with UBUNɅTION, we are on a mission to make a lasting impact in Nairobi, Kenya, through UNDER Lea's TRUST (ULT). <strong>Your donation of $20 not only grants you an exclusive ULT Lion digital collectible but also empowers underprivileged children</strong>, paving the way for a brighter future and supporting ULT's vital mission.</p>
      <p>Our goal is to raise $200,000 to build a primary school in Nairobi, providing more children with access to education, empowering programs, and the promise of achieving their dream careers.</p>
      <p>Secured by the Polygon blockchain, we've created 10,000 one-of-a-kind Lions, each representing a step towards a brighter educational landscape.</p>
    `
  };

  return (
    <CampaignTemplate
      title={campaignData.title}
      imageUrl={campaignData.imageUrl}
      descriptionHtml={campaignData.descriptionHtml}
    />
  );
}