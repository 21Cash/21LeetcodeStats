// const revalidateSeconds = 1800;

// export default async function MainPage() {
//   const guardianInfoResponse = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/guardian-stats`,
//     {
//       next: { revalidate: revalidateSeconds },
//     }
//   );
//   const knightInfoResponse = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/knight-stats`,
//     {
//       next: { revalidate: revalidateSeconds },
//     }
//   );

//   const guardianInfo = await guardianInfoResponse.json();
//   const knightInfo = await knightInfoResponse.json();

//   const lastUpdatedTimestamp = knightInfo.lastUpdated;
//   const lastUpdatedDate = lastUpdatedTimestamp
//     ? new Date(
//         lastUpdatedTimestamp.seconds * 1000 +
//           lastUpdatedTimestamp.nanoseconds / 1000000
//       )
//     : null;

//   const guardianUsernameURL = `https://leetcode.com/${guardianInfo.username}`;
//   const knightUsernameURL = `https://leetcode.com/${knightInfo.username}`;

//   const guardianLastUpdatedISO = lastUpdatedDate
//     ? lastUpdatedDate.toISOString()
//     : '';
//   const guardianLastUpdatedUTC = lastUpdatedDate
//     ? lastUpdatedDate.toUTCString()
//     : 'N/A';

//   const knightLastUpdatedISO = lastUpdatedDate
//     ? lastUpdatedDate.toISOString()
//     : '';
//   const knightLastUpdatedUTC = lastUpdatedDate
//     ? lastUpdatedDate.toUTCString()
//     : 'N/A';

//   return (
//     <main className='relative min-h-screen bg-dark text-white'>
//       <header className='absolute top-0 left-0 w-full flex justify-center mt-20'>
//         <h1 className='text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-green-400 to-sky-400 text-transparent bg-clip-text drop-shadow-lg'>
//           21LeetcodeStats
//         </h1>
//       </header>

//       <section className='flex items-center justify-center min-h-screen'>
//         <div className='flex justify-center gap-36 w-full max-w-6xl'>
//           <div className='flex flex-col items-center bg-gray-800 p-10 rounded-lg shadow-lg w-6/12 hover:shadow-2xl transition-shadow duration-300 ease-in-out ring-2 ring-blue-500'>
//             <img
//               src='/Guardian.gif'
//               alt='Guardian'
//               className='w-40 h-40 mb-4'
//             />
//             <h3 className='text-lg font-semibold'>Lowest Rated Guardian:</h3>
//             <a
//               href={guardianUsernameURL}
//               target='_blank'
//               rel='noopener noreferrer'
//               className='text-base text-blue-400 hover:underline mt-2'
//             >
//               {guardianInfo.username}
//             </a>
//             <p className='text-base mt-2'>
//               Rating: {parseFloat(guardianInfo.userRating).toFixed(2)}
//             </p>
//             <p className='text-base mt-2'>
//               Global Ranking: {guardianInfo.userGlobalRanking}
//             </p>
//             <p className='text-sm mt-2'>
//               Last Updated:
//               <a
//                 href={`https://www.timeanddate.com/worldclock/fixedtime.html?iso=${guardianLastUpdatedISO}&ah=5&am=0&msg=Guardian%20Last%20Updated`}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className='text-blue-400 hover:underline ml-1'
//               >
//                 {guardianLastUpdatedUTC}
//               </a>
//             </p>
//           </div>

//           <div className='flex flex-col items-center bg-gray-800 p-10 rounded-lg shadow-lg w-6/12 hover:shadow-2xl transition-shadow duration-300 ease-in-out ring-2 ring-green-500'>
//             <img src='/Knight.gif' alt='Knight' className='w-40 h-40 mb-4' />
//             <h3 className='text-lg font-semibold'>Lowest Rated Knight:</h3>
//             <a
//               href={knightUsernameURL}
//               target='_blank'
//               rel='noopener noreferrer'
//               className='text-base text-blue-400 hover:underline mt-2'
//             >
//               {knightInfo.username}
//             </a>
//             <p className='text-base mt-2'>
//               Rating: {parseFloat(knightInfo.userRating).toFixed(2)}
//             </p>
//             <p className='text-base mt-2'>
//               Global Ranking: {knightInfo.userGlobalRanking}
//             </p>
//             <p className='text-sm mt-2'>
//               Last Updated:
//               <a
//                 href={`https://www.timeanddate.com/worldclock/fixedtime.html?iso=${knightLastUpdatedISO}&ah=5&am=0&msg=Knight%20Last%20Updated`}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className='text-blue-400 hover:underline ml-1'
//               >
//                 {knightLastUpdatedUTC}
//               </a>
//             </p>
//           </div>
//         </div>
//       </section>

//       <footer className='absolute bottom-0 left-0 w-full py-6 text-center'>
//         <p className='text-sm'>
//           Made by{' '}
//           <a
//             href='https://github.com/21Cash'
//             target='_blank'
//             rel='noopener noreferrer'
//             className='text-blue-400 hover:underline'
//           >
//             21Cash
//           </a>
//         </p>
//         <a
//           href='https://github.com/21Cash/21LeetcodeStats'
//           target='_blank'
//           rel='noopener noreferrer'
//           className='text-sm text-blue-400 hover:underline'
//         >
//           Link to GitHub Source Code
//         </a>
//       </footer>
//     </main>
//   );
// }

export default function MainPage() {
  return <>Hola Amigos</>;
}
