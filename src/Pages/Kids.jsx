// export default function Kids() {
//   return (
//     <div className="w-full bg-white text-gray-800">

//       {/* Because navbar is fixed */}
//       <div className="h-20" />

//       {/* ====================== HERO SECTION ====================== */}
//       <section
//         className="w-full h-72 bg-cover bg-center flex items-center px-10 text-white"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1508051123996-69f8caf4891e')",
//         }}
//       >
//         <h1 className="text-5xl font-bold">Kids</h1>
//       </section>

//       {/* ====================== 4 FEATURED CARDS ====================== */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 px-10 py-16">

//         {/* SPACE */}
//         <div className="relative shadow rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition">
//           <img
//             src="https://images.unsplash.com/photo-1581092795360-1c2c8c8f4b98"
//             className="w-full h-64 object-cover"
//           />
//           <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
//             SPACE
//           </h2>
//         </div>

//         {/* KIDS */}
//         <div className="relative shadow rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition">
//           <img
//             src="https://images.unsplash.com/photo-1520986606214-8b456906c813"
//             className="w-full h-64 object-cover"
//           />
//           <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
//             KIDS
//           </h2>
//         </div>

//         {/* CAR */}
//         <div className="relative shadow rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition">
//           <img
//             src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
//             className="w-full h-64 object-cover"
//           />
//           <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
//             CAR
//           </h2>
//         </div>

//         {/* FANTASY */}
//         <div className="relative shadow rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition">
//           <img
//             src="https://images.unsplash.com/photo-1544473244-f66c1d1d1aa1"
//             className="w-full h-64 object-cover"
//           />
//           <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
//             FANTASY
//           </h2>
//         </div>

//       </div>

//       {/* ====================== EMPTY FOOTER SPACE (optional) ====================== */}
//       <div className="bg-yellow-400 text-center py-10 font-bold text-lg">
//         Footer coming soon
//       </div>
//     </div>
//   );
// }
// // src/pages/Kids.jsx
// import { useNavigate } from "react-router-dom";

// export default function Kids() {
//   const navigate = useNavigate();

//   const goToTheme = (theme) => {
//     navigate(`/kids/${theme}`); // e.g. /kids/SPACE
//   };

//   return (
//     <div className="w-full bg-white text-gray-800">

//       {/* Because navbar is fixed */}
//       <div className="h-20" />

//       {/* ====================== HERO SECTION ====================== */}
//       <section
//         className="w-full h-72 bg-cover bg-center flex items-center px-10 text-white"
//         style={{
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1508051123996-69f8caf4891e')",
//         }}
//       >
//         <h1 className="text-5xl font-bold">Kids</h1>
//       </section>

//       {/* ====================== 4 FEATURED CARDS ====================== */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 px-10 py-16">

//         {/* SPACE */}
//         <div
//           className="relative shadow rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition"
//           onClick={() => goToTheme("SPACE")}
//         >
//           <img
//             src="https://images.unsplash.com/photo-1581092795360-1c2c8c8f4b98"
//             className="w-full h-64 object-cover"
//           />
//           <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
//             SPACE
//           </h2>
//         </div>

//         {/* KIDS */}
//         <div
//           className="relative shadow rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition"
//           onClick={() => goToTheme("KIDS")}
//         >
//           <img
//             src="https://images.unsplash.com/photo-1520986606214-8b456906c813"
//             className="w-full h-64 object-cover"
//           />
//           <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
//             KIDS
//           </h2>
//         </div>

//         {/* CAR */}
//         <div
//           className="relative shadow rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition"
//           onClick={() => goToTheme("CAR")}
//         >
//           <img
//             src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
//             className="w-full h-64 object-cover"
//           />
//           <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
//             CAR
//           </h2>
//         </div>

//         {/* FANTASY */}
//         <div
//           className="relative shadow rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition"
//           onClick={() => goToTheme("FANTASY")}
//         >
//           <img
//             src="https://images.unsplash.com/photo-1544473244-f66c1d1d1aa1"
//             className="w-full h-64 object-cover"
//           />
//           <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
//             FANTASY
//           </h2>
//         </div>

//       </div>

//       {/* ====================== EMPTY FOOTER SPACE (optional) ====================== */}
//       <div className="bg-yellow-400 text-center py-10 font-bold text-lg">
//         Footer coming soon
//       </div>
//     </div>
//   );
// }
// src/pages/Kids.jsx
import { useNavigate } from "react-router-dom";
import car from "../assets/theme/Car.png";
import football from "../assets/theme/Football.png";

export default function Kids() {
  const navigate = useNavigate();

  // Themes configuration – label is UI, slug is for URL + backend
  const themes = [
    {
      label: "MOTO - CARS",
      slug: "car-decal", // 👈 matches themeSlug in MongoDB
      image: car,
    },
    {
      label: "FOOTBALL",
      slug: "foot-ball",
      image: football,
    },
  ];

  const goToTheme = (slug) => {
    // Will navigate to /kids/car-decal or /kids/space etc.
    navigate(`/kids/${slug}`);
  };

  return (
    <div className="w-full bg-white text-gray-800">
      {/* HERO SECTION */}
      <section
        // className="w-full h-72 bg-cover bg-center flex items-center px-10 text-white"
        className="w-full h-48 sm:h-56 md:h-72 bg-cover bg-center flex items-center px-4 sm:px-8 md:px-10 text-white"
        style={{
          backgroundImage:
            "url('https://trackandtrail.in/cdn/shop/files/Kids_2_1500x300px.jpg?v=1739801626')",
        }}
      >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Kids</h1>
      </section>

      {/* THEME CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 p-14">
        {themes.map((theme) => (
          // <div
          //   key={theme.slug}
          //   className="relative shadow rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition"
          //   onClick={() => goToTheme(theme.slug)}
          // >
          //   <img
          //     src={theme.image}
          //     className="w-full h-40 object-cover"
          //     alt={theme.label}
          //   />
          //   <h2 className="absolute bottom-4 left-4 text-3xl font-bold drop-shadow">
          //     {theme.label}
          //   </h2>
          // </div>
          <div
            key={theme.slug}
            className="
              relative
              shadow
              rounded-xl
              overflow-hidden
              cursor-pointer
              hover:scale-[1.02]
              transition
              bg-white
            "
            onClick={() => goToTheme(theme.slug)}
          >
            <img
              src={theme.image}
              alt={theme.label}
              className="w-full aspect-[4/3] object-contain bg-white"
            />

            <h2 className="
              absolute
              bottom-3 left-3
              text-lg sm:text-xl md:text-2xl
              font-bold
              drop-shadow
            ">
              {theme.label}
            </h2>
          </div>

        ))}
      </div>

      {/* FOOTER */}
      {/* <div className="bg-yellow-400 text-center py-10 font-bold text-lg">
        Footer coming soon
      </div> */}
    </div>
  );
}
