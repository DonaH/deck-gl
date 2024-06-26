// import Image from "next/image";
import GoogleMaps from '../app/components/GoogleMaps';



export default function Home() {
  return (
      <div id="app" className="bg-[#025f9e] text-center">
        <h1>React Google Maps</h1>
        <GoogleMaps />
      </div>
  );
}
