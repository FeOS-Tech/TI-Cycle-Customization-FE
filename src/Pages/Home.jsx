import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white text-gray-800">
      
      {/* Because navbar is fixed */}
      <div className="h-20" />

      {/* ====================== HERO SECTION ====================== */}
      <section
        className="w-full bg-cover bg-center text-white px-8 py-24"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format')",
        }}
      >
        <h1 className="text-5xl font-extrabold max-w-3xl">
          DESIGN YOUR DREAM BIKE AND RECEIVE IT WITHIN 8 WEEKS
        </h1>

        <p className="text-lg max-w-2xl mt-5">
          Dream it. Build it. Ride it. Customize your ideal bike with unique
          colors and components. Experience our platform offering real-time
          previews and details.
        </p>
      </section>

      {/* ====================== CATEGORY CARDS ====================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-10">

        {/* Kids Card */}
        <div
          className="bg-white rounded-xl shadow cursor-pointer p-6 text-center hover:scale-[1.02] transition"
          onClick={() => navigate("/kids")}
        >
          <img
            src="https://images.unsplash.com/photo-1520986606214-8b456906c813"
            className="rounded-xl h-48 w-full object-cover"
          />
          <h2 className="font-bold mt-4">KIDS</h2>
          <p className="text-sm mt-1">(Ages: 3 to 8)</p>
        </div>

        {/* MTB Card */}
        <div
          className="bg-white rounded-xl shadow cursor-pointer p-6 text-center hover:scale-[1.02] transition"
          onClick={() => navigate("/mtb")}
        >
          <img
            src="https://images.unsplash.com/photo-1518655048521-f130df041f66"
            className="rounded-xl h-48 w-full object-cover"
          />
          <h2 className="font-bold mt-4">MTB</h2>
          <p className="text-sm mt-1">(Ages: 8 to 20+)</p>
        </div>

        {/* Get Inspired */}
        <div
          className="bg-white rounded-xl shadow cursor-pointer p-6 text-center hover:scale-[1.02] transition"
          onClick={() => navigate("/inspired")}
        >
          <img
            src="https://images.unsplash.com/photo-1529421308411-815b29d3ea06"
            className="rounded-xl h-48 w-full object-cover"
          />
          <h2 className="font-bold mt-4">Get Inspired</h2>
          <p className="text-sm mt-1">Explore designs from other riders</p>
        </div>

      </section>

      {/* ====================== PROJECT ONE TITLE ====================== */}
      <section className="text-center py-14">
        <h1 className="text-3xl font-bold tracking-widest">PROJECT ONE</h1>
        <p className="max-w-3xl mx-auto mt-4 text-gray-600">
          As riders, we want bikes that reflect our style. Customize every part
          of your bike — from components to paint and geometry.
        </p>
      </section>

      {/* ====================== BIKE MODEL SECTION ====================== */}
      <section className="grid md:grid-cols-2 gap-10 px-6 py-10 items-center">
        
        <img
          src="https://images.unsplash.com/photo-1503779013184-4b789b9a1ab3"
          className="w-full rounded-xl shadow-lg"
        />

        <div>
          <h2 className="text-2xl font-semibold">Choose Your Model</h2>
          <p className="mt-4 text-gray-600">
            Select from road bikes, MTB models, and more. Start with a frame 
            and build your perfect ride from there.
          </p>
        </div>

      </section>

      {/* ====================== PAINT SECTION ====================== */}
      <section className="grid md:grid-cols-2 gap-10 px-6 py-16 items-center">

        <div>
          <h2 className="text-2xl font-semibold">Choose Your Paint</h2>
          <p className="mt-4 text-gray-600">
            Thousands of color schemes — from bold to simple — designed by 
            expert artists.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1547071395-1d5d8cbf9d8c"
          className="w-full rounded-xl shadow-lg"
        />

      </section>

      {/* ====================== CTA SECTION ====================== */}
      <section
        className="w-full text-white text-center px-8 py-16"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1520975928407-7044a46f7dd7')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-3xl font-bold">
          Are you ready to design the bike of your dreams?
        </h2>

        <p className="max-w-3xl mx-auto mt-4 text-lg">
          Start now and explore endless ways to customize your ride.
        </p>

        <button className="mt-6 bg-black/70 px-6 py-3 rounded-full text-white hover:bg-black transition">
          Get Started
        </button>
      </section>

    </div>
  );
}
